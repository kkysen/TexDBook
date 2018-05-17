import {Isbn} from "../../share/core/Isbn";

export const main = function(): void {
    console.log(window._clone());
    (async () => {
        const clrsIsbn: string = "9780262531962";
        console.log((await Isbn.parse(clrsIsbn).fetchBook()).title);
    })();
};