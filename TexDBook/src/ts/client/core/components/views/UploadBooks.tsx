import * as React from "react";
import {Component, ReactNode} from "react";
import {InputBooksComponent} from "../InputBooksComponent";


export class UploadBooks extends Component<{}, {}> {
    
    public constructor(props: {}) {
        super(props);
    }
    
    render(): ReactNode {
        return (<div>
            <InputBooksComponent/>
        </div>);
    }
    
}