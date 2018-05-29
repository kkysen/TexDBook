import {Isbn} from "../../share/core/Isbn";
import {IsbnBook} from "../../share/core/IsbnBook";
import {api, BookUpload} from "./api";
import {UploadBooks} from "./views/UploadBooks";

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
    
    assignBarcode(book: BookUpload): boolean;
    
}

const Books = {
    
    new(): Books {
        const barcodes: Map<string, Isbn> = new Map();
        const isbns: Map<Isbn, string[]> = new Map();
        
        const addIsbn = function(isbn: Isbn): boolean {
            
        };
    }
    
};

export const allIsbns: Books = ((): Books => {
    
    const barcodes: Map<string, BookUpload> = new Map();
    
    const serverIsbns: Set<Isbn> = new Set();
    const clientIsbns: Set<Isbn> = new Set();
    const transitioningIsbns: Set<Isbn> = new Set();
    
    const addExistingIsbn = function(isbn: Isbn): void {
        serverIsbns.add(isbn);
    };
    
    const addIsbn = function(isbn: Isbn): boolean {
        if (serverIsbns.has(isbn) || clientIsbns.has(isbn)) {
            return false;
        }
        (async () => {
            const book: IsbnBook = await isbn.fetchBook();
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
    const addIsbnString = function(isbnString: string): boolean {
        const isbn: Isbn | null = Isbn.parse(isbnString);
        if (!isbn) {
            return false;
        }
        return addIsbn(isbn);
    };
    
    const assignBarcode = function(book: BookUpload): boolean {
        if (!serverIsbns.has(book.isbn)) {
            clientIsbns.add(book.isbn);
        }
        if (barcodes.has(book.barcode)) {
            return false;
        }
        barcodes.set(book.barcode, book);
        return true;
    };
    
    let initialized: boolean = false;
    const loadInitial = async function(): Promise<void> {
        const isbns: Promise<Isbn[]> = api.allIsbns();
        const barcodes: Promise<BookUpload[]> = api.ownBarcodes();
        (await isbns).forEach(addExistingIsbn);
        // barcodes must be added afterwards
        (await barcodes).forEach(assignBarcode);
        initialized = true;
    };
    
    // noinspection JSIgnoredPromiseFromCall
    loadInitial();
    
    const sync = async function(): Promise<void> {
    
    };
    
    return {
        addIsbn: addIsbnString,
        assignBarcode: assignBarcode,
        
        async sync(books: BookUpload[]): Promise<void> {
            Array.from(clientIsbns)
                .map(async isbn => {
                    
                    return {
                    
                    };
                });
            
        },
        
    }.freeze();
    
})();