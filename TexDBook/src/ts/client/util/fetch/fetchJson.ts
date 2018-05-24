export const fetchJson = async function <T = any, U = any>(url: string, arg: T, options?: RequestInit): Promise<U> {
    const response: Response = await fetch(url, Object.assign(options || {}, <RequestInit> {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
    }));
    return <U> await response.json();
};