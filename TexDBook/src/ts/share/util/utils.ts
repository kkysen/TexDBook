import {ReactNode} from "react";
import {CharMapper, isDigit} from "./CharMapper";

export const isString = function(t: any): t is string {
    return Object.prototype.toString.call(t) === "[object String]";
};

export const capitalize = function(word: string): string {
    return word.length === 0
        ? ""
        : word[0].toUpperCase() + word.slice(1);
};

export const joinWords = function(words: ReadonlyArray<string>): string {
    const _words: string[] = [...words];
    switch (_words.length) {
        case 0:
            return "";
        case 1:
            return _words[0];
        case 2:
            return _words[0] + " and " + _words[1];
        default:
            const lastWord: string = _words.pop() as string;
            return _words.join(", ") + ", and " + lastWord;
    }
};

export const separateClassName = function(className: string): string {
    return className.replace(/([A-Z])/g, " $1").trim();
};

export const joinNodes = function(nodes: ReactNode[], node: ReactNode): ReactNode[] {
    if (nodes.length < 2) {
        return nodes;
    }
    const joinedNodes: ReactNode[] = [];
    for (let i = 0, j = 0; i < nodes.length; i++) {
        joinedNodes.push(nodes[i]);
        joinedNodes.push(node && node._clone());
    }
    joinedNodes.pop();
    return joinedNodes;
};

export const singletonAsArray = function <T>(singletonOrArray: T | T[]) {
    return Array.isArray(singletonOrArray) ? singletonOrArray : [singletonOrArray];
};

export const filterInput = function(input: HTMLInputElement, charFilter: (c: string) => boolean): void {
    input.value = input.value.split("").filter(charFilter).join("");
};

export const onlyDigitsInput = function(input: HTMLInputElement): void {
    filterInput(input, isDigit);
};

export const mapInput = function(input: HTMLInputElement, charMappers: CharMapper[]): void {
    input.value = input.value.split("").map(c => {
        for (const charMapper of charMappers) {
            if (charMapper.test(c)) {
                return charMapper.map(c);
            }
        }
        return "";
    }).join("");
};