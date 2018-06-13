"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const ReactDOM = require("react-dom");
const LoginManager_1 = require("../login/LoginManager");
class Main extends react_1.Component {
    static footer() {
        return (React.createElement("div", { style: {
                textAlign: "center",
                position: "fixed",
                fontSize: "smaller",
                width: "100%",
                bottom: 10,
            } },
            React.createElement("footer", null,
                "\u00A9 Khyber Sen 2018, ",
                React.createElement("a", { href: "https://github.com/kkysen/TexDBook", target: "_blank" }, "Source"))));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(LoginManager_1.LoginManager, null),
            Main.footer()));
    }
}
exports.reactMain = function () {
    const root = document.body.appendDiv();
    ReactDOM.render(React.createElement(Main, null), root);
};
//# sourceMappingURL=Main.js.map