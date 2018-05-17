import {TextBook} from "./TextBook";

export interface User {
    
    userName: string;
    
    textBooks: TextBook[];
    
    totalPrice(): number;
    
    checkOut(textBook: TextBook): void;
    
    return(textBook: TextBook): void;
    
    checkOut(barcode: string): TextBook;
    
    return(barcode: string): TextBook;
    
}