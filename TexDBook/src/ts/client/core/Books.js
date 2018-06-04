"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Isbn_1 = require("../../share/core/Isbn");
const MultiBiMap_1 = require("../../share/util/MultiBiMap");
const anyWindow_1 = require("../util/anyWindow");
const api_1 = require("./api");
const createAllBooks = function () {
    // TODO FIXME not sure if this is the right way
    const server = MultiBiMap_1.MultiBiMap.new();
    const client = MultiBiMap_1.MultiBiMap.new();
    const transitioning = MultiBiMap_1.MultiBiMap.new();
    const addExistingIsbn = function (isbn) {
        server.putValue(isbn);
    };
    const addIsbn = function (isbn) {
        if (server.hasValue(isbn) || client.hasValue(isbn)) {
            return false;
        }
        (async () => {
            const book = await isbn.fetchBook();
            // TODO verify book
        })();
        client.putValue(isbn);
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
    const assignExistingBarcode = function (book) {
        server.put(book.barcode, book.isbn);
    };
    const hasBarcode = function (barcode) {
        return server.hasKey(barcode) || client.hasKey(barcode);
    };
    const assignBarcode = function (book) {
        addIsbn(book.isbn);
        if (hasBarcode(book.barcode)) {
            return false;
        }
        client.put(book.barcode, book.isbn);
        return true;
    };
    let initialized = false;
    const loadInitial = async function () {
        const isbns = api_1.api.allIsbns();
        const barcodes = api_1.api.ownBooks();
        (await isbns).forEach(addExistingIsbn);
        // barcodes must be added afterwards
        (await barcodes).forEach(assignExistingBarcode);
        initialized = true;
    };
    // noinspection JSIgnoredPromiseFromCall
    loadInitial();
    const undoFailedBooks = function (uploadResponse) {
        uploadResponse
            .filter(book => book.response.success)
            .map(book => book.barcode)
            .forEach(transitioning.removeKey);
        client.putAllFrom(transitioning);
        const failedBarcodes = Array.from(transitioning.keys());
        failedBarcodes.forEach(server.removeKey);
        return failedBarcodes;
    };
    const sync = async function () {
        const books = Array.from(client.keyEntries())
            .map(([barcode, isbn]) => ({ barcode: barcode, isbn: isbn }));
        // noinspection JSIgnoredPromiseFromCall
        loadInitial();
        const uploadResponse = api_1.api.uploadBooks(books);
        transitioning.putAllFrom(client);
        server.putAllFrom(client);
        return undoFailedBooks(await uploadResponse);
    };
    return {
        addIsbn: addIsbnString,
        hasBarcode: hasBarcode,
        assignBarcode: assignBarcode,
        sync: sync,
    };
};
exports.allBooks = createAllBooks().freeze();
anyWindow_1.anyWindow.allBooks = exports.allBooks;
//# sourceMappingURL=Books.js.map