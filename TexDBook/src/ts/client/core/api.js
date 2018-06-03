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
                .map(async (isbn) => await isbn.fetchBook())),
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
    async resolveIsbn(isbn) {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn.isbn13}`);
        const { totalItems, items } = await response.json();
        if (totalItems === 0) {
            throw new Error("Cannot resolve ISBN: " + isbn.isbn13Hyphenated);
        }
        const [{ volumeInfo }] = items;
        // need to copy fields b/c Google Books API sends extra fields that we want to exclude.
        const { title, authors, publisher, publishedDate, description, pageCount, categories, averageRating, ratingsCount, imageLinks, language, previewLink, infoLink, link, } = volumeInfo;
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
            link: link,
        };
    },
};
//# sourceMappingURL=api.js.map