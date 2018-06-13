"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Isbn_1 = require("../../share/core/Isbn");
const utils_1 = require("../../share/util/utils");
const anyWindow_1 = require("../util/anyWindow");
const fetchJson_1 = require("../util/fetch/fetchJson");
const hash_1 = require("../util/hash");
const TexDBook_1 = require("./TexDBook");
const toIsLoggedIn = function (negate, response) {
    return {
        isLoggedIn: negate ? !response.success : response.success,
        message: response.message,
    };
};
const userBooks = async function (field) {
    await TexDBook_1.onLogin;
    const { response } = await fetchJson_1.fetchJson(`/${field}Books`, undefined, {
        cache: "reload",
    });
    return (response || [])
        .map(({ barcode, isbnBook, owner, lender, borrower }) => {
        const isbn = Isbn_1.Isbn.parse(isbnBook.isbn);
        isbn.setBook(isbnBook);
        return { barcode, isbn, owner, lender, borrower };
    });
};
exports.api = {
    async login(username, password) {
        return toIsLoggedIn(false, await fetchJson_1.fetchJson("/login", {
            username,
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
            username,
            password: hashedPassword,
            passwordConfirmation: hashedPassword,
        }, {
            cache: "reload",
        });
    },
    async allIsbns() {
        const { response, success } = await fetchJson_1.fetchJson("/allIsbns", undefined, {
            cache: "reload",
        });
        if (!success) {
            await utils_1.sleep(10);
            location.reload(true);
        }
        return (response || [])
            .map(isbn => Isbn_1.Isbn.parse(isbn))
            .filter(isbn => isbn); // filter nulls, but there shouldn't be any
    },
    async allUsers() {
        const { response: { users = [] } = { users: [] } } = await fetchJson_1.fetchJson("/allUsers", undefined, {
            cache: "reload",
        });
        return users;
    },
    userBooks: userBooks,
    ownBooks: () => userBooks("own"),
    lentBooks: () => userBooks("lent"),
    borrowedBooks: () => userBooks("borrowed"),
    async uploadBooks(books) {
        const { success, message, response } = await fetchJson_1.fetchJson("/uploadBooks", {
            csrfToken: TexDBook_1.TexDBook.csrfToken,
            books: books.map(({ barcode, isbn: { isbn13: isbn } }) => ({ barcode, isbn })),
            isbns: await Promise.all(Array.from(new Set(books.map(book => book.isbn)))
                .map(async (isbn) => await isbn.fetchBook())),
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
        return response
            .books
            .map(({ book: { barcode, isbn }, response }) => ({
            book: {
                barcode,
                isbn: Isbn_1.Isbn.parse(isbn),
            },
            response,
        }));
    },
    async resolveIsbn(isbn) {
        const { isbn13, department } = isbn;
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn.isbn13}`, {
            cache: "force-cache",
        });
        const { totalItems, items } = await response.json();
        if (totalItems === 0) {
            throw new Error("Cannot resolve ISBN: " + isbn.isbn13Hyphenated);
        }
        const [{ volumeInfo }] = items;
        // need to copy fields b/c Google Books API sends extra fields that we want to exclude.
        const { title, authors, publisher, publishedDate, description, pageCount, categories, averageRating, ratingsCount, imageLinks: { smallThumbnail, thumbnail } = { smallThumbnail: undefined, thumbnail: undefined }, language, previewLink, infoLink, canonicalVolumeLink: link, } = volumeInfo;
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
};
anyWindow_1.anyWindow.api = exports.api;
//# sourceMappingURL=api.js.map