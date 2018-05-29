import {Component} from "react";

const immutableDescriptor: PropertyDescriptor = {
    writable: false,
    enumerable: false,
    configurable: false,
};

const defineSharedProperties = function(obj: any, sharedDescriptor: PropertyDescriptor, propertyValues: Object): void {
    const properties: PropertyDescriptorMap & ThisType<any> = Object.getOwnPropertyDescriptors(propertyValues);
    for (const propertyName in properties) {
        if (properties.hasOwnProperty(propertyName)) {
            let property: PropertyDescriptor = properties[propertyName];
            property = Object.assign(property, sharedDescriptor);
            if (property.get || property.set) {
                delete property.writable;
            }
            properties[propertyName] = property;
        }
    }
    Object.defineProperties(obj, properties);
};

const defineImmutableProperties = function(obj: any, propertyValues: Object): void {
    defineSharedProperties(obj, immutableDescriptor, propertyValues);
};

Object.defineProperties(Object, {
    
    defineSharedProperties: {
        writable: false,
        enumerable: false,
        configurable: false,
        value: defineSharedProperties,
    },
    
    defineImmutableProperties: {
        writable: false,
        enumerable: false,
        configurable: false,
        value: defineImmutableProperties,
    },
    
});

Object.defineImmutableProperties(Object, {
    
    getting<T, K extends keyof T>(key: K): (o: T) => T[K] {
        return o => o[key];
    },
    
    deleting<T, K extends keyof T>(key: K): (o: T) => T {
        return o => {
            delete o[key];
            return o;
        };
    },
    
});

Object.defineImmutableProperties(Object.prototype, {
    
    freeze() {
        return Object.freeze(this);
    },
    
    seal() {
        return Object.seal(this);
    },
    
    _clone() {
        return Object.assign({}, this);
    },
    
});

Object.defineImmutableProperties(Function, {
    
    compose(...funcs: Function[]): Function {
        const numFuncs: number = funcs.length;
        if (numFuncs === 0) {
            return () => undefined;
        }
        if (numFuncs === 1) {
            return funcs[0];
        }
        return function(...args: any[]) {
            let result = funcs[0](...args);
            for (let i = 1; i < numFuncs; i++) {
                result = funcs[i](result);
            }
            return result;
        };
    },
    
});

Object.defineImmutableProperties(Function.prototype, {
    
    then<T, U, V>(this: (arg: T) => U, nextFunc: (arg: U) => V): (arg: T) => V {
        return (arg: T) => nextFunc(this(arg));
    },
    
    applyReturning<T>(this: (arg: T) => void): (arg: T) => T {
        return (arg: T) => {
            this(arg);
            return arg;
        };
    },
    
    mapping<T, U>(this: (arg: T) => U): (array: T[]) => U[] {
        return array => array.map(this);
    },
    
    applying<T, U>(this: (...args: T[]) => U): (array: T[]) => U {
        return array => this(...array);
    },
    
    timed<T extends Function>(this: T): T {
        const timer = (...args: any[]) => {
            console.time(this.name);
            const returnValue = this(...args);
            console.timeEnd(this.name);
            return returnValue;
        };
        (<any> timer).name = "timing_" + this.name;
        return <T> <any> timer;
    },
    
});

Object.defineImmutableProperties(Array.prototype, {
    
    clear<T>(this: T[]): void {
        this.length = 0;
    },
    
    remove<T>(this: T[], value: T): void {
        const i: number = this.indexOf(value);
        if (i !== -1) {
            this.splice(i, 1);
        }
    },
    
    addAll<T>(this: T[], values: T[]): void {
        this.push(...values);
    },
    
    applyOn<T, U>(this: T[], func: (args: T[]) => U): U {
        return func(this);
    },
    
    callOn<T, U>(this: T[], func: (...args: T[]) => U): U {
        return func(...this);
    },
    
    toObject<T>(this: [string, T][]): {[key: string]: T} {
        let o: {[key: string]: T} = {};
        for (const [k, v] of this) {
            o[k] = v;
        }
        return o;
    },
    
    sortBy<T, U extends number>(this: T[], key: (t: T) => U): T[] {
        this.sort((a, b) => key(a) - key(b));
        return this;
    },
    
    random<T>(this: T[]): T {
        return this[Math.floor(Math.random() * this.length)];
    },
    
});

Object.defineImmutableProperties(Number, {
    
    isNumber(n: number): boolean {
        return !Number.isNaN(n);
    },
    
    toPixels(n: number): string {
        return Math.round(n) + "px";
    },
    
});

Object.defineImmutableProperties(Node.prototype, {
    
    appendBefore(this: Node, node: Node): Node {
        this.parentNode && this.parentNode.insertBefore(node, this);
        return node;
    },
    
    appendAfter(this: Node, node: Node): Node {
        this.nextSibling && this.nextSibling.appendBefore(node);
        return node;
    },
    
});

Object.defineImmutableProperties(Element.prototype, {
    
    clearHTML(this: Element) {
        this.innerHTML = "";
    },
    
    setAttributes(this: Element, attributes: {[name: string]: any}) {
        for (const attribute in attributes) {
            if (attributes.hasOwnProperty(attribute) && attributes[attribute]) {
                this.setAttribute(attribute, attributes[attribute].toString());
            }
        }
    },
    
});

Object.defineImmutableProperties(HTMLElement.prototype, {
    
    appendTo<T extends HTMLElement>(this: T, parent: HTMLElement): T {
        parent.appendChild(this);
        return this;
    },
    
    appendNewElement(this: HTMLElement, tagName: string): HTMLElement {
        return this.appendChild(document.createElement(tagName));
    },
    
    appendDiv(this: HTMLElement): HTMLDivElement {
        return this.appendNewElement("div");
    },
    
    appendButton(this: HTMLElement, buttonText: string): HTMLButtonElement {
        const button = this.appendNewElement("button");
        button.innerText = buttonText;
        return button;
    },
    
    appendBr(this: HTMLElement): HTMLBRElement {
        return this.appendNewElement("br");
    },
    
    withInnerText<T extends HTMLElement>(this: T, text: string): T {
        this.innerText = text;
        return this;
    },
    
    withInnerHTML<T extends HTMLElement>(this: T, html: string): T {
        this.innerHTML = html;
        return this;
    },
    
});

export const addExtensions = function(): void {
    
};