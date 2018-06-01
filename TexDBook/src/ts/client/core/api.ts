import {Isbn} from "../../share/core/Isbn";
import {IsbnBook} from "../../share/core/IsbnBook";
import {fetchJson, RestResponse} from "../util/fetch/fetchJson";
import {SHA} from "../util/hash";
import {TexDBook} from "./TexDBook";
import {IsLoggedIn} from "./views/LoginComponent";

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
    
    readonly barcode: string;
    readonly isbn: Isbn;
    
}

export interface BookUploadResponse {
    
    readonly barcode: string;
    readonly response: RestResponse<{}>;
    
}

interface RawBookUpload {
    
    readonly barcode: string;
    readonly isbn: string;
    
}

interface BooksUpload {
    
    readonly csrfToken: string;
    readonly books: RawBookUpload[];
    readonly isbns: (IsbnBook & {readonly isbn: string})[];
}

export interface TexDBookApi {
    
    login(username: string, password: string): Promise<IsLoggedIn>;
    
    logout(): Promise<IsLoggedIn>;
    
    createAccount(username: string, password: string, passwordConfirmation: string): Promise<RestResponse<{}>>;
    
    allIsbns(): Promise<Isbn[]>;
    
    ownBarcodes(): Promise<BookUpload[]>;
    
    uploadBooks(books: BookUpload[]): Promise<BookUploadResponse[]>;
    
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
        const response: RestResponse<string[]> = await fetchJson<undefined, string[]>("/AllBooks", undefined, {
            cache: "reload",
        });
        return (response.response || [])
            .map(isbn => Isbn.parse(isbn))
            .filter(isbn => isbn) as Isbn[]; // filter nulls, but there shouldn't be any
    },
    
    async ownBarcodes(): Promise<BookUpload[]> {
        const response: RestResponse<RawBookUpload[]> = await fetchJson<undefined, RawBookUpload[]>("/ownBarcodes",
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
        const response: RestResponse<BookUploadResponse[]> = await fetchJson<BooksUpload, BookUploadResponse[]>(
            "/uploadBooks", {
                csrfToken: TexDBook.csrfToken,
                books: books.map(book => ({
                    barcode: book.barcode,
                    isbn: book.isbn.isbn13,
                })),
                isbns: await Promise.all(
                    Array.from(new Set(books.map(book => book.isbn)))
                        .map(async isbn => ({
                            isbn: isbn.isbn13,
                            ...await isbn.fetchBook(),
                        }))
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
        return response.response as BookUploadResponse[];
    },
    
};


async function searchISBN(isbn: string) : Promise<{title : string, author : string[], publisher : string, date: number, description : string, isbn: string, pages : number, categories : string[], rating : number, images : string[]}> {
      var resp = await fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn);
      var r = await resp.json();
      return {
      	     "title": r.items[0].volumeInfo.title,
	     "author": r.items[0].volumeInfo.authors,
	     "publisher": r.items[0].volumeInfo.publisher,
	     "date": parseInt(r.items[0].volumeInfo.publishedDate),
	     "description": r.items[0].volumeInfo.description,
	     "isbn": isbn,
	     "pages" : r.items[0].volumeInfo.pageCount,
	     "categories" : r.items[0].volumeInfo.categories,
	     "rating" : r.items[0].volumeInfo.averageRating,
	     "images" : r.items[0].volumeInfo.imageLinks
	    };
};

(window as any).searchISBN = searchISBN;