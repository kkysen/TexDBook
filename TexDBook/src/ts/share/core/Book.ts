import {Isbn} from "./Isbn";
import {User} from "./User";

export type Barcode = string;


export interface Book {
    
    readonly barcode: Barcode;
    readonly isbn: Isbn;
    readonly owner: User;
    readonly lender: User;
    readonly borrower: User;
    
}