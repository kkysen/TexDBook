"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
class Inputs extends react_1.Component {
    static argsAsObject(args) {
        return {
            field: args[0],
            type: args[1],
            label: args[2],
        };
    }
    argsAsObjects() {
        if (this.args) {
            return this.args;
        }
        const args = this.props.args;
        return args.length === 0 || Array.isArray(args[0])
            ? args.map(Inputs.argsAsObject)
            : args;
    }
    constructor(props) {
        super(props);
        this.args = this.argsAsObjects();
    }
    render() {
        return this.argsAsObjects().map((args, i) => (React.createElement("div", { key: i },
            i === 0 ? null : React.createElement("br", null),
            React.createElement(reactstrap_1.InputGroup, null,
                React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" }, args.label),
                React.createElement(reactstrap_1.Input, { type: args.type, innerRef: args.field.ref })))));
    }
    componentDidMount() {
        this.argsAsObjects()
            .map(arg => arg.field.ref.current)
            .forEach((node) => {
            node.addEventListener("keyup", e => {
                e.preventDefault();
                if (e.key === "Enter") {
                    this.props.onEnter();
                }
            });
        });
    }
}
exports.Inputs = Inputs;
//# sourceMappingURL=Inputs.js.map