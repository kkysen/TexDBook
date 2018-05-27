"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const reactstrap_1 = require("reactstrap");
class RouterNavLink extends react_1.Component {
    render() {
        return React.createElement(reactstrap_1.NavLink, {
            tag: react_router_dom_1.NavLink,
            ...this.props,
        });
    }
}
exports.RouterNavLink = RouterNavLink;
//# sourceMappingURL=RouterNavLink.js.map