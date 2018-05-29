"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Isbn_1 = require("../../share/core/Isbn");
const api_1 = require("./api");
const Books = {
    new() {
        const barcodes = new Map();
        const isbns = new Map();
        const addIsbn = function (isbn) {
        };
    }
};
exports.allIsbns = (() => {
    const barcodes = new Map();
    const serverIsbns = new Set();
    const clientIsbns = new Set();
    const transitioningIsbns = new Set();
    const addExistingIsbn = function (isbn) {
        serverIsbns.add(isbn);
    };
    const addIsbn = function (isbn) {
        if (serverIsbns.has(isbn) || clientIsbns.has(isbn)) {
            return false;
        }
        (async () => {
            const book = await isbn.fetchBook();
            // TODO verify book
        })();
        clientIsbns.add(isbn);
        return true;
    };
    /**
     *
     * @param {string} isbnString isbn to add
     * @returns {boolean} true if a new isbn was added
     */
    const addIsbnString = function (isbnString) {
        const isbn = Isbn_1.Isbn.parse(isbnString);
        if (!isbn) {
            return false;
        }
        return addIsbn(isbn);
    };
    const assignBarcode = function (book) {
        if (!serverIsbns.has(book.isbn)) {
            clientIsbns.add(book.isbn);
        }
        if (barcodes.has(book.barcode)) {
            return false;
        }
        barcodes.set(book.barcode, book);
        return true;
    };
    let initialized = false;
    const loadInitial = async function () {
        const isbns = api_1.api.allIsbns();
        const barcodes = api_1.api.ownBarcodes();
        (await isbns).forEach(addExistingIsbn);
        // barcodes must be added afterwards
        (await barcodes).forEach(assignBarcode);
        initialized = true;
    };
    // noinspection JSIgnoredPromiseFromCall
    loadInitial();
    const sync = async function () {
    };
    return {
        addIsbn: addIsbnString,
        assignBarcode: assignBarcode,
        async sync(books) {
            Array.from(clientIsbns)
                .map(async (isbn) => {
                return {};
            });
        },
    }.freeze();
})();
//# sourceMappingURL=Books.js.map