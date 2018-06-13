import * as React from "react";
import {Component, ComponentClass, ReactNode} from "react";
import {Route} from "react-router";
import {HashRouter} from "react-router-dom";
import {Nav, Navbar, NavbarBrand, NavItem} from "reactstrap";
import {separateClassName} from "../../../share/util/utils";
import {RouterNavLink} from "./RouterNavLink";


type ObjView = {
    render: () => ReactNode;
    name: string;
    path?: string;
}


type StrictView = Required<ObjView>

export type View = ComponentClass | ObjView;

export type ViewRouterProps = {
    readonly name: string;
    readonly views: View[];
};


export class ViewRouter extends Component<ViewRouterProps, {}> {
    
    private static toStrictView(view: View): StrictView {
        const strictView: StrictView = (() => {
            const {name} = view;
            if ("render" in view) {
                const {render} = view;
                let {path} = view;
                if (!path) {
                    path = "/" + name;
                }
                if (path[0] !== "/") {
                    path = "/" + path;
                }
                return {render, name, path};
            }
            const node: ReactNode = React.createElement(view);
            return {
                render: () => node,
                name,
                path: "/" + name,
            };
        })();
        strictView.name = separateClassName(strictView.name);
        return strictView;
    }
    
    private strictViews(): StrictView[] {
        return this.props.views.map(ViewRouter.toStrictView);
    }
    
    public render(): ReactNode {
        const views: StrictView[] = this.strictViews();
        
        const links: ReactNode[] = views.map(({name, path}) => (
            <NavItem key={name}>
                <RouterNavLink to={path} exact>
                    {name}
                </RouterNavLink>
            </NavItem>
        ));
        
        const routes: ReactNode[] = views.map(({name, path, render}) => {
                return (<Route
                    key={name}
                    path={path}
                    render={render}
                />);
            }
        );
        
        const {props: {name}} = this;
        
        return (<HashRouter>
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">
                        {name}
                    </NavbarBrand>
                    <Nav navbar justified className="ml-auto">
                        {links}
                    </Nav>
                </Navbar>
                <div style={{margin: 50}}>
                    {routes}
                </div>
            </div>
        </HashRouter>);
    }
    
}