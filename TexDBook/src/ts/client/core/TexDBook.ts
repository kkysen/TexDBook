import {reactMain} from "./views/Main";


export interface GlobalTexDBook {
    
    isLoggedIn: boolean;
    
}

export const TexDBook: GlobalTexDBook = (<any> window).TexDBook;


export const main = function(): void {
    reactMain();
    
    console.log(window._clone());
    (async () => {
        const clrsIsbn: string = "9780262531962";
        // console.log((await (Isbn.parse(clrsIsbn) as Isbn).fetchBook()).title);
    })();
};