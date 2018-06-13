import * as React from "react";
import {Component, ReactNode} from "react";
import {named} from "../../../../share/util/decorators/named";


@named("Welcome")
export class Welcome extends Component {
    
    public render(): ReactNode {
        return (
            <div>
                <div style={{fontSize: "larger"}}>
                    Welcome to TexDBook!
                </div>
                <br/>
                <br/>
                <div style={{fontSize: "large"}}>
                    To get started, first login or create an account.
                </div>
            </div>
        );
    }
    
}