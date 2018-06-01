import * as React from "react";
import {Component, ReactNode} from "react";
import {BookInput, InputIsbns} from "./InputIsbns";


export class InputBooks extends Component<{}, {}> {
    
    private readonly books: BookInput[] = [];
    
    public constructor(props: {}) {
        super(props);
        console.log("constructing InputBooks");
    }
    
    public render(): ReactNode {
        console.log("rendering InputBooks");
        return (<div>
            <InputIsbns startLength={1} books={this.books}/>
        </div>);
    }
    
}