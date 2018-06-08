import * as React from "react";
import {Component, ReactNode} from "react";
import * as ReactDOM from "react-dom";
import {LoginManager} from "../login/LoginManager";

class Main extends Component {
    
    render(): ReactNode {
        return (<div>
            <LoginManager/>
        </div>);
    }
    
}

export const reactMain = function(): void {
    const root: HTMLDivElement = document.body.appendDiv();
    ReactDOM.render(<Main/>, root);
};