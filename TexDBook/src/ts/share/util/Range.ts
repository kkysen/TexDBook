export interface Range {
    
    map<T>(func: (i: number) => T): T[];
    
    forEach(func: (i: number) => void): void;
    
    toArray(): number[];
    
    toInterval(): number[];
    
}

export type RangeClass = {
    
    new: (from: number, to?: number) => Range;
    
    ofDomain(domain: number[]): Range;
    
};

export const Range: RangeClass = Object.freeze({
    
    new(from: number, to?: number): Range {
        const _from: number = to === undefined ? 0 : from;
        const _to: number = to === undefined ? from : to;
        
        return {
            
            map<T>(func: (i: number) => T): T[] {
                const a: T[] = new Array(_to - _from);
                for (let i: number = _from; i < _to; i++) {
                    a[i - _from] = func(i);
                }
                return a;
            },
            
            forEach(func: (i: number) => void): void {
                for (let i: number = _from; i < _to; i++) {
                    func(i);
                }
            },
    
            toArray(): number[] {
                return this.map(i => i);
            },
            
            toInterval(): number[] {
                return [_from, _to];
            },
            
        };
        
    },
    
    ofDomain(domain: number[]): Range {
        return this.new(Math.min(...domain), Math.max(...domain));
    },
    
});