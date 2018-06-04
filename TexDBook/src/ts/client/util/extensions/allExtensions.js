"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutableDescriptor = Object.freeze({
    writable: false,
    enumerable: false,
    configurable: false,
});
const defineSharedProperties = function (obj, sharedDescriptor, propertyValues) {
    const properties = Object.getOwnPropertyDescriptors(propertyValues);
    for (const propertyName in properties) {
        if (properties.hasOwnProperty(propertyName)) {
            let property = properties[propertyName];
            property = { ...property, ...sharedDescriptor };
            if (property.get || property.set) {
                delete property.writable;
            }
            properties[propertyName] = property;
        }
    }
    Object.defineProperties(obj, properties);
};
const defineImmutableProperties = function (obj, propertyValues) {
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
    getting(key) {
        return o => o[key];
    },
    deleting(key) {
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
    mapFields(mapper) {
        const obj = {};
        for (const [key, value] of Object.entries(this)) {
            obj[key] = mapper(value);
        }
        return obj;
    },
});
Object.defineImmutableProperties(Function, {
    compose(...funcs) {
        const numFuncs = funcs.length;
        if (numFuncs === 0) {
            return () => undefined;
        }
        if (numFuncs === 1) {
            return funcs[0];
        }
        return function (...args) {
            let result = funcs[0](...args);
            for (let i = 1; i < numFuncs; i++) {
                result = funcs[i](result);
            }
            return result;
        };
    },
});
Object.defineImmutableProperties(Function.prototype, {
    then(nextFunc) {
        return (arg) => nextFunc(this(arg));
    },
    applyReturning() {
        return (arg) => {
            this(arg);
            return arg;
        };
    },
    mapping() {
        return array => array.map(this);
    },
    applying() {
        return array => this(...array);
    },
    timed() {
        const timer = (...args) => {
            console.time(this.name);
            const returnValue = this(...args);
            console.timeEnd(this.name);
            return returnValue;
        };
        timer.name = "timing_" + this.name;
        return timer;
    },
    setName(name) {
        Object.defineProperties(this, {
            name: {
                value: name,
            },
        });
    },
    named(name) {
        this.setName(name);
        return this;
    },
});
Object.defineImmutableProperties(Array.prototype, {
    last() {
        return this[this.length - 1];
    },
    clear() {
        this.length = 0;
    },
    removeAt(index) {
        return this.splice(index, 1)[0];
    },
    remove(value) {
        const i = this.indexOf(value);
        if (i !== -1) {
            return this.removeAt(i);
        }
    },
    add(index, value) {
        this.splice(index, 0, value);
    },
    addAll(values, index = this.length) {
        if (index === this.length) {
            this.push(...values);
        }
        else {
            this.splice(index, 0, ...values);
        }
    },
    applyOn(func) {
        return func(this);
    },
    callOn(func) {
        return func(...this);
    },
    toObject() {
        let o = {};
        for (const [k, v] of this) {
            o[k] = v;
        }
        return o;
    },
    sortBy(key) {
        this.sort((a, b) => key(a) - key(b));
        return this;
    },
    random() {
        return this[Math.floor(Math.random() * this.length)];
    },
});
Object.defineImmutableProperties(Number, {
    isNumber(n) {
        return !Number.isNaN(n);
    },
    toPixels(n) {
        return Math.round(n) + "px";
    },
});
Object.defineImmutableProperties(Node.prototype, {
    appendBefore(node) {
        this.parentNode && this.parentNode.insertBefore(node, this);
        return node;
    },
    appendAfter(node) {
        this.nextSibling && this.nextSibling.appendBefore(node);
        return node;
    },
});
Object.defineImmutableProperties(Element.prototype, {
    clearHTML() {
        this.innerHTML = "";
    },
    setAttributes(attributes) {
        for (const attribute in attributes) {
            if (attributes.hasOwnProperty(attribute) && attributes[attribute]) {
                this.setAttribute(attribute, attributes[attribute].toString());
            }
        }
    },
});
Object.defineImmutableProperties(HTMLElement.prototype, {
    appendTo(parent) {
        parent.appendChild(this);
        return this;
    },
    appendNewElement(tagName) {
        return this.appendChild(document.createElement(tagName));
    },
    appendDiv() {
        return this.appendNewElement("div");
    },
    appendButton(buttonText) {
        const button = this.appendNewElement("button");
        button.innerText = buttonText;
        return button;
    },
    appendBr() {
        return this.appendNewElement("br");
    },
    withInnerText(text) {
        this.innerText = text;
        return this;
    },
    withInnerHTML(html) {
        this.innerHTML = html;
        return this;
    },
});
exports.addExtensions = function () {
};
//# sourceMappingURL=allExtensions.js.map