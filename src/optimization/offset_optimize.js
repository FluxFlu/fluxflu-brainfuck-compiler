const { LEFT, RIGHT, END_LOOP, START_LOOP } = require("../parse/types/instructions");

function offsetOptimize(file) {
    let currentOffset = 0;
    const result = [];
    for (let i = 0; i < file.length; i++) {
        if (file[i].instr == RIGHT) {
            currentOffset += file[i].value || 1;
            continue;
        }
        if (file[i].instr == LEFT) {
            currentOffset -= file[i].value || 1;
            continue;
        }

        file[i].offset += currentOffset;
        if (file[i].instr == END_LOOP || file[i].instr == START_LOOP) {
            if (currentOffset) {
                if (currentOffset > 0) {
                    result.push({instr: RIGHT, value: currentOffset});
                } else {
                    result.push({instr: LEFT, value: -currentOffset});
                }
                currentOffset = 0;
            }
        }
        result.push(file[i]);
    }
    return result;
}

module.exports = { offsetOptimize };