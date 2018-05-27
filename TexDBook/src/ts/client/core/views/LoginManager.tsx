import * as React from "react";
import {Component, ComponentClass, ReactNode} from "react";
import {Repeat} from "../../util/components/Repeat";
import {TexDBook} from "../TexDBook";
import {CreateAccount} from "./CreateAccount";
import {Home} from "./Home";
import {Login} from "./Login";
import {IsLoggedIn, LoginProps} from "./LoginComponent";
import {Logout} from "./Logout";
import {MakeTransaction} from "./MakeTransaction";
import {UploadBooks} from "./UploadBooks";
import {ViewBooks} from "./ViewBooks";
import {ViewRouter} from "./ViewRouter";


export class LoginManager extends Component<{}, IsLoggedIn> {
    
    constructor(props: {}) {
        super(props);
        this.state = TexDBook.isLoggedIn._clone();
    }
    
    private logIn(loggedIn: IsLoggedIn) {
        TexDBook.isLoggedIn = loggedIn._clone();
        this.setState(() => loggedIn);
    }
    
    private renderLogin(): ReactNode {
        const logIn = this.logIn.bind(this);
        
        const bindLogin = function(login: ComponentClass<LoginProps>): ComponentClass {
            const boundLogin: ComponentClass = login.bind(null, {onLogin: logIn});
            Object.defineProperties(boundLogin, Object.getOwnPropertyDescriptors(login));
            return boundLogin;
        };
        
        if (!this.state.isLoggedIn) {
            return <ViewRouter views={[
                Home, ViewBooks, UploadBooks, MakeTransaction, bindLogin(Logout),
            ]}/>;
        } else {
            return <ViewRouter views={[
                bindLogin(Login),
                bindLogin(CreateAccount),
            ]}/>;
        }
    }
    
    render(): ReactNode {
        return (
            <div>
                {this.state.message}
                {this.renderLogin()}
                <Repeat times={5} render={() => <br/>}/>
            </div>
        );
    }
    
}