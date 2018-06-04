import {Isbn} from "../../share/core/Isbn";
import {IsbnBook} from "../../share/core/IsbnBook";
import {MultiBiMap} from "../../share/util/MultiBiMap";
import {anyWindow} from "../util/anyWindow";
import {api, BookUpload, BookUploadResponse} from "./api";

export type Barcode = string;

/**
 * Keeps tracks of two sets of Isbns:
 *     1. (server) Isbn's already on server, retrieved via api.allIsbns().
 *        The IsbnBooks for these Isbn's don't need to be fetched
 *        since they are already on the server.
 *     2. (client) Isbn's uploaded by the user that haven't been sent to the server yet.
 *        Once sent to the server via api.uploadBooks(),
 *        they will be moved to the server Isbns aggressively,
 *        and if api.uploadBooks() fails, they are removed from the server Isbns.
 *
 * When the user inputs a new Isbn, it is immediately parsed.
 * If it already exists in the server or client Isbns, nothing happens.
 * If it doesn't exist yet, it is added to the client Isbns and it's IsbnBook is fetched immediately.
 *
 * When the user clicks upload, all the client Isbns are sent,
 * along with their fetched IsbnBook and csrfToken (for data verification),
 * to the server via api.uploadBooks() and then moved to the server Isbns.
 * If api.uploadBooks() fails for any Isbns,
 * those Isbns are returned back to the client Isbn and the user notified.
 *
 * When api.uploadBooks() is called, all the Isbn.fetchBook() calls must be awaited.
 *
 * Whenever the user enters an Isbn,
 * if at any point it's verification fails,
 * due to Isbn.parse(), Isbn.fetchBook(), or api.uploadBooks(),
 * the user will be immediately notified.
 */
export interface Books {
    
    addIsbn(isbn: string): boolean;
    
    hasBarcode(barcode: Barcode): boolean;
    
    assignBarcode(book: BookUpload): boolean;
    
    sync(): Promise<Barcode[]>;
    
}

const createAllBooks = function(): Books {
    
    // TODO FIXME not sure if this is the right way
    
    type Books = MultiBiMap<Barcode, Isbn>;
    
    const server: Books = MultiBiMap.new();
    const client: Books = MultiBiMap.new();
    const transitioning: Books = MultiBiMap.new();
    
    const addExistingIsbn = function(isbn: Isbn): void {
        server.putValue(isbn);
    };
    
    const addIsbn = function(isbn: Isbn): boolean {
        if (server.hasValue(isbn) || client.hasValue(isbn)) {
            return false;
        }
        (async () => {
            const book: IsbnBook = await isbn.fetchBook();
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
    const addIsbnString = function(isbnString: string): boolean {
        const isbn: Isbn | null = Isbn.parse(isbnString);
        if (!isbn) {
            return false;
        }
        return addIsbn(isbn);
    };
    
    const assignExistingBarcode = function(book: BookUpload): void {
        server.put(book.barcode, book.isbn);
    };
    
    const hasBarcode = function(barcode: Barcode): boolean {
        return server.hasKey(barcode) || client.hasKey(barcode);
    };
    
    const assignBarcode = function(book: BookUpload): boolean {
        addIsbn(book.isbn);
        
        if (hasBarcode(book.barcode)) {
            return false;
        }
        client.put(book.barcode, book.isbn);
        return true;
    };
    
    let initialized: boolean = false;
    const loadInitial = async function(): Promise<void> {
        const isbns: Promise<Isbn[]> = api.allIsbns();
        const barcodes: Promise<BookUpload[]> = api.ownBooks();
        (await isbns).forEach(addExistingIsbn);
        // barcodes must be added afterwards
        (await barcodes).forEach(assignExistingBarcode);
        initialized = true;
    };
    
    // noinspection JSIgnoredPromiseFromCall
    loadInitial();
    
    const undoFailedBooks = function(uploadResponse: BookUploadResponse[]): Barcode[] {
        uploadResponse
            .filter(book => book.response.success)
            .map(book => book.barcode)
            .forEach(transitioning.removeKey);
        client.putAllFrom(transitioning);
        const failedBarcodes = Array.from(transitioning.keys());
        failedBarcodes.forEach(server.removeKey);
        return failedBarcodes;
    };
    
    const sync = async function(): Promise<Barcode[]> {
        const books: BookUpload[] = Array.from(client.keyEntries())
            .map(([barcode, isbn]) => ({barcode: barcode, isbn: isbn}));
        // noinspection JSIgnoredPromiseFromCall
        loadInitial();
        const uploadResponse: Promise<BookUploadResponse[]> = api.uploadBooks(books);
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

export const allBooks: Books = createAllBooks().freeze();

anyWindow.allBooks = allBooks;