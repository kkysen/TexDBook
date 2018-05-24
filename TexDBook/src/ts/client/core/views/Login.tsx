import * as React from "react";
import {Component, ReactNode} from "react";
import {SHA} from "../../util/hash";
import {TexDBook} from "../TexDBook";


const login = async function(username: string, password: string): Promise<boolean> {
    // pre hash server side for extra security
    const hashedPassword: string = await SHA._256.hash(password);
    const response: {isLoggedIn: boolean} = await (await fetch("/login", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: hashedPassword,
        }),
    })).json();
    const isLoggedIn: boolean = response.isLoggedIn;
    if (isLoggedIn) {
        TexDBook.isLoggedIn = true;
    }
    // TODO change stuff after login or after failed login
    return isLoggedIn;
};

export class Login extends Component {
    
    render(): ReactNode {
        return (
            <div>Login</div>
        );
    }
    
}