"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const ReactDOM = require("react-dom");
const react_router_1 = require("react-router");
const react_router_dom_1 = require("react-router-dom");
const Home_1 = require("./Home");
const Login_1 = require("./Login");
const MakeTransaction_1 = require("./MakeTransaction");
const UploadBooks_1 = require("./UploadBooks");
const ViewBooks_1 = require("./ViewBooks");
const views = [Home_1.Home, Login_1.Login, ViewBooks_1.ViewBooks, UploadBooks_1.UploadBooks, MakeTransaction_1.MakeTransaction];
const navLinks = views.map((view, i) => React.createElement("li", { key: i.toString() },
    React.createElement(react_router_dom_1.NavLink, { to: "/" + view.name }, view.name)));
const routes = views.map((view, i) => React.createElement(react_router_1.Route, { key: i.toString(), path: "/" + view.name, component: view }));
class Main extends react_1.Component {
    render() {
        return (React.createElement(react_router_dom_1.HashRouter, null,
            React.createElement("div", null,
                React.createElement("h1", null, "TexDBook"),
                React.createElement("div", { className: "content" }, routes))));
    }
}
exports.reactMain = function () {
    const root = document.body.appendDiv();
    ReactDOM.render(React.createElement(Main, null), root);
};
//# sourceMappingURL=Main.js.map