export const Class = Object.freeze({
    new(constructor, freeze = true) {
        const klass = {
            new: constructor
        };
        if (freeze) {
            Object.freeze(klass);
        }
        return klass;
    },
});
//# sourceMappingURL=Class.js.map