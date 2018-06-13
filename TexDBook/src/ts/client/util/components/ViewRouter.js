"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_router_1 = require("react-router");
const react_router_dom_1 = require("react-router-dom");
const reactstrap_1 = require("reactstrap");
const utils_1 = require("../../../share/util/utils");
const RouterNavLink_1 = require("./RouterNavLink");
class ViewRouter extends react_1.Component {
    static toStrictView(view) {
        const strictView = (() => {
            const { name } = view;
            if ("render" in view) {
                const { render } = view;
                let { path } = view;
                if (!path) {
                    path = "/" + name;
                }
                if (path[0] !== "/") {
                    path = "/" + path;
                }
                return { render, name, path };
            }
            const node = React.createElement(view);
            return {
                render: () => node,
                name,
                path: "/" + name,
            };
        })();
        strictView.name = utils_1.separateClassName(strictView.name);
        return strictView;
    }
    strictViews() {
        return this.props.views.map(ViewRouter.toStrictView);
    }
    render() {
        const views = this.strictViews();
        const links = views.map(({ name, path }) => (React.createElement(reactstrap_1.NavItem, { key: name },
            React.createElement(RouterNavLink_1.RouterNavLink, { to: path }, name))));
        const routes = views.map(({ name, path, render }) => {
            return (React.createElement(react_router_1.Route, { key: name, path: path, render: render }));
        });
        const { props: { name } } = this;
        return (React.createElement(react_router_dom_1.HashRouter, null,
            React.createElement("div", null,
                React.createElement(reactstrap_1.Navbar, { color: "light", light: true, expand: "md" },
                    React.createElement(reactstrap_1.NavbarBrand, { href: "/" }, name),
                    React.createElement(reactstrap_1.Nav, { navbar: true, justified: true, className: "ml-auto" }, links)),
                React.createElement("div", { style: { margin: 50 } }, routes))));
    }
}
exports.ViewRouter = ViewRouter;
//# sourceMappingURL=ViewRouter.js.map