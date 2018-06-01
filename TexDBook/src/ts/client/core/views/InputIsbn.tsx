import * as React from "react";
import {Component, ReactNode} from "react";
import {Input, InputGroup, InputGroupAddon} from "reactstrap";
import {InputRef} from "../../util/refs/InputRef";
import {InputBarcodes} from "./InputBarcodes";


export interface InputIsbnProps {
    
    isbn: InputRef;
    
    barcodes: InputRef[];
    
    remove(): void;
    
}

export class InputIsbn extends Component<InputIsbnProps, {}> {
    
    public render(): ReactNode {
        return (<div>
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    ISBN
                </InputGroupAddon>
                <Input type="text" innerRef={this.props.isbn.ref}/>
            </InputGroup>
            <InputBarcodes startLength={1} barcodes={this.props.barcodes}/>
        </div>);
    }
    
}