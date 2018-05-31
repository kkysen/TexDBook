import * as React from "react";
import {Component, ReactNode} from "react";
import {Input, InputGroup, InputGroupAddon} from "reactstrap";
import {InputRef} from "../../util/refs/InputRef";


export interface InputBarcodeProps {
    
    barcode: InputRef;
    
    remove(): void;
    
}

export class InputBarcode extends Component<InputBarcodeProps, {}> {
    
    public render(): ReactNode {
        return (<div>
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    Barcode
                </InputGroupAddon>
                <Input type="text" innerRef={this.props.barcode.ref}/>
            </InputGroup>
        </div>);
    }
    
}