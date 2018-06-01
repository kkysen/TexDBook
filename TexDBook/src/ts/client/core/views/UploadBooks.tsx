import * as React from "react";
import {Component, ReactNode} from "react";
import {InputBooks} from "./InputBooks";


export class UploadBooks extends Component<{}, {}> {
    
    public constructor(props: {}) {
        super(props);
        console.log("constructing UploadBooks");
    }
    
    render(): ReactNode {
        console.log("rendering UploadBooks");
        return (
            <div>
                Upload Books
                <InputBooks/>
            </div>
        );
    }
    
}