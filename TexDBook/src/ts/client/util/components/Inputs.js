"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
class Inputs extends react_1.Component {
    static argsAsObject(args) {
        const [field, type, label] = args;
        return { field, type, label };
    }
    argsAsObjects() {
        if (this.args) {
            return this.args;
        }
        const { props: { args } } = this;
        return args.length === 0 || Array.isArray(args[0])
            ? args.map(Inputs.argsAsObject)
            : args;
    }
    constructor(props) {
        super(props);
        this.args = this.argsAsObjects();
    }
    render() {
        return this.argsAsObjects().map(({ label, type, field: { ref } }, i) => (React.createElement("div", { key: i },
            i === 0 ? null : React.createElement("br", null),
            React.createElement(reactstrap_1.InputGroup, null,
                React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" }, label),
                React.createElement(reactstrap_1.Input, { type: type, innerRef: ref })))));
    }
    componentDidMount() {
        const { props: { onEnter } } = this;
        this.argsAsObjects()
            .map(arg => arg.field.ref.current)
            .forEach((node) => {
            node.addEventListener("keyup", e => {
                e.preventDefault();
                if (e.key === "Enter") {
                    onEnter();
                }
            });
        });
    }
}
exports.Inputs = Inputs;
//# sourceMappingURL=Inputs.js.map