import * as React from "react";
import {Component, ReactNode} from "react";
import * as ReactDOM from "react-dom";
import {LoginManager} from "../login/LoginManager";

class Main extends Component {
    
    private static footer(): ReactNode {
        return (<div style={{
            textAlign: "center",
            position: "fixed",
            fontSize: "smaller",
            width: "100%",
            bottom: 10,
        }}>
            <footer>
                © Khyber Sen 2018, <a href="https://github.com/kkysen/TexDBook" target="_blank">Source</a>
            </footer>
        </div>);
    }
    
    public render(): ReactNode {
        return (<div>
            <LoginManager/>
            {Main.footer()}
        </div>);
    }
    
}

export const reactMain = function(): void {
    const root: HTMLDivElement = document.body.appendDiv();
    ReactDOM.render(<Main/>, root);
};