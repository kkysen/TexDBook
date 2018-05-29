import {anyWindow} from "../anyWindow";

export type RestResponse<T> = {
    readonly success: boolean;
    readonly message?: string;
    readonly response?: T;
}

export const fetchJson = async function <T = any, U = any>(
    url: string, arg: T, options?: RequestInit): Promise<RestResponse<U>> {
    const response: Response = await fetch(url, Object.assign(options || {}, <RequestInit> {
        credentials: "include",
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: !arg ? arg : JSON.stringify(arg),
    }));
    try {
        return <RestResponse<U>> await response.json();
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "Invalid JSON",
            response: undefined,
        };
    }
};

anyWindow.fetchJson = fetchJson;