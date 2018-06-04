import {Isbn} from "../../share/core/Isbn";
import {IsbnBook} from "../../share/core/IsbnBook";
import {anyWindow} from "../util/anyWindow";
import {fetchJson, RestResponse} from "../util/fetch/fetchJson";
import {SHA} from "../util/hash";
import {Barcode} from "./Books";
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

export interface BookUploadResponse {
    
    readonly barcode: Barcode;
    readonly response: RestResponse<{}>;
    
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

interface GoogleBooksResponse {
    
    readonly totalItems: number;
    readonly items: ReadonlyArray<{
        readonly volumeInfo: IsbnBook;
    }>;
    
}

export interface TexDBookApi {
    
    login(username: string, password: string): Promise<IsLoggedIn>;
    
    logout(): Promise<IsLoggedIn>;
    
    createAccount(username: string, password: string, passwordConfirmation: string): Promise<RestResponse<{}>>;
    
    allIsbns(): Promise<Isbn[]>;
    
    ownBooks(): Promise<BookUpload[]>;
    
    uploadBooks(books: BookUpload[]): Promise<BookUploadResponse[]>;
    
    resolveIsbn(isbn: Isbn): Promise<IsbnBook>;
    
}

export const api: TexDBookApi = {
    
    async login(username: string, password: string): Promise<IsLoggedIn> {
        return toIsLoggedIn(false, await fetchJson<LoginArgs, {}>("/login", {
            username: username,
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
            username: username,
            password: hashedPassword,
            passwordConfirmation: hashedPassword,
        }, {
            cache: "reload",
        });
    },
    
    async allIsbns(): Promise<Isbn[]> {
        const response: RestResponse<string[]> = await fetchJson<undefined, string[]>("/allIsbns", undefined, {
            cache: "reload",
        });
        return (response.response || [])
            .map(isbn => Isbn.parse(isbn))
            .filter(isbn => isbn) as Isbn[]; // filter nulls, but there shouldn't be any
    },
    
    async ownBooks(): Promise<BookUpload[]> {
        await onLogin;
        const response: RestResponse<RawBookUpload[]> = await fetchJson<undefined, RawBookUpload[]>("/ownBooks",
            undefined, {
                cache: "reload",
            });
        return (response.response || [])
            .map(book => ({
                barcode: book.barcode,
                isbn: Isbn.parse(book.isbn) as Isbn,
            }));
    },
    
    async uploadBooks(books: BookUpload[]): Promise<BookUploadResponse[]> {
        type BookUploadResponses = {books: BookUploadResponse[]};
        const response: RestResponse<BookUploadResponses> = await fetchJson<BooksUpload, BookUploadResponses>(
            "/uploadBooks", {
                csrfToken: TexDBook.csrfToken,
                books: books.map(book => ({
                    barcode: book.barcode,
                    isbn: book.isbn.isbn13,
                })),
                isbns: await Promise.all(
                    Array.from(new Set(books.map(book => book.isbn)))
                        .map(async isbn => await isbn.fetchBook())
                ),
            });
        if (!response.success) {
            return books.map(book => ({
                barcode: book.barcode,
                isbn: book.isbn,
                response: {
                    success: false,
                    message: response.message,
                },
            }));
        }
        return (response.response as BookUploadResponses).books;
    },
    
    async resolveIsbn(isbn: Isbn): Promise<IsbnBook> {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn.isbn13}`);
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
            imageLinks,
            language,
            previewLink,
            infoLink,
            canonicalVolumeLink,
        } = volumeInfo as IsbnBook & {canonicalVolumeLink: string};
        return {
            isbn: isbn.isbn13,
            title: title,
            authors: authors,
            publisher: publisher,
            publishedDate: publishedDate,
            description: description,
            pageCount: pageCount,
            categories: categories,
            averageRating: averageRating,
            ratingsCount: ratingsCount,
            imageLinks: imageLinks,
            language: language,
            previewLink: previewLink,
            infoLink: infoLink,
            link: canonicalVolumeLink,
        };
    },
    
};

anyWindow.api = api;