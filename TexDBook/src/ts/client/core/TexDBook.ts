import {anyWindow} from "../util/anyWindow";

export interface IsLoggedIn {
    readonly isLoggedIn: boolean;
    message?: string;
}


export interface GlobalTexDBook {
    
    onLogin: Promise<void>;
    
    isLoggedIn: IsLoggedIn;
    
    readonly csrfToken: string;
    
}

const plainTexDBook: GlobalTexDBook = anyWindow.TexDBook;

let {isLoggedIn} = plainTexDBook;
isLoggedIn.freeze();
const {csrfToken} = plainTexDBook;

let resolveOnLogin: () => void;
export const onLogin: Promise<void> = new Promise(resolve => {
    resolveOnLogin = resolve;
});

export const TexDBook: GlobalTexDBook = {
    
    get onLogin(): Promise<void> {
        return onLogin;
    },
    
    get isLoggedIn(): IsLoggedIn {
        return isLoggedIn;
    },
    
    set isLoggedIn(_isLoggedIn: IsLoggedIn) {
        isLoggedIn = _isLoggedIn.freeze();
        if (isLoggedIn.isLoggedIn) {
            resolveOnLogin();
        }
    },
    
    get csrfToken(): string {
        return csrfToken;
    },
    
};

TexDBook.isLoggedIn = isLoggedIn;

anyWindow.TexDBook = TexDBook;

import {reactMain} from "./components/views/Main";

export const main = function(): void {
    reactMain();
};