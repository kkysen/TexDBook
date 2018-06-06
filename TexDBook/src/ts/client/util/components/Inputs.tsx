import * as React from "react";
import {Component, ReactNode} from "react";
import {Input, InputGroup, InputGroupAddon} from "reactstrap";
import {InputType} from "reactstrap/lib/Input";
import {InputRef} from "../refs/InputRef";


export type HTMLInputType = InputType;

export type InputArgsObj = {
    field: InputRef,
    type: HTMLInputType,
    label: string,
}

export type InputArgs = [InputRef, HTMLInputType, string];

export type InputsArgs = InputArgs[] | InputArgsObj[];

type InputsProps = {
    args: InputsArgs;
    onEnter(): void | Promise<void>;
}

export class Inputs extends Component<InputsProps, {}> {
    
    private static argsAsObject(args: InputArgs): InputArgsObj {
        const [field, type, label] = args;
        return {field, type, label};
    }
    
    private argsAsObjects(): InputArgsObj[] {
        if (this.args) {
            return this.args;
        }
        const {props: {args}} = this;
        return args.length === 0 || Array.isArray(args[0])
            ? (args as InputArgs[]).map(Inputs.argsAsObject)
            : args as InputArgsObj[];
    }
    
    private readonly args: InputArgsObj[];
    
    public constructor(props: InputsProps) {
        super(props);
        this.args = this.argsAsObjects();
    }
    
    public render(): ReactNode {
        return this.argsAsObjects().map(({label, type, field: {ref}}, i) => (
            <div key={i}>
                {i === 0 ? null : <br/>}
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        {label}
                    </InputGroupAddon>
                    <Input type={type} innerRef={ref}/>
                </InputGroup>
            </div>
        ));
    }
    
    public componentDidMount(): void {
        const {props: {onEnter}} = this;
        this.argsAsObjects()
            .map(arg => arg.field.ref.current)
            .forEach((node: HTMLInputElement) => {
                node.addEventListener("keyup", e => {
                    e.preventDefault();
                    if (e.key === "Enter") {
                        onEnter();
                    }
                });
            });
    }
    
}