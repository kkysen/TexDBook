export interface MultiBiMap<K, V> {
    
    putValue(value: V): void;
    
    put(key: K, value: V): void;
    
    putAll(keys: K[] | Set<K>, value: V): void;
    
    putAllFrom(multiBiMap: MultiBiMap<K, V>): void;
    
    hasKey(key: K): boolean;
    
    hasValue(value: V): boolean;
    
    getValue(key: K): V | undefined;
    
    getKeys(value: V): Set<K> | undefined;
    
    removeKey(key: K): V | undefined;
    
    removeValue(value: V): Set<K> | undefined;
    
    numKeys(): number;
    
    numValues(): number;
    
    keys(): IterableIterator<K>;
    
    values(): IterableIterator<V>;
    
    keyEntries(): IterableIterator<[K, V]>;
    
    valueEntries(): IterableIterator<[V, Set<K>]>;
    
}


export const MultiBiMap = {
    
    new<K, V>(): MultiBiMap<K, V> {
        
        const map: Map<K, V> = new Map();
        const unmap: Map<V, Set<K>> = new Map();
        
        const putAll = function(keys: K[] | Set<K>, value: V): void {
            for (const key of keys) {
                map.set(key, value);
            }
            
            const existingKeys: Set<K> | undefined = unmap.get(value);
            if (existingKeys) {
                for (const key of keys) {
                    existingKeys.add(key);
                }
            } else {
                unmap.set(value, new Set(keys));
            }
        };
        
        return {
            
            putValue(value: V): void {
                unmap.set(value, new Set());
            },
            
            put(key: K, value: V): boolean {
                if (map.has(key)) {
                    return false;
                }
                map.set(key, value);
                const keys: Set<K> | undefined = unmap.get(value);
                if (keys) {
                    keys.add(key);
                } else {
                    unmap.set(value, new Set([key]));
                }
                return true;
            },
            
            putAll: putAll,
            
            putAllFrom(multiBiMap: MultiBiMap<K, V>): void {
                for (const [value, keys] of multiBiMap.valueEntries()) {
                    putAll(keys, value);
                }
            },
            
            hasKey(key: K): boolean {
                return map.has(key);
            },
            
            hasValue(value: V): boolean {
                return unmap.has(value);
            },
            
            getValue(key: K): V | undefined {
                return map.get(key);
            },
            
            getKeys(value: V): Set<K> | undefined {
                return unmap.get(value);
            },
            
            removeKey(key: K): V | undefined {
                const prev: V | undefined = map.get(key);
                map.delete(key);
                return prev;
            },
            
            removeValue(value: V): Set<K> | undefined {
                const prev: Set<K> | undefined = unmap.get(value);
                unmap.get(value);
                return prev;
            },
            
            numKeys(): number {
                return map.size;
            },
            
            numValues(): number {
                return unmap.size;
            },
            
            keys(): IterableIterator<K> {
                return map.keys();
            },
            
            values(): IterableIterator<V> {
                return unmap.keys();
            },
            
            keyEntries(): IterableIterator<[K, V]> {
                return map.entries();
            },
            
            valueEntries(): IterableIterator<[V, Set<K>]> {
                return unmap.entries();
            },
            
        }.freeze();
        
    },
    
}.freeze();