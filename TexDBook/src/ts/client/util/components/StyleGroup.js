"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
class StyleGroup extends react_1.Component {
    render() {
        return (React.createElement("div", null, react_1.Children.map(this.props.children, (child, i) => (React.createElement("span", { key: i, style: this.props.style }, child)))));
    }
}
exports.StyleGroup = StyleGroup;
//# sourceMappingURL=StyleGroup.js.map