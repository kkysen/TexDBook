import {anyWindow} from "../util/anyWindow";
import {IsLoggedIn} from "./components/login/LoginComponent";
import {reactMain} from "./components/views/Main";


export interface GlobalTexDBook {
    
    isLoggedIn: IsLoggedIn;
    
    csrfToken: string;
    
}

export const TexDBook: GlobalTexDBook = anyWindow.TexDBook;


export const main = function(): void {
    reactMain();
};