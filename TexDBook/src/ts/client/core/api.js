"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Isbn_1 = require("../../share/core/Isbn");
const fetchJson_1 = require("../util/fetch/fetchJson");
const hash_1 = require("../util/hash");
const TexDBook_1 = require("./TexDBook");
const toIsLoggedIn = function (negate, response) {
    return {
        isLoggedIn: negate ? !response.success : response.success,
        message: response.message,
    };
};
exports.api = {
    async login(username, password) {
        return toIsLoggedIn(false, await fetchJson_1.fetchJson("/login", {
            username: username,
            password: await hash_1.SHA._256.hash(password),
        }, {
            cache: "reload",
        }));
    },
    async logout() {
        return toIsLoggedIn(true, await fetchJson_1.fetchJson("/logout", undefined, {
            cache: "reload",
        }));
    },
    async createAccount(username, password, passwordConfirmation) {
        if (password !== passwordConfirmation) {
            return {
                success: false,
                message: "Passwords don't match",
            };
        }
        const hashedPassword = await hash_1.SHA._256.hash(password);
        return await fetchJson_1.fetchJson("/createAccount", {
            username: username,
            password: hashedPassword,
            passwordConfirmation: hashedPassword,
        }, {
            cache: "reload",
        });
    },
    async allIsbns() {
        const response = await fetchJson_1.fetchJson("/allIsbns", undefined, {
            cache: "reload",
        });
        return (response.response || [])
            .map(isbn => Isbn_1.Isbn.parse(isbn))
            .filter(isbn => isbn); // filter nulls, but there shouldn't be any
    },
    async ownBarcodes() {
        const response = await fetchJson_1.fetchJson("/ownBarcodes", undefined, {
            cache: "reload",
        });
        return (response.response || [])
            .map(book => ({
            barcode: book.barcode,
            isbn: Isbn_1.Isbn.parse(book.isbn),
        }));
    },
    async uploadBooks(books) {
        const response = await fetchJson_1.fetchJson("/uploadBooks", {
            csrfToken: TexDBook_1.TexDBook.csrfToken,
            books: books.map(book => ({
                barcode: book.barcode,
                isbn: book.isbn.isbn13,
            })),
            isbns: await Promise.all(Array.from(new Set(books.map(book => book.isbn)))
                .map(async (isbn) => ({
                isbn: isbn.isbn13,
                ...await isbn.fetchBook(),
            }))),
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
        return response.response;
    },
};
// async function searchISBN(isbn: string) : Promise<{title : string, author : string[], publisher : string,
// 	 		  	    date: number, description : string, isbn: string}> {
// 	 const response2: Response = await fetch("url");
// 	 return response2.json();
//
//     let response = JSON.parse("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn);
// 	 return {
// 	 	title : response.volumeInfo.title;
// 		author : response.volumeInfo.authors;
// 		publisher : response.volumeInfo.publisher;
// 		date : response.volumeInfo.publishedDate;
// 		description : response.volumeInfo.description;
// 		isbn : isbn;
// 		};
// };
//# sourceMappingURL=api.js.map