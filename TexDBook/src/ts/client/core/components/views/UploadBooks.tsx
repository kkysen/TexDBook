import * as React from "react";
import {Component, ReactNode} from "react";
import {named} from "../../../../share/util/decorators/named";
import {InputBooksComponent} from "../InputBooksComponent";

@named("UploadBooks")
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