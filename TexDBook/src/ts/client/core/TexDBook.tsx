import * as React from "react";
import * as ReactDOM from "react-dom";
import {Isbn} from "../../share/core/Isbn";
import {Main} from "./views/Main";

const reactMain = function(): void {
    const root: HTMLDivElement = document.body.appendDiv();
    ReactDOM.render(<Main/>, root);
};

export const main = function(): void {
    reactMain();
    
    console.log(window._clone());
    (async () => {
        const clrsIsbn: string = "9780262531962";
        console.log((await Isbn.parse(clrsIsbn).fetchBook()).title);
    })();
};