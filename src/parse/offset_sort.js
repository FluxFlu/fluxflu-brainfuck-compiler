const { Rules } = require("./types/rules");
const { Container } = require("./types/token");

function offsetSort(file) {
    for (let i = 0; i < file.length - 1; i++) {
        console.log(file[i].is(Rules.OffsetSortable) && file[i + 1].is(Rules.OffsetSortable));
        if (file[i].is(Rules.OffsetSortable) && file[i + 1].is(Rules.OffsetSortable)) {
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