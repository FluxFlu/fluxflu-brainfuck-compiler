const { Rules } = require("../types/rules");
const { Container } = require("../types/token");

function offsetSort(file) {
    for (let i = 0; i < file.length - 1; i++) {
        if (file[i].is(Rules.OffsetSortable()) && file[i + 1].is(Rules.OffsetSortable())) {
            // TODO: Enforce no register overlap. This will allow for a much wider array of instructions to be considered OffsetSortable.
            // In particular, cannot swap x with y if x.registers.includes(y.offset) or vice versa.
            if (file[i + 1].offset < file[i].offset) {
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