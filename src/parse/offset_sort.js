const { Rules } = require("../types/rules");
const { Container } = require("../types/token");
const { Register } = require("../types/value");

function checkSwap(token, potentialSwap) {
    if (potentialSwap && (
        token.is(Rules.OffsetSortable()) && potentialSwap.is(Rules.OffsetSortable())
        || !token.is(Rules.NullOffset()) && potentialSwap.is(Rules.NullOffset())
    )) {
        if (potentialSwap.offset < token.offset) {
            if (token instanceof Container) {
                return token.contents.map(e => {
                    const copy = e.copy();
                    copy.offset += token.offset;
                    return copy;
                }).every(e => checkSwap(e, potentialSwap));
            } else if (token.value.contents.some(e => e instanceof Register) || potentialSwap.value.contents.some(e => e instanceof Register)) {
                if ([
                    [token.offset, potentialSwap.value.contents],
                    [potentialSwap.offset, token.value.contents]
                ].some(([from, against]) => {
                    return against.some(e => e instanceof Register && e.data == from);
                })) {
                    return false;
                }
            }
            return true;
        }
    }
}

function offsetSort(file) {
    let repeat = true;
    while (repeat) {
        repeat = false;
        for (let i = 0; i < file.length; i++) {
            if (checkSwap(file[i], file[i + 1])) {
                const swap = file[i];
                file[i] = file[i + 1];
                file[i + 1] = swap;
                repeat = true;
            }
            if (file[i] instanceof Container) {
                file[i].pass(offsetSort);
            }
        }
    }
    return file;
}

module.exports = { offsetSort };