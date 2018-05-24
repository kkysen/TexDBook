import * as React from "react";
import {Component, ReactNode} from "react";
import {withRouter} from "react-router";
import {anyWindow} from "../../util/anyWindow";
import {fetchJson} from "../../util/fetch/fetchJson";
import {SHA} from "../../util/hash";
import {TexDBook} from "../TexDBook";
import {ViewBooks} from "./ViewBooks";


type LoginArgs = {
    username: string,
    password: string,
};

type LoginReturn = {
    isLoggedIn: boolean,
};

const onLogin = anyWindow.onLogin = function(): void {
    withRouter(({history}) => {
        history.push(ViewBooks.name);
        return null;
    });
};

const onLoginFailure = function(): void {

};

const login = async function(username: string, password: string): Promise<boolean> {
    // pre hash server side for extra security
    const hashedPassword: string = await SHA._256.hash(password);
    const isLoggedIn: boolean = (await fetchJson<LoginArgs, LoginReturn>("/login", {
        username: username,
        password: hashedPassword,
    }, {
        cache: "reload",
    })).isLoggedIn;
    if (isLoggedIn) {
        TexDBook.isLoggedIn = true;
        onLogin();
    } else {
        onLoginFailure();
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