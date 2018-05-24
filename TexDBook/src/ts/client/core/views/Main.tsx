import * as React from "react";
import {Component, ComponentClass, ReactNode} from "react";
import * as ReactDOM from "react-dom";
import {Route} from "react-router";
import {HashRouter, NavLink} from "react-router-dom";
import {Home} from "./Home";
import {Login} from "./Login";
import {MakeTransaction} from "./MakeTransaction";
import {UploadBooks} from "./UploadBooks";
import {ViewBooks} from "./ViewBooks";

const views: ComponentClass[] = [Home, Login, ViewBooks, UploadBooks, MakeTransaction];

const navLinks: ReactNode[] = views.map(
    (view, i) =>
        <li key={view.name}>
            <NavLink to={"/" + view.name}>
                {view.name}
            </NavLink>
        </li>);

const routes: ReactNode[] = views.map(
    (view, i) => <Route
        key={view.name}
        path={"/" + view.name}
        component={view}
    />);

class Main extends Component {
    
    render(): ReactNode {
        return (
            <HashRouter>
                <div>
                    <h1>TexDBook</h1>
                    <ul className="header">{navLinks}</ul>
                    <div className="content">{routes}</div>
                </div>
            </HashRouter>
        );
    }
    
}

export const reactMain = function(): void {
    const root: HTMLDivElement = document.body.appendDiv();
    ReactDOM.render(<Main/>, root);
};