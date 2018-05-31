import * as React from "react";
import {Component, ReactNode} from "react";
import Button from "reactstrap/lib/Button";
import {Range} from "../../../share/util/Range";
import {InputRef} from "../../util/refs/InputRef";
import {InputBarcode} from "./InputBarcode";


export interface InputBarcodesProps {
    
    startLength: number;
    
    barcodes: InputRef[];
    
}

export class InputBarcodes extends Component<InputBarcodesProps, {}> {
    
    // noinspection JSMismatchedCollectionQueryUpdate
    private readonly barcodes: InputRef[];
    private readonly nodes: ReactNode[];
    
    public constructor(props: InputBarcodesProps) {
        super(props);
        const barcodes: InputRef[] = props.barcodes;
        this.barcodes = barcodes;
        barcodes.clear();
        barcodes.addAll(Range.new(props.startLength).map(() => InputRef.new()));
        this.nodes = barcodes.map((barcode, i) => this.barcodeInput(barcode, i));
    }
    
    private barcodeInput(barcode: InputRef, i: number) {
        return <InputBarcode barcode={barcode} remove={() => this.removeBarcode(i)}/>;
    }
    
    private addBarcode(): void {
        const barcode: InputRef = InputRef.new();
        this.barcodes.push(barcode);
        this.nodes.push(this.barcodeInput(barcode, this.nodes.length));
        this.setState({});
    }
    
    private removeBarcode(i: number): void {
        this.barcodes.slice(i, 1);
        this.nodes.slice(i, 1);
        this.setState({});
    }
    
    public render(): ReactNode {
        return (<div>
            {this.nodes.map((node, i) => <div key={i}>{node}</div>)}
            <Button onClick={() => this.addBarcode()}>New Barcode</Button>
        </div>);
    }
    
}