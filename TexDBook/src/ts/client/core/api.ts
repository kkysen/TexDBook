import {Barcode, Book} from "../../share/core/Book";
import {Isbn} from "../../share/core/Isbn";
import {IsbnBook} from "../../share/core/IsbnBook";
import {User} from "../../share/core/User";
import {anyWindow} from "../util/anyWindow";
import {fetchJson, RestResponse} from "../util/fetch/fetchJson";
import {SHA} from "../util/hash";
import {IsLoggedIn, onLogin, TexDBook} from "./TexDBook";

type LoginArgs = {
    username: string,
    password: string,
};

type CreateAccountArgs = LoginArgs & {
    passwordConfirmation: string,
};

const toIsLoggedIn = function(negate: boolean, response: RestResponse<{}>) {
    return {
        isLoggedIn: negate ? !response.success : response.success,
        message: response.message,
    };
};

export interface BookUpload {
    
    readonly barcode: Barcode;
    readonly isbn: Isbn;
    
}

interface RawBookUpload {
    
    readonly barcode: string;
    readonly isbn: string;
    
}

interface BooksUpload {
    
    readonly csrfToken: string;
    readonly books: RawBookUpload[];
    readonly isbns: IsbnBook[];
}

interface RawBookUploadResponse {
    
    readonly book: RawBookUpload;
    readonly response: RestResponse<{}>;
    
}

export interface BookUploadResponse {
    
    readonly book: BookUpload;
    readonly response: RestResponse<{}>;
    
}

interface GoogleBooksResponse {
    
    readonly totalItems: number;
    readonly items: ReadonlyArray<{
        readonly volumeInfo: IsbnBook;
    }>;
    
}

type ServerBook = Book & {
    
    readonly isbnBook: IsbnBook;
    
};

export type BookState = "own" | "lent" | "borrowed";

export interface TexDBookApi {
    
    login(username: string, password: string): Promise<IsLoggedIn>;
    
    logout(): Promise<IsLoggedIn>;
    
    createAccount(username: string, password: string, passwordConfirmation: string): Promise<RestResponse<{}>>;
    
    allIsbns(): Promise<Isbn[]>;
    
    allUsers(): Promise<User[]>;
    
    userBooks(field: BookState): Promise<Book[]>;
    
    ownBooks(): Promise<Book[]>;
    
    lentBooks(): Promise<Book[]>;
    
    borrowedBooks(): Promise<Book[]>;
    
    uploadBooks(books: BookUpload[]): Promise<BookUploadResponse[]>;
    
    resolveIsbn(isbn: Isbn): Promise<IsbnBook>;
    
    makeTransaction(borrowing: boolean, otherUserId: number, barcode: string): Promise<void>;
    
}

const userBooks = async function(field: BookState): Promise<Book[]> {
    await onLogin;
    const {response} = await fetchJson<undefined, ServerBook[]>(`/${field}Books`,
        undefined, {
            cache: "reload",
        });
    return (response || [])
        .map(({barcode, isbnBook, owner, lender, borrower}) => {
            const isbn: Isbn = Isbn.parse(isbnBook.isbn) as Isbn;
            isbn.setBook(isbnBook);
            return {barcode, isbn, owner, lender, borrower};
        });
};

export const api: TexDBookApi = {
    
    async login(username: string, password: string): Promise<IsLoggedIn> {
        return toIsLoggedIn(false, await fetchJson<LoginArgs, {}>("/login", {
            username,
            password: await SHA._256.hash(password), // pre hash on client side
        }, {
            cache: "reload",
        }));
    },
    
    async logout(): Promise<IsLoggedIn> {
        return toIsLoggedIn(true, await fetchJson("/logout", undefined, {
            cache: "reload",
        }));
    },
    
    async createAccount(username: string, password: string, passwordConfirmation: string): Promise<RestResponse<{}>> {
        if (password !== passwordConfirmation) {
            return {
                success: false,
                message: "Passwords don't match",
            };
        }
        const hashedPassword: string = await SHA._256.hash(password);
        return await fetchJson<CreateAccountArgs, {}>("/createAccount", {
            username,
            password: hashedPassword,
            passwordConfirmation: hashedPassword,
        }, {
            cache: "reload",
        });
    },
    
    async allIsbns(): Promise<Isbn[]> {
        const {response, success} = await fetchJson<undefined, string[]>("/allIsbns", undefined, {
            cache: "reload",
        });
        if (!success) {
            // location.reload(true);
            // shouldn't need to reload anymore, "fixed" invalid session bug on backend
        }
        return (response || [])
            .map(isbn => Isbn.parse(isbn))
            .filter(isbn => isbn) as Isbn[]; // filter nulls, but there shouldn't be any
    },
    
    async allUsers(): Promise<User[]> {
        const {response: {users = []} = {users: []}} = await fetchJson<undefined, {users: User[]}>("/allUsers",
            undefined, {
                cache: "reload",
            });
        return users;
    },
    
    userBooks: userBooks,
    
    ownBooks: () => userBooks("own"),
    
    lentBooks: () => userBooks("lent"),
    
    borrowedBooks: () => userBooks("borrowed"),
    
    async uploadBooks(books: BookUpload[]): Promise<BookUploadResponse[]> {
        type BookUploadResponses = {books: RawBookUploadResponse[]};
        const {success, message, response} = await fetchJson<BooksUpload, BookUploadResponses>(
            "/uploadBooks", {
                csrfToken: TexDBook.csrfToken,
                books: books.map(({barcode, isbn: {isbn13: isbn}}) => ({barcode, isbn})),
                isbns: await Promise.all(
                    Array.from(new Set(books.map(book => book.isbn)))
                        .map(async isbn => await isbn.fetchBook())
                ),
            });
        if (!success) {
            return books.map(book => ({
                book,
                response: {
                    success,
                    message,
                },
            }));
        }
        return (response as BookUploadResponses)
            .books
            .map(({book: {barcode, isbn}, response}) => ({
                book: {
                    barcode,
                    isbn: Isbn.parse(isbn) as Isbn,
                },
                response,
            }));
    },
    
    async resolveIsbn(isbn: Isbn): Promise<IsbnBook> {
        const {isbn13, department} = isbn;
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn.isbn13}`, {
            cache: "force-cache",
        });
        const {totalItems, items} = <GoogleBooksResponse> await response.json();
        if (totalItems === 0) {
            throw new Error("Cannot resolve ISBN: " + isbn.isbn13Hyphenated);
        }
        const [{volumeInfo}] = items;
        // need to copy fields b/c Google Books API sends extra fields that we want to exclude.
        const {
            title,
            authors,
            publisher,
            publishedDate,
            description,
            pageCount,
            categories,
            averageRating,
            ratingsCount,
            imageLinks: {smallThumbnail, thumbnail} = {smallThumbnail: undefined, thumbnail: undefined},
            language,
            previewLink,
            infoLink,
            canonicalVolumeLink: link,
        } = volumeInfo as IsbnBook & {
            imageLinks: {
                smallThumbnail: string;
                thumbnail: string;
            };
            canonicalVolumeLink: string;
        };
        
        return {
            isbn: isbn13,
            department,
            
            title,
            authors,
            publisher,
            publishedDate,
            description,
            pageCount,
            categories,
            averageRating,
            ratingsCount,
            image: thumbnail || smallThumbnail,
            language,
            previewLink,
            infoLink,
            link,
        };
    },
    
    async makeTransaction(borrowing: boolean, otherUserId: number, barcode: string): Promise<void> {
        const {success, message, response} = await fetchJson("/makeTransaction", {
            borrowing,
            otherUserId,
            barcode,
        });
        if (!success) {
            alert(message);
        }
    },
    
};

anyWindow.api = api;