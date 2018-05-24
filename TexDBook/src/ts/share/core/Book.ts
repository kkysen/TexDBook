import {Isbn} from "./Isbn";
import {User} from "./User";

export interface Book {
    
    readonly barcode: string;
    readonly department: string;
    
    readonly isbn: Isbn;
    
    readonly title: string;
    readonly subtitle: string;
    readonly author: string;
    readonly edition: number;
    
    readonly price: number;
    
    owner: User;
    
}

void async function f() {
    // TODO delete
    let tb: Book = {} as Book;
    const book = await tb.isbn.fetchBook();
    
};