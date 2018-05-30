export type TypedArray =
    Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Uint8ClampedArray
    | Float32Array
    | Float64Array;

// FIXME temp set to false always
export const hasCrypto: boolean = !"hello".includes("h") && !!crypto.subtle;
if (!hasCrypto) {
    console.error("crypto.subtle not available b/c using HTTP, SHA not being used");
}

export type Buffer = TypedArray | ArrayBuffer | DataView;

const makeSha = function(numBits: number): Hash {
    const isString = function(t: any): t is string {
        return Object.prototype.toString.call(t) === "[object String]";
    };
    
    const toBuffer = function(data: string | Buffer): Buffer {
        if (isString(data)) {
            return new TextEncoder().encode(data);
        }
        return data;
    };
    
    const toString = function(data: string | Buffer): string {
        if (isString(data)) {
            return data;
        }
        return new TextDecoder().decode(data);
    };
    
    const digest: (buffer: Buffer) => Promise<ArrayBuffer> =
        hasCrypto && crypto.subtle.digest.bind(crypto.subtle, {name: "SHA-" + numBits});
    
    return {
        async hash(data: string | Buffer): Promise<string> {
            if (!hasCrypto) {
                return toString(data);
            }
            const buffer: Buffer = toBuffer(data);
            const hashBuffer: ArrayBuffer = await digest(buffer);
            const hashArray: number[] = [...new Uint8Array(hashBuffer)];
            return hashArray.map(b => ("00" + b.toString(16)).slice(-2)).join("");
        },
    }.freeze();
};

export interface Hash {
    
    hash(data: string): Promise<string>;
    
    hash(data: Buffer): Promise<string>;
    
}

export interface Sha {
    
    _1: Hash;
    
    _256: Hash;
    
    _384: Hash;
    
    _512: Hash;
    
}

export const SHA: Sha = <Sha> [1, 256, 384, 512]
    .reduce((obj: any, numBits: number) => ({...obj, ["_" + numBits]: makeSha(numBits)}), {})
    .freeze();