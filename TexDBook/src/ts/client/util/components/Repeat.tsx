import * as React from "react";
import {Component, ReactNode} from "react";
import {Range} from "../../../share/util/Range";

export class Repeat extends Component<{
    times: number,
    render: () => ReactNode,
}, {}> {
    
    public render(): ReactNode {
        return (<div>
            {Range.new(this.props.times).map(i => (
                <div key={i}>
                    {this.props.render()}
                </div>
            ))}
        </div>);
    }
    
}