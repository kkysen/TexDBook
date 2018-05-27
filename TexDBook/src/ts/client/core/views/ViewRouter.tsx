import * as React from "react";
import {Component, ComponentClass, ReactNode} from "react";
import {Route} from "react-router";
import {HashRouter} from "react-router-dom";
import {Nav, Navbar, NavbarBrand, NavItem} from "reactstrap";
import {RouterNavLink} from "../../util/components/RouterNavLink";


type ObjView = {
    render: () => ReactNode;
    name: string;
    path?: string;
}


type StrictView = Required<ObjView>

export type View = ComponentClass | ObjView;

export type ViewRouterProps = {
    readonly views: View[];
};


export class ViewRouter extends Component<ViewRouterProps, {}> {
    
    private static toStrictView(view: View): StrictView {
        if ("render" in view) {
            if (!view.path) {
                view.path = "/" + view.name;
            }
            if (view.path[0] !== "/") {
                view.path = "/" + view.path;
            }
            return view as StrictView;
        }
        return {
            render: () => React.createElement(view),
            name: view.displayName || view.name,
            path: "/" + view.name,
        };
    }
    
    private strictViews(): StrictView[] {
        return this.props.views.map(ViewRouter.toStrictView);
    }
    
    public render(): ReactNode {
        const views: StrictView[] = this.strictViews();
        
        const makeLink = function(view: StrictView): ReactNode {
            return (
                <NavItem key={view.name}>
                    <RouterNavLink to={view.path}>
                        {view.name}
                    </RouterNavLink>
                </NavItem>
            );
        };
        
        const links: ReactNode[] = views.map(view => makeLink(view));
        
        const routes: ReactNode[] = views.map(
            (view, i) => (<Route
                key={view.name}
                path={view.path}
                render={view.render}
            />)
        );
        
        return (<HashRouter>
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">TexDBook</NavbarBrand>
                    <Nav navbar justified className="ml-auto">
                        {links}
                    </Nav>
                </Navbar>
                <div>
                    {routes}
                </div>
            </div>
        </HashRouter>);
    }
    
}