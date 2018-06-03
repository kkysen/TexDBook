"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
const Range_1 = require("../../../share/util/Range");
const utils_1 = require("../../../share/util/utils");
const anyWindow_1 = require("../anyWindow");
const InputRef_1 = require("../refs/InputRef");
const NotNullRef_1 = require("../refs/NotNullRef");
const createInputListClass = function (args, reverseDepth, depth, subListClass) {
    const names = args.map(arg => arg.name);
    const createInputRefs = function () {
        return { inputs: args.map(() => InputRef_1.InputRef.new()), subInputs: [] };
    };
    class VerifiedInput extends react_1.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        trySetState(surroundingNodes) {
            const { before, after } = this.state;
            if (surroundingNodes || before || after) {
                this.setState({
                    before: undefined,
                    after: undefined,
                    ...surroundingNodes,
                });
            }
        }
        render() {
            const { arg, input, color, toggleCollapse, toggleHovering, remove } = this.props;
            const { name, onInput } = arg;
            const ownOnInput = () => {
                let surroundingNodes;
                try {
                    surroundingNodes = onInput.call(input.ref.current);
                }
                catch (e) {
                    console.error(e);
                }
                if (surroundingNodes && surroundingNodes.constructor === Promise) {
                    (async () => {
                        try {
                            surroundingNodes = await surroundingNodes;
                        }
                        catch (e) {
                            surroundingNodes = undefined;
                            console.error(e);
                        }
                        this.trySetState(surroundingNodes);
                    })();
                }
                else {
                    this.trySetState(surroundingNodes);
                }
            };
            return (React.createElement("div", null,
                React.createElement(reactstrap_1.InputGroup, null,
                    React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" },
                        React.createElement(reactstrap_1.Button, { style: { backgroundColor: color }, onClick: toggleCollapse, onMouseEnter: toggleHovering(true), onMouseLeave: toggleHovering(false) }, name)),
                    React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" }, this.state.before),
                    React.createElement(reactstrap_1.Input, { type: "text", innerRef: input.ref, onInput: ownOnInput }),
                    React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" }, this.state.after),
                    React.createElement(reactstrap_1.InputGroupAddon, { addonType: "append" },
                        React.createElement(reactstrap_1.Button, { onClick: remove }, "\u00D7")))));
        }
    }
    class CollapsibleInputList extends react_1.Component {
        constructor(props) {
            super(props);
            this.state = { collapse: false, hovering: false };
            this.toggleCollapse = this.toggleCollapse.bind(this);
            this.toggleHovering = this.toggleHovering.bind(this);
            this.subInputsNode = this.renderSubInputsNode();
        }
        renderInputsNode() {
            const input = this.props.input;
            const { inputs } = input;
            const { hovering } = this.state;
            const color = hovering ? "DodgerBlue" : "Gray";
            const toggleCollapse = () => this.toggleCollapse();
            const toggleHovering = (on) => () => this.toggleHovering(on);
            const remove = () => this.props.remove();
            return (React.createElement("div", null, args.map((arg, j) => {
                return (React.createElement("div", { key: j },
                    React.createElement(VerifiedInput, { arg: arg, input: inputs[j], color: color, toggleCollapse: toggleCollapse, toggleHovering: toggleHovering, remove: remove })));
            })));
        }
        renderSubInputsNode() {
            return (React.createElement("div", null, subListClass && React.createElement(subListClass, {
                remove: () => this.props.remove,
                inputs: this.props.input.subInputs,
            })));
        }
        updateState(stateChanges) {
            this.setState({ ...this.state, ...stateChanges });
        }
        toggleCollapse() {
            this.updateState({ collapse: !this.state.collapse });
        }
        toggleHovering(hovering) {
            this.updateState({ hovering: hovering });
        }
        render() {
            return (React.createElement("div", null,
                this.renderInputsNode(),
                React.createElement(reactstrap_1.Collapse, { isOpen: !this.state.collapse }, this.subInputsNode)));
        }
    }
    const inputListClass = class InputList extends react_1.Component {
        constructor(props) {
            super(props);
            this.nodes = [];
            this.id = 0;
            this.addNewInputButton = NotNullRef_1.createNotNullRef();
            this.numNewInputs = InputRef_1.InputRef.new();
            this.onUpdate = [];
            this.inputs = props.inputs;
            this.inputs.clear();
            this.addInput(0, 1, false);
            this.addNewInputButtonNode = this.renderAddNewInputButton();
        }
        renderAddNewInputButton() {
            return (React.createElement("div", null,
                React.createElement(reactstrap_1.InputGroup, null,
                    React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" },
                        React.createElement(reactstrap_1.Button, { color: "primary", innerRef: this.addNewInputButton, onClick: () => this.addInput(this.inputs.length, parseInt(this.numNewInputs()) || 1, true) },
                            "New ",
                            utils_1.joinWords(names))),
                    React.createElement(reactstrap_1.Input, { type: "number", placeholder: "Amount", min: 1, step: 1, style: {
                            width: "40px",
                        }, innerRef: this.numNewInputs.ref }))));
        }
        createInput(input) {
            const id = this.id++;
            const node = (React.createElement(CollapsibleInputList, { input: input, remove: () => this.removeInput(id) }));
            return { ...node, id: id };
        }
        update(setState) {
            if (setState) {
                this.setState({});
            }
        }
        addInput(i, count, setState) {
            if (count <= 0) {
                return;
            }
            const toAdd = Range_1.Range.new(count).map(() => {
                const input = createInputRefs();
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
        removeInput(id) {
            const i = this.nodes.findIndex(node => node.id === id);
            if (i !== 0) {
                this.scrollToRef(this.inputs[i - 1].inputs[0].ref);
            }
            this.inputs.removeAt(i);
            this.nodes.removeAt(i);
            this.update(true);
        }
        render() {
            return (React.createElement("div", { style: { marginLeft: "40px" } },
                this.nodes.map(node => (React.createElement("div", { key: node.id },
                    React.createElement("br", null),
                    node))),
                React.createElement("br", null),
                this.addNewInputButtonNode));
        }
        scrollToRef(ref) {
            this.onUpdate.push(() => ref.current.scrollIntoView());
        }
        componentDidUpdate() {
            this.onUpdate.forEach(f => f());
            this.onUpdate.clear();
        }
    };
    return inputListClass.named(names.join("And") + inputListClass.name);
};
const isInputListArg = function (arg) {
    return arg.hasOwnProperty("name");
};
const toInputListArg = function (arg) {
    return isInputListArg(arg)
        ? arg
        : {
            name: arg,
            onInput: () => undefined,
        };
};
const createInputListClasses = function (names) {
    let inputListClass = undefined;
    const n = names.length;
    for (let i = 0; i < n; i++) {
        const j = n - i - 1;
        inputListClass = createInputListClass(names[j], i, j, inputListClass);
    }
    return inputListClass;
};
class InputLists extends react_1.Component {
    constructor(props, name, namesOrArgs) {
        super(props);
        this.inputs = [];
        this.name = name;
        const args = namesOrArgs
            .map(utils_1.singletonAsArray)
            .map(namesOrArgs => namesOrArgs.map(toInputListArg));
        this.InputList = createInputListClasses(args);
        Object.defineProperties(anyWindow_1.anyWindow, {
            inputs: {
                get: this.getInputs.bind(this),
            }
        });
    }
    static resolveInputs(inputs) {
        return inputs.map(({ inputs, subInputs }) => ({
            inputs: inputs.map(input => input()),
            subInputs: InputLists.resolveInputs(subInputs),
        }));
    }
    getInputs() {
        return this.convertInputs(InputLists.resolveInputs(this.inputs));
    }
    onClick() {
        this.onSubmit(this.getInputs());
    }
    render() {
        // TODO make name fancier
        return (React.createElement("div", null,
            this.name,
            React.createElement(this.InputList, {
                inputs: this.inputs,
                remove: () => undefined,
            }),
            React.createElement("br", null),
            React.createElement(reactstrap_1.Button, { onClick: () => this.onClick(), color: "primary" }, "Submit")));
    }
}
exports.InputLists = InputLists;
//# sourceMappingURL=InputLists.js.map