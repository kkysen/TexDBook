import {ReactNode} from "react";

export const separateClassName = function(className: string): string {
    return className.replace(/([A-Z])/g, " $1").trim();
};

export const joinNodes = function(nodes: ReactNode[], node: ReactNode): ReactNode[] {
    if (nodes.length < 2) {
        return nodes;
    }
    const joinedNodes: ReactNode[] = new Array(nodes.length * 2);
    for (let i = 0, j = 0; i < nodes.length; i++) {
        joinedNodes[j++] = nodes[i];
        joinedNodes[j++] = node && node._clone();
    }
    joinedNodes.pop();
    return joinedNodes;
};