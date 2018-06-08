// export interface User {
//
//     userName: string;
//
//     textBooks: Book[];
//
//     totalPrice(): number;
//
//     checkOut(textBook: Book): void;
//
//     return(textBook: Book): void;
//
//     checkOut(barcode: string): Book;
//
//     return(barcode: string): Book;
//
// }

export interface User {
    
    readonly id: number;
    readonly username: string;
    
}