"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const ReactDOM = require("react-dom");
const LoginManager_1 = require("../login/LoginManager");
class Main extends react_1.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement(LoginManager_1.LoginManager, null)));
    }
}
exports.reactMain = function () {
    const root = document.body.appendDiv();
    ReactDOM.render(React.createElement(Main, null), root);
};
//# sourceMappingURL=Main.js.map