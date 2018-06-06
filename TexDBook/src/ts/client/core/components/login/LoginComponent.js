"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
const utils_1 = require("../../../../share/util/utils");
const Inputs_1 = require("../../../util/components/Inputs");
const api_1 = require("../../api");
class LoginComponent extends react_1.Component {
    constructor(props, name) {
        super(props);
        this.handleClick = async () => {
            this.props.onLogin(await this.doLogin());
        };
        this.name = name || utils_1.separateClassName(this.constructor.name);
    }
    render() {
        // TODO style name and message
        const { name, props: { message }, handleClick } = this;
        return (React.createElement("div", null,
            name,
            React.createElement("br", null),
            message,
            React.createElement("br", null),
            React.createElement(Inputs_1.Inputs, { args: this.inputsArgs(), onEnter: handleClick }),
            React.createElement("br", null),
            React.createElement(reactstrap_1.Button, { color: "primary", onClick: handleClick }, name)));
    }
}
exports.LoginComponent = LoginComponent;
exports.loginUser = async function (username, password) {
    return api_1.api.login(username, password);
};
//# sourceMappingURL=LoginComponent.js.map