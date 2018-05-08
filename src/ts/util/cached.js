export const Cached = {
    new(getter) {
        const cache = {
            value: undefined,
            get() {
                if (cache.value === undefined) {
                    cache.value = getter();
                }
                return Promise.resolve(cache.value);
            },
        };
        return cache.freeze();
    },
};
//# sourceMappingURL=Cached.js.map