export const ReattachingBuffer = {
    new(supplier, detacherParent, detacherName) {
        let detacher = detacherParent[detacherName];
        if (!detacher.detacher) {
            const realDetacher = detacher;
            detacher = function (...args) {
                realDetacher.call(this, args);
                for (const reattacher of detacher.attached) {
                    reattacher();
                }
            };
            detacher.attached = [];
            detacher.detacher = realDetacher;
            detacherParent[detacherName] = detacher;
        }
        let value = supplier();
        detacher.attached.push(() => {
            value = supplier();
        });
        return {
            detacher: detacher,
            get() {
                return value;
            },
        };
    },
    onWasmMemoryGrowth(supplier) {
        return ReattachingBuffer.new(supplier, Module.wasmMemory, "grow");
    },
};
//# sourceMappingURL=ReattachingBuffer.js.map