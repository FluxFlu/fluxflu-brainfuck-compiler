const { LEFT, RIGHT, WHILE, END } = require("../parse/types/instructions");
const { Instruction } = require("./types/token");
const { Value } = require("./types/value");

function calculateOffsets(file) {
    let currentOffset = 0;
    const result = [];
    for (let i = 0; i < file.length; i++) {
        if (file[i].instr == RIGHT) {
            if (file[i].value.runtime.length != 0) {
                return file;
            }
            currentOffset += file[i].value.constant;
            continue;
        }
        if (file[i].instr == LEFT) {
            if (file[i].value.runtime.length != 0) {
                return file;
            }
            currentOffset -= file[i].value.constant;
            continue;
        }

        file[i].offset += currentOffset;
        if (file[i].instr == WHILE || file[i].instr == END) {
            if (currentOffset) {
                if (currentOffset > 0) {
                    result.push(new Instruction(RIGHT, new Value(currentOffset, []), 0, null, null));
                } else if (currentOffset < 0) {
                    result.push(new Instruction(LEFT, new Value(-currentOffset, []), 0, null, null));
                }
                currentOffset = 0;
            }
        }
        if (file[i].instr == WHILE) {
            file[i].pass(calculateOffsets);
        }
        result.push(file[i]);
    }
    return result;
}

module.exports = { calculateOffsets };