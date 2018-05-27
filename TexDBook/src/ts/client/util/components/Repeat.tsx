import * as React from "react";
import {Component, ReactNode} from "react";

export class Repeat extends Component<{
    times: number,
    render: () => ReactNode,
}, {}> {
    
    public render(): ReactNode {
        const nodes: ReactNode[] = [...new Array(this.props.times)]
            .map((e, i) => (<div key={i}>{this.props.render()}</div>));
        return <div>{nodes}</div>;
    }
    
}