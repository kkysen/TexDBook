"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiBiMap = {
    new() {
        const map = new Map();
        const unmap = new Map();
        const putAll = function (keys, value) {
            for (const key of keys) {
                map.set(key, value);
            }
            const existingKeys = unmap.get(value);
            if (existingKeys) {
                for (const key of keys) {
                    existingKeys.add(key);
                }
            }
            else {
                unmap.set(value, new Set(keys));
            }
        };
        return {
            putValue(value) {
                unmap.set(value, new Set());
            },
            put(key, value) {
                if (map.has(key)) {
                    return false;
                }
                map.set(key, value);
                const keys = unmap.get(value);
                if (keys) {
                    keys.add(key);
                }
                else {
                    unmap.set(value, new Set([key]));
                }
                return true;
            },
            putAll,
            putAllFrom(multiBiMap) {
                for (const [value, keys] of multiBiMap.valueEntries()) {
                    putAll(keys, value);
                }
            },
            hasKey(key) {
                return map.has(key);
            },
            hasValue(value) {
                return unmap.has(value);
            },
            getValue(key) {
                return map.get(key);
            },
            getKeys(value) {
                return unmap.get(value);
            },
            removeKey(key) {
                const prev = map.get(key);
                map.delete(key);
                return prev;
            },
            removeValue(value) {
                const prev = unmap.get(value);
                unmap.get(value);
                return prev;
            },
            clear() {
                map.clear();
                unmap.clear();
            },
            numKeys() {
                return map.size;
            },
            numValues() {
                return unmap.size;
            },
            keys() {
                return map.keys();
            },
            values() {
                return unmap.keys();
            },
            keyEntries() {
                return map.entries();
            },
            valueEntries() {
                return unmap.entries();
            },
        }.freeze();
    },
}.freeze();
//# sourceMappingURL=MultiBiMap.js.map