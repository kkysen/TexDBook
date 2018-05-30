"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Isbn_1 = require("../../share/core/Isbn");
const MultiBiMap_1 = require("../../share/util/MultiBiMap");
const api_1 = require("./api");
const Books = {
    new() {
        const barcodes = new Map();
        const isbns = new Map();
        const addIsbn = function (isbn) {
            return true;
        };
        return {};
    }
};
exports.allIsbns = (() => {
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
    const assignBarcode = function (book) {
        addIsbn(book.isbn);
        if (server.hasKey(book.barcode) || client.hasKey(book.barcode)) {
            return false;
        }
        client.put(book.barcode, book.isbn);
        return true;
    };
    let initialized = false;
    const loadInitial = async function () {
        const isbns = api_1.api.allIsbns();
        const barcodes = api_1.api.ownBarcodes();
        (await isbns).forEach(addExistingIsbn);
        // barcodes must be added afterwards
        (await barcodes).forEach(assignExistingBarcode);
        initialized = true;
    };
    // noinspection JSIgnoredPromiseFromCall
    loadInitial();
    const sync = async function () {
        const books = Array.from(client.keyEntries())
            .map(([barcode, isbn]) => ({ barcode: barcode, isbn: isbn }));
        loadInitial();
        const uploadResponse = api_1.api.uploadBooks(books);
        transitioning.putAllFrom(client);
        server.putAllFrom(client);
        // (await uploadResponse)
        //     .filter()
    };
    return {
        addIsbn: addIsbnString,
        assignBarcode: assignBarcode,
        async sync(books) {
            Array.from([])
                .map(async (isbn) => {
                return {};
            });
        },
    }.freeze();
})();
//# sourceMappingURL=Books.js.map