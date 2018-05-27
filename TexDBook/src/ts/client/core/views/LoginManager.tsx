import * as React from "react";
import {Component, ComponentClass, ReactNode} from "react";
import {bindProps} from "../../util/bindProps";
import {Repeat} from "../../util/components/Repeat";
import {ViewRouter} from "../../util/components/ViewRouter";
import {TexDBook} from "../TexDBook";
import {CreateAccount} from "./CreateAccount";
import {Home} from "./Home";
import {Login} from "./Login";
import {IsLoggedIn, LoginProps} from "./LoginComponent";
import {Logout} from "./Logout";
import {MakeTransaction} from "./MakeTransaction";
import {UploadBooks} from "./UploadBooks";
import {ViewBooks} from "./ViewBooks";


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
            return bindProps(login, {onLogin: logIn});
        };
        
        if (this.state.isLoggedIn) {
            return <ViewRouter name="TexDBook" views={[
                Home, ViewBooks, UploadBooks, MakeTransaction, bindLogin(Logout)
            ]}/>;
        } else {
            return <ViewRouter name="TexDBook" views={[
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