const { Rules } = require("../types/rules");
const { Container } = require("../types/token");
const { Register } = require("../types/value");

function offsetSort(file) {
    for (let i = 0; i < file.length; i++) {
        if (file[i + 1] && file[i].is(Rules.OffsetSortable()) && file[i + 1].is(Rules.OffsetSortable())) {
            if (file[i + 1].offset < file[i].offset) {
                if (file[i].value.contents.some(e => e instanceof Register) || file[i + 1].value.contents.some(e => e instanceof Register)) {
                    if ([
                        [file[i].offset, file[i + 1].value.contents],
                        [file[i + 1].offset, file[i].value.contents]
                    ].some(([from, against]) => {
                        return against.some(e => e instanceof Register && e.data == from);
                    })) {
                        continue;
                    }
                }
                const swap = file[i];
                file[i] = file[i + 1];
                file[i + 1] = swap;
            }
        }
        if (file[i] instanceof Container) {
            file[i].pass(e => offsetSort(e));
        }
    }
    return file;
}

module.exports = { offsetSort };