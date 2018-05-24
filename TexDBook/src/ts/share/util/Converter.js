"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Class_1 = require("./Class");
// TODO addFilter types
exports.Converter = Class_1.Class.new((fieldConverters = {}, defaultConverter = Number, defaultValue = 0) => {
    return (o) => {
        for (const field in o) {
            if (o.hasOwnProperty(field)) {
                // convert using fieldConverters (default Number) and replace any NaNs with 0s
                o[field] = (fieldConverters[field] || defaultConverter)(o[field]) || defaultValue;
            }
        }
        return o;
    };
});
//# sourceMappingURL=Converter.js.map