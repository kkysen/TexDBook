import {Isbn} from "./Isbn";
import {User} from "./User";

export interface Book {
    
    readonly barcode: string;
    readonly isbn: Isbn;
    
    readonly price: number;
    
    owner: User;
    
}