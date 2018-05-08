const origin = window.location.origin;
export const corsServerUrl = "http://localhost:8888/";
export const getOrigin = function (url) {
    const domainIndex = url.indexOf("//");
    const pathIndex = url.indexOf("/", domainIndex);
    return pathIndex === -1 ? url : url.slice(0, pathIndex);
};
export const isSameOrigin = function (url) {
    return getOrigin(url) === origin;
};
export const corsFetch = function (input, init) {
    console.log(arguments);
    const url = input instanceof Request ? input.url : input;
    if (!isSameOrigin(url)) {
        const newUrl = corsServerUrl + url;
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