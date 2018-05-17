export const greedyAsyncIterable = async function* <T>(delegate: Iterable<Promise<T>>): AsyncIterable<T> {
    const promises: Promise<T>[] = [];
    const iterator: Iterator<Promise<T>> = delegate[Symbol.iterator]();
    let next: IteratorResult<Promise<T>>;
    while ((next = iterator.next()).done) {
        promises.push(next.value);
    }
    // resolve all promises before yielding them so they are resolved concurrently
    for (const promise of promises) {
        yield promise;
    }
};

(async () => {
    const a: Promise<string>[] = [""].map(url => fetch(url).then(response => response.text()));
    greedyAsyncIterable(a);
    for await (const e of greedyAsyncIterable(a)) {
    
    }
})();