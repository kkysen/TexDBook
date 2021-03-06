"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const origin = window.location.origin;
exports.corsServerUrl = "http://localhost:8888/";
exports.getOrigin = function (url) {
    const domainIndex = url.indexOf("//");
    const pathIndex = url.indexOf("/", domainIndex);
    return pathIndex === -1 ? url : url.slice(0, pathIndex);
};
exports.isSameOrigin = function (url) {
    return exports.getOrigin(url) === origin;
};
exports.corsFetch = function (input, init) {
    const url = input instanceof Request ? input.url : input;
    if (url && !exports.isSameOrigin(url)) {
        const newUrl = exports.corsServerUrl + url;
        if (input instanceof Request) {
            input = new Request(newUrl, input);
        }
        else {
            input = newUrl;
        }
    }
    return window.fetch(input, init);
};
//# sourceMappingURL=CorsFetch.js.map