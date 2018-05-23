import {Book} from "./Book";

export interface User {
    
    userName: string;
    
    textBooks: Book[];
    
    totalPrice(): number;
    
    checkOut(textBook: Book): void;
    
    return(textBook: Book): void;
    
    checkOut(barcode: string): Book;
    
    return(barcode: string): Book;
    
}