import {TexDBook} from "../../core/TexDBook";
import {anyWindow} from "../anyWindow";

export const fetchJson = async function <T = any, U = any>(url: string, arg: T, options?: RequestInit): Promise<U> {
    const response: Response = await fetch(url, Object.assign(options || {}, <RequestInit> {
        credentials: "include",
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: !arg ? arg : JSON.stringify(arg),
    }));
    return <U> await response.json();
};

anyWindow.fetchJson = fetchJson;