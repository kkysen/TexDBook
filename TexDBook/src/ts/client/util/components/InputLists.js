"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_saver_1 = require("file-saver");
const React = require("react");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
const Range_1 = require("../../../share/util/Range");
const utils_1 = require("../../../share/util/utils");
const anyWindow_1 = require("../anyWindow");
const InputRef_1 = require("../refs/InputRef");
const NotNullRef_1 = require("../refs/NotNullRef");
const StyleGroup_1 = require("./StyleGroup");
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
            const { before, after } = this.state;
            return (React.createElement("div", null,
                React.createElement(reactstrap_1.InputGroup, null,
                    React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" },
                        React.createElement(reactstrap_1.Button, { tabIndex: -1, style: { backgroundColor: color }, onClick: toggleCollapse, onMouseEnter: toggleHovering(true), onMouseLeave: toggleHovering(false) }, name)),
                    React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" }, before),
                    React.createElement(reactstrap_1.Input, { type: "text", innerRef: input.ref, onInput: ownOnInput }),
                    React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" }, after),
                    React.createElement(reactstrap_1.InputGroupAddon, { addonType: "append" },
                        React.createElement(reactstrap_1.Button, { onClick: remove, tabIndex: -1 }, "\u00D7")))));
        }
    }
    class CollapsibleInputList extends react_1.Component {
        constructor(props) {
            super(props);
            this.toggleCollapse = () => {
                this.updateState({ collapse: !this.state.collapse });
            };
            this.toggleHovering = (hovering) => {
                this.updateState({ hovering: hovering });
            };
            this.state = { collapse: false, hovering: false };
            this.subInputsNode = this.renderSubInputsNode();
        }
        renderInputsNode() {
            const { props: { input: { inputs }, remove }, state: { hovering }, toggleCollapse } = this;
            const color = hovering ? "DodgerBlue" : "Gray";
            const toggleHovering = (on) => () => this.toggleHovering(on);
            return (React.createElement("div", null, args.map((arg, j) => {
                return (React.createElement("div", { key: j },
                    React.createElement(VerifiedInput, { arg: arg, input: inputs[j], color: color, toggleCollapse: toggleCollapse, toggleHovering: toggleHovering, remove: remove })));
            })));
        }
        renderSubInputsNode() {
            const { props: { remove, input: { subInputs } } } = this;
            return (React.createElement("div", null, subListClass && React.createElement(subListClass, {
                remove,
                inputs: subInputs,
            })));
        }
        updateState(stateChanges) {
            this.setState({ ...this.state, ...stateChanges });
        }
        render() {
            const { state: { collapse }, subInputsNode } = this;
            return (React.createElement("div", null,
                this.renderInputsNode(),
                React.createElement(reactstrap_1.Collapse, { isOpen: !collapse }, subInputsNode)));
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
            return { ...node, id };
        }
        update(setState) {
            if (setState) {
                this.setState({});
            }
        }
        addInput(i, count, setState) {
            const { inputs, nodes, addNewInputButton } = this;
            if (count <= 0) {
                return;
            }
            const toAdd = Range_1.Range.new(count).map(() => {
                const input = createInputRefs();
                return {
                    input,
                    node: this.createInput(input),
                };
            });
            inputs.addAll(toAdd.map(e => e.input), i);
            nodes.addAll(toAdd.map(e => e.node), i);
            this.update(setState);
            if (setState) {
                this.scrollToRef(addNewInputButton);
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
            const { onUpdate } = this;
            onUpdate.forEach(f => f());
            onUpdate.clear();
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
        this.submitButtonsRefs = {
            submit: NotNullRef_1.createNotNullRef(),
            saveAsJson: NotNullRef_1.createNotNullRef(),
            saveAsCsv: NotNullRef_1.createNotNullRef(),
        };
        this.getInputs = () => {
            return this.convertInputs(InputLists.resolveInputs(this.inputs));
        };
        this.onSubmit = () => {
            this.submitInput(this.getInputs());
        };
        this.saveAsJson = () => {
            this.saveAs(JSON.stringify.bind(JSON), "application/json");
        };
        this.convertToCsv = (inputs) => {
            const rows = this.convertToCsvRows(inputs);
            return [Object.keys(rows[0]), ...rows.map(row => Object.values(row))]
                .map(row => row.join(","))
                .join("\n");
        };
        this.saveAsCsv = () => {
            this.saveAs(this.convertToCsv, "application/csv");
        };
        this.name = name;
        const args = namesOrArgs
            .map(utils_1.singletonAsArray)
            .map(namesOrArgs => namesOrArgs.map(toInputListArg));
        this.InputList = createInputListClasses(args);
        Object.defineProperties(anyWindow_1.anyWindow, {
            inputs: {
                get: this.getInputs,
                configurable: true,
            }
        });
    }
    get submitButtons() {
        return this.submitButtonsRefs.mapFields(ref => ref.current);
    }
    invalidate(invalid) {
        Object.values(this.submitButtons).forEach(button => button.disabled = invalid);
    }
    static resolveInputs(inputs) {
        return inputs.map(({ inputs, subInputs }) => ({
            inputs: inputs.map(input => input()),
            subInputs: InputLists.resolveInputs(subInputs),
        }));
    }
    saveAs(converter, mimeType) {
        file_saver_1.saveAs(new Blob([converter(this.getInputs())], {
            type: `${mimeType};charset=utf-8`,
        }), `uploadBook.${mimeType.split("/").last()}`);
    }
    render() {
        // TODO make name fancier
        const renderButton = function (ref, on, text) {
            return React.createElement(reactstrap_1.Button, { innerRef: ref, onClick: on, color: "primary" }, text);
        };
        const { name, InputList, inputs, submitButtonsRefs: { submit, saveAsJson, saveAsCsv } } = this;
        return (React.createElement("div", null,
            React.createElement("div", { style: { fontSize: "large" } }, name),
            React.createElement(InputList, {
                inputs,
                remove: () => undefined,
            }),
            React.createElement("br", null),
            React.createElement(StyleGroup_1.StyleGroup, { style: { marginRight: 10 } },
                renderButton(submit, this.onSubmit, "Submit"),
                renderButton(saveAsJson, this.saveAsJson, "Download as JSON"),
                renderButton(saveAsCsv, this.saveAsCsv, "Download as CSV"))));
    }
}
exports.InputLists = InputLists;
//# sourceMappingURL=InputLists.js.map