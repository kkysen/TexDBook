import * as React from "react";
import {Component, ReactNode} from "react";
import {NavLink as ReactRouterNavLink, NavLinkProps as ReactRouterNavLinkProps} from "react-router-dom";
import {NavLink as ReactstrapNavLink, NavLinkProps as ReactstrapNavLinkProps} from "reactstrap";


export class RouterNavLink extends Component<ReactRouterNavLinkProps, {}> {
    
    public render(): ReactNode {
        return React.createElement(ReactstrapNavLink, {
            tag: ReactRouterNavLink,
            ...this.props,
        } as ReactstrapNavLinkProps);
    }
    
}


