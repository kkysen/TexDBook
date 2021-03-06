"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = {
    new(from, to) {
        const _from = to === undefined ? 0 : from;
        const _to = to === undefined ? from : to;
        return {
            map(func) {
                const a = [];
                for (let i = _from; i < _to; i++) {
                    a.push(func(i));
                }
                return a;
            },
            forEach(func) {
                for (let i = _from; i < _to; i++) {
                    func(i);
                }
            },
            toArray() {
                return this.map(i => i);
            },
            toInterval() {
                return [_from, _to];
            },
        };
    },
    ofDomain(domain) {
        return this.new(Math.min(...domain), Math.max(...domain));
    },
}.freeze();
//# sourceMappingURL=Range.js.map