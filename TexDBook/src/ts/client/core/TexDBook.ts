import {anyWindow} from "../util/anyWindow";
import {IsLoggedIn} from "./views/LoginComponent";
import {reactMain} from "./views/Main";


export interface GlobalTexDBook {
    
    isLoggedIn: IsLoggedIn;
    
}

export const TexDBook: GlobalTexDBook = anyWindow.TexDBook;


export const main = function(): void {
    reactMain();
};