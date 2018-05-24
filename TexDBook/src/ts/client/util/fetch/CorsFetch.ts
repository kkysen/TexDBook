const origin = window.location.origin;

export const corsServerUrl: string = "http://localhost:8888/";

export const getOrigin = function(url: string): string {
    const domainIndex: number = url.indexOf("//");
    const pathIndex: number = url.indexOf("/", domainIndex);
    return pathIndex === -1 ? url : url.slice(0, pathIndex);
};

export const isSameOrigin = function(url: string) {
    return getOrigin(url) === origin;
};

export const corsFetch = function(input?: string | Request, init?: RequestInit): Promise<Response> {
    const url: string | undefined = input instanceof Request ? input.url : input;
    if (url && !isSameOrigin(url)) {
        const newUrl = corsServerUrl + url;
        if (input instanceof Request) {
            input = new Request(newUrl, input as RequestInit);
        } else {
            input = newUrl;
        }
    }
    return window.fetch(input, init);
};