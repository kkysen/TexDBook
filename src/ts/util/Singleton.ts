import {Class} from "./Class";

export const Singleton = Class.new((constructor, ...args) => Object.freeze(constructor(...args)));