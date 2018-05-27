"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
class Repeat extends react_1.Component {
    render() {
        const nodes = [...new Array(this.props.times)]
            .map((e, i) => (React.createElement("div", { key: i }, this.props.render())));
        return React.createElement("div", null, nodes);
    }
}
exports.Repeat = Repeat;
//# sourceMappingURL=Repeat.js.map