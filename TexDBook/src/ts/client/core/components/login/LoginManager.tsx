import * as React from "react";
import {Component, ComponentClass, ReactNode} from "react";
import {bindProps} from "../../../util/bindProps";
import {Repeat} from "../../../util/components/Repeat";
import {ViewRouter} from "../../../util/components/ViewRouter";
import {IsLoggedIn, TexDBook} from "../../TexDBook";
import {Home} from "../views/Home";
import {MakeTransaction} from "../views/MakeTransaction";
import {UploadBooks} from "../views/UploadBooks";
import {ViewBooks} from "../views/ViewBooks";
import {ViewUsers} from "../views/ViewUsers";
import {Welcome} from "../views/Welcome";
import {CreateAccount} from "./CreateAccount";
import {Login} from "./Login";
import {LoginProps} from "./LoginComponent";
import {Logout} from "./Logout";


export class LoginManager extends Component<{}, IsLoggedIn> {
    
    public constructor(props: {}) {
        super(props);
        this.state = TexDBook.isLoggedIn._clone();
    }
    
    private readonly logIn = (loggedIn: IsLoggedIn): void => {
        TexDBook.isLoggedIn = loggedIn._clone();
        this.setState(() => loggedIn);
    };
    
    private readonly bindLogin = (login: ComponentClass<LoginProps>): ComponentClass => {
        const {logIn, state: {message}} = this;
        return bindProps(login, {onLogin: logIn, message});
    };
    
    private renderLogin(): ReactNode {
        const {bindLogin, state: {isLoggedIn}} = this;
        if (isLoggedIn) {
            return <ViewRouter name="TexDBook" views={[
                {
                    path: "/",
                    render: () => location.hash.endsWith("/") && <Home/>,
                    name: Home.name,
                },
                UploadBooks,
                ViewBooks,
                ViewUsers,
                MakeTransaction,
                bindLogin(Logout),
            ]}/>;
        } else {
            return <ViewRouter name="TexDBook" views={[
                {
                    path: "/",
                    render: () => location.hash.endsWith("/") && <Welcome/>,
                    name: Welcome.name,
                },
                bindLogin(Login),
                bindLogin(CreateAccount),
            ]}/>;
        }
    }
    
    public render(): ReactNode {
        return (
            <div>
                {this.renderLogin()}
                <Repeat times={5} render={() => <br/>}/>
            </div>
        );
    }
    
}