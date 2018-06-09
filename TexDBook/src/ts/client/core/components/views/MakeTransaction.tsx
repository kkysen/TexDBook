import * as React from "react";
import {Component, ReactNode} from "react";
import {named} from "../../../../share/util/decorators/named";


@named("MakeTransaction")
export class MakeTransaction extends Component {
    
    render(): ReactNode {
        return (
            <div>Make Transaction</div>
        );
    }
    
}