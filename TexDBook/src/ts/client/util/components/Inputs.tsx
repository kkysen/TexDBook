import * as React from "react";
import {Component, ReactNode} from "react";
import {InputGroup, InputGroupAddon, Input} from "reactstrap";
import {InputType} from "reactstrap/lib/Input";
import {InputRef} from "../refs/InputRef";


export type HTMLInputType = InputType; // TODO add rest

export type InputArgsObj = {
    field: InputRef,
    type: HTMLInputType,
    label: string,
}

export type InputArgs = [InputRef, HTMLInputType, string];

export type InputsArgs = InputArgs[] | InputArgsObj[];

type InputsProps = {
    readonly args: InputsArgs;
}

export class Inputs extends Component<InputsProps, {}> {
    
    private static argsAsObject(args: InputArgs): InputArgsObj {
        return {
            field: args[0],
            type: args[1],
            label: args[2],
        };
    }
    
    private argsAsObjects(): InputArgsObj[] {
        const args: InputsArgs = this.props.args;
        return args.length === 0 || Array.isArray(args[0])
            ? (args as InputArgs[]).map(Inputs.argsAsObject)
            : args as InputArgsObj[];
    }
    
    
    public render(): ReactNode {
        return this.argsAsObjects().map((args, i) => (
            <div key={i}>
                {i === 0 ? null : <br/>}
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        {args.label}
                    </InputGroupAddon>
                    <Input type={args.type} innerRef={args.field.ref}/>
                </InputGroup>
            </div>
        ));
        // TODO make ENTER linked to clicking submit button
    }
    
}