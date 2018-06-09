import * as React from "react";
import {Component, ReactNode} from "react";
import {named} from "../../../../share/util/decorators/named";


@named("Home")
export class Home extends Component {
    
    public render(): ReactNode {
        return (
            <div>Home Page</div>
        );
    }
    
}