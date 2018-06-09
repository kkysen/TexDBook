export interface FunctionDecorator<T, Decorated> {
    
    <U extends T>(target: U): U;
    
}

export interface Named {
    
    readonly name: string;
    
}

export const named = function named(name: string): FunctionDecorator<Function, Named> {
    
    return function <T extends Function>(target: T): T {
        return target.named(name);
    };
    
};