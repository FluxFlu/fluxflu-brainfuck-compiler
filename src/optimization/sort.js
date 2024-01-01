const { PLUS, SET, INPUT, OUTPUT, MINUS } = require("../preparation/utils/instructions");

const sortables = new Map([
    PLUS, MINUS, SET, INPUT, OUTPUT
].map(e => [e, true]));

function sort(file) {
    for (let i = 0; i < file.length - 1; i++) {
        if (sortables.get(file[i].instr) && sortables.get(file[i + 1].instr)) {
            if (file[i].offset !== file[i + 1].offset) {
                if (file[i + 1].offset < file[i].offset) {
                    const swap = file[i];
                    file[i] = file[i + 1];
                    file[i + 1] = swap;
                }
            }
        }
    }
    return file;
}

module.exports = { sort };