import * as React from "react";
import {Component, ComponentClass, ReactNode} from "react";
import {Button, Collapse, Input, InputGroup, InputGroupAddon} from "reactstrap";
import {Range} from "../../../share/util/Range";
import {joinWords, singletonAsArray} from "../../../share/util/utils";
import {anyWindow} from "../anyWindow";
import {InputRef} from "../refs/InputRef";
import {createNotNullRef, NotNullRef} from "../refs/NotNullRef";


interface Inputs<T> {
    
    inputs: T[];
    
    subInputs: Inputs<T>[];
    
}

interface InputRefs extends Inputs<InputRef> {

}

export interface StringInputs extends Inputs<string> {

}

interface InputListProps {
    
    remove(): void;
    
    inputs: InputRefs[];
    
}

interface InputListClass extends ComponentClass<InputListProps> {

}


export interface SurroundingNodes {
    
    before?: ReactNode;
    after?: ReactNode;
    
}

export type MaybeSurroundingNodes = SurroundingNodes | void | Promise<SurroundingNodes | void>;

export interface VerifiedInputArg {
    
    name: string,
    onInput: (this: HTMLInputElement) => MaybeSurroundingNodes;
    
}


const createInputListClass = function(
    args: VerifiedInputArg[],
    reverseDepth: number, depth: number,
    subListClass?: InputListClass): InputListClass {
    
    const names: string[] = args.map(arg => arg.name);
    
    const createInputRefs = function(): InputRefs {
        return {inputs: args.map(() => InputRef.new()), subInputs: []};
    };
    
    
    interface VerifiedInputProps {
        
        arg: VerifiedInputArg;
        input: InputRef;
        color: string;
        toggleCollapse: () => void;
        
        toggleHovering(on: boolean): () => void;
        
        remove: () => void;
        
    }
    
    type VerifiedInputState = SurroundingNodes;
    
    class VerifiedInput extends Component<VerifiedInputProps, VerifiedInputState> {
        
        public constructor(props: VerifiedInputProps) {
            super(props);
            this.state = {};
        }
        
        private trySetState(surroundingNodes: SurroundingNodes | void): void {
            const {before, after} = this.state;
            if (surroundingNodes || before || after) {
                this.setState({
                    before: undefined,
                    after: undefined,
                    ...surroundingNodes,
                });
            }
        }
        
        public render(): ReactNode {
            const {arg, input, color, toggleCollapse, toggleHovering, remove} = this.props;
            const {name, onInput} = arg;
            
            const ownOnInput = () => {
                let surroundingNodes: MaybeSurroundingNodes;
                try {
                    surroundingNodes = onInput.call(input.ref.current);
                } catch (e) {
                    console.error(e);
                }
                if (surroundingNodes && surroundingNodes.constructor === Promise) {
                    (async () => {
                        try {
                            surroundingNodes = await surroundingNodes;
                        } catch (e) {
                            surroundingNodes = undefined;
                            console.error(e);
                        }
                        this.trySetState(surroundingNodes);
                    })();
                } else {
                    this.trySetState(surroundingNodes as SurroundingNodes | void);
                }
            };
            
            return (<div>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button
                            style={{backgroundColor: color}}
                            onClick={toggleCollapse}
                            onMouseEnter={toggleHovering(true)}
                            onMouseLeave={toggleHovering(false)}
                        >
                            {name}
                        </Button>
                    </InputGroupAddon>
                    <InputGroupAddon addonType="prepend">
                        {this.state.before}
                    </InputGroupAddon>
                    <Input type="text" innerRef={input.ref} onInput={ownOnInput}/>
                    <InputGroupAddon addonType="prepend">
                        {this.state.after}
                    </InputGroupAddon>
                    <InputGroupAddon addonType="append">
                        <Button onClick={remove}>
                            ×
                        </Button>
                    </InputGroupAddon>
                </InputGroup>
            </div>);
        }
        
    }
    
    
    interface CollapsibleInputListProps {
        
        input: InputRefs;
        
        remove(): void;
        
    }
    
    interface CollapsibleInputListState {
        
        collapse: boolean;
        hovering: boolean;
        
    }
    
    class CollapsibleInputList extends Component<CollapsibleInputListProps, CollapsibleInputListState> {
        
        private readonly subInputsNode: ReactNode;
        
        public constructor(props: CollapsibleInputListProps) {
            super(props);
            this.state = {collapse: false, hovering: false};
            
            this.toggleCollapse = this.toggleCollapse.bind(this);
            this.toggleHovering = this.toggleHovering.bind(this);
            
            this.subInputsNode = this.renderSubInputsNode();
        }
        
        private renderInputsNode(): ReactNode {
            const input: InputRefs = this.props.input;
            const {inputs} = input;
            const {hovering} = this.state;
            const color: string = hovering ? "DodgerBlue" : "Gray";
            const toggleCollapse = () => this.toggleCollapse();
            const toggleHovering = (on: boolean) => () => this.toggleHovering(on);
            const remove = () => this.props.remove();
            return (<div>
                {args.map((arg, j) => {
                    return (<div key={j}>
                        <VerifiedInput
                            arg={arg}
                            input={inputs[j]}
                            color={color}
                            toggleCollapse={toggleCollapse}
                            toggleHovering={toggleHovering}
                            remove={remove}
                        />
                    </div>);
                })}
            </div>);
        }
        
        private renderSubInputsNode(): ReactNode {
            return (<div>
                {subListClass && React.createElement(subListClass, {
                    remove: () => this.props.remove,
                    inputs: this.props.input.subInputs,
                })}
            </div>);
        }
        
        private updateState(stateChanges: Partial<CollapsibleInputListState>) {
            this.setState({...this.state, ...stateChanges});
        }
        
        private toggleCollapse() {
            this.updateState({collapse: !this.state.collapse});
        }
        
        private toggleHovering(hovering: boolean) {
            this.updateState({hovering: hovering});
        }
        
        public render(): ReactNode {
            return (<div>
                {this.renderInputsNode()}
                <Collapse isOpen={!this.state.collapse}>
                    {this.subInputsNode}
                </Collapse>
            </div>);
        }
        
    }
    
    
    type IdReactNode = ReactNode & {id: number};
    
    const inputListClass = class InputList extends Component<InputListProps, {}> {
        
        // noinspection JSMismatchedCollectionQueryUpdate
        private readonly inputs: InputRefs[];
        private readonly nodes: IdReactNode[] = [];
        private id: number = 0;
        
        private readonly addNewInputButton: NotNullRef<HTMLButtonElement> = createNotNullRef();
        private readonly numNewInputs: InputRef = InputRef.new();
        private readonly addNewInputButtonNode: ReactNode;
        
        private readonly onUpdate: (() => void)[] = [];
        
        public constructor(props: InputListProps) {
            super(props);
            this.inputs = props.inputs;
            this.inputs.clear();
            this.addInput(0, 1, false);
            
            this.addNewInputButtonNode = this.renderAddNewInputButton();
        }
        
        private renderAddNewInputButton(): ReactNode {
            return (<div>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button
                            color="primary"
                            innerRef={this.addNewInputButton}
                            onClick={() => this.addInput(
                                this.inputs.length, parseInt(this.numNewInputs()) || 1, true
                            )}
                        >
                            New {joinWords(names)}
                        </Button>
                    </InputGroupAddon>
                    <Input
                        type="number"
                        placeholder="Amount"
                        min={1}
                        step={1}
                        style={{
                            width: "40px",
                            // TODO don't extend all the way to the right
                        }}
                        innerRef={this.numNewInputs.ref}
                    />
                </InputGroup>
            </div>);
        }
        
        private createInput(input: InputRefs): IdReactNode {
            const id: number = this.id++;
            const node: ReactNode = (<CollapsibleInputList input={input} remove={() => this.removeInput(id)}/>);
            return {...node, id: id};
        }
        
        private update(setState: boolean): void {
            if (setState) {
                this.setState({});
            }
        }
        
        private addInput(i: number, count: number, setState: boolean) {
            if (count <= 0) {
                return;
            }
            const toAdd: {input: InputRefs, node: IdReactNode}[] = Range.new(count).map(() => {
                const input: InputRefs = createInputRefs();
                return {
                    input: input,
                    node: this.createInput(input),
                };
            });
            this.inputs.addAll(toAdd.map(e => e.input), i);
            this.nodes.addAll(toAdd.map(e => e.node), i);
            this.update(setState);
            if (setState) {
                this.scrollToRef(this.addNewInputButton);
            }
        }
        
        private removeInput(id: number): void {
            const i: number = this.nodes.findIndex(node => node.id === id);
            if (i !== 0) {
                this.scrollToRef(this.inputs[i - 1].inputs[0].ref);
            }
            this.inputs.removeAt(i);
            this.nodes.removeAt(i);
            this.update(true);
        }
        
        public render(): ReactNode {
            return (<div style={{marginLeft: "40px"}}>
                {this.nodes.map(node => (
                    <div key={node.id}>
                        <br/>
                        {node}
                    </div>
                ))}
                <br/>
                {this.addNewInputButtonNode}
            </div>);
        }
        
        private scrollToRef<T extends HTMLElement>(ref: NotNullRef<T>): void {
            this.onUpdate.push(() => ref.current.scrollIntoView());
        }
        
        public componentDidUpdate(): void {
            this.onUpdate.forEach(f => f());
            this.onUpdate.clear();
        }
        
    };
    
    return inputListClass.named(names.join("And") + inputListClass.name);
    
};


export type NameOrInputListArg = string | VerifiedInputArg;

const isInputListArg = function(arg: NameOrInputListArg): arg is VerifiedInputArg {
    return arg.hasOwnProperty("name");
};

const toInputListArg = function(arg: NameOrInputListArg): VerifiedInputArg {
    return isInputListArg(arg)
        ? arg
        : {
            name: arg,
            onInput: () => undefined,
        };
};


const createInputListClasses = function(names: VerifiedInputArg[][]): InputListClass {
    let inputListClass: InputListClass | undefined = undefined;
    const n: number = names.length;
    for (let i = 0; i < n; i++) {
        const j: number = n - i - 1;
        inputListClass = createInputListClass(names[j], i, j, inputListClass);
    }
    return inputListClass as InputListClass;
};

export abstract class InputLists<Input> extends Component<{}, {}> {
    
    protected abstract convertInputs(inputs: StringInputs[]): Input;
    
    protected abstract onSubmit(input: Input): void;
    
    private readonly name: string;
    private readonly InputList: InputListClass;
    private readonly inputs: InputRefs[] = [];
    
    protected constructor(props: {}, name: string, namesOrArgs: (NameOrInputListArg | NameOrInputListArg[])[]) {
        super(props);
        this.name = name;
        const args: VerifiedInputArg[][] = namesOrArgs
            .map(singletonAsArray)
            .map(namesOrArgs => namesOrArgs.map(toInputListArg));
        this.InputList = createInputListClasses(args);
        Object.defineProperties(anyWindow, {
            inputs: {
                get: this.getInputs.bind(this),
            }
        });
    }
    
    private static resolveInputs(inputs: InputRefs[]): StringInputs[] {
        return inputs.map(({inputs, subInputs}) => ({
            inputs: inputs.map(input => input()),
            subInputs: InputLists.resolveInputs(subInputs),
        }));
    }
    
    private getInputs(): Input {
        return this.convertInputs(InputLists.resolveInputs(this.inputs));
    }
    
    private onClick(): void {
        this.onSubmit(this.getInputs());
    }
    
    render(): ReactNode {
        // TODO make name fancier
        return (<div>
            {this.name}
            {React.createElement(this.InputList, {
                inputs: this.inputs,
                remove: () => undefined,
            })}
            <br/>
            <Button onClick={() => this.onClick()} color="primary">Submit</Button>
        </div>);
    }
    
}