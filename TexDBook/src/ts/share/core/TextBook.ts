import {Isbn} from "./Isbn";
import {User} from "./User";

export interface TextBook {
    
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
    let tb: TextBook;
    const book = await tb.isbn.fetchBook();
    
};