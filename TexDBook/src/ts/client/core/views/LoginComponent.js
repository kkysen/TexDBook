"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
const Inputs_1 = require("../../util/components/Inputs");
const fetchJson_1 = require("../../util/fetch/fetchJson");
const hash_1 = require("../../util/hash");
class LoginComponent extends react_1.Component {
    constructor(props, name) {
        super(props);
        this.name = name;
        this.handleClick = async () => this.props.onLogin(await this.doLogin());
    }
    render() {
        return (React.createElement("div", null,
            this.name,
            React.createElement("br", null),
            React.createElement(Inputs_1.Inputs, { args: this.inputsArgs() }),
            React.createElement("br", null),
            React.createElement(reactstrap_1.Button, { color: "primary", onClick: this.handleClick }, this.name)));
    }
}
exports.LoginComponent = LoginComponent;
exports.loginUser = async function (username, password) {
    return await fetchJson_1.fetchJson("/login", {
        username: username,
        password: await hash_1.SHA._256.hash(password),
    }, {
        cache: "reload",
    });
};
//# sourceMappingURL=LoginComponent.js.map