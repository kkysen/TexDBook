import * as React from "react";
import {Children, Component, CSSProperties, ReactNode} from "react";


export interface StyleGroupProps {
    
    style: CSSProperties;
    
}


export class StyleGroup extends Component<StyleGroupProps, {}> {
    
    public render(): ReactNode {
        return (<div>
            {Children.map(this.props.children, (child, i) => (
                <span key={i} style={this.props.style}>
                    {child}
                </span>
            ))}
        </div>);
    }
    
}