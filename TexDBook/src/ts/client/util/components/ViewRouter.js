"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_router_1 = require("react-router");
const react_router_dom_1 = require("react-router-dom");
const reactstrap_1 = require("reactstrap");
const RouterNavLink_1 = require("./RouterNavLink");
class ViewRouter extends react_1.Component {
    static fixName(name) {
        return name.replace(/([A-Z])/g, ' $1').trim();
    }
    static toStrictView(view) {
        const strictView = (() => {
            if ("render" in view) {
                if (!view.path) {
                    view.path = "/" + view.name;
                }
                if (view.path[0] !== "/") {
                    view.path = "/" + view.path;
                }
                return view;
            }
            return {
                render: () => React.createElement(view),
                name: view.name,
                path: "/" + view.name,
            };
        })();
        strictView.name = ViewRouter.fixName(strictView.name);
        return strictView;
    }
    strictViews() {
        return this.props.views.map(ViewRouter.toStrictView);
    }
    render() {
        const views = this.strictViews();
        const makeLink = function (view) {
            return (React.createElement(reactstrap_1.NavItem, { key: view.name },
                React.createElement(RouterNavLink_1.RouterNavLink, { to: view.path }, view.name)));
        };
        const links = views.map(view => makeLink(view));
        const routes = views.map((view, i) => (React.createElement(react_router_1.Route, { key: view.name, path: view.path, render: view.render })));
        return (React.createElement(react_router_dom_1.HashRouter, null,
            React.createElement("div", null,
                React.createElement(reactstrap_1.Navbar, { color: "light", light: true, expand: "md" },
                    React.createElement(reactstrap_1.NavbarBrand, { href: "/" }, this.props.name),
                    React.createElement(reactstrap_1.Nav, { navbar: true, justified: true, className: "ml-auto" }, links)),
                React.createElement("div", null, routes))));
    }
}
exports.ViewRouter = ViewRouter;
//# sourceMappingURL=ViewRouter.js.map