"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const Range_1 = require("../../../share/util/Range");
class Repeat extends react_1.Component {
    render() {
        return (React.createElement("div", null, Range_1.Range.new(this.props.times).map(i => (React.createElement("div", { key: i }, this.props.render())))));
    }
}
exports.Repeat = Repeat;
//# sourceMappingURL=Repeat.js.map