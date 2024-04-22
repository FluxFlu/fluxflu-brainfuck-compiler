const { LEFT, RIGHT } = require("../types/instructions");
const { Rules } = require("../types/rules");
const { Instruction, Container } = require("../types/token");
const { Value, Constant, Register } = require("../types/value");

function calculateOffsets(file) {
    let currentOffset = 0n;
    const result = [];
    for (let i = 0; i < file.length; i++) {
        if (file[i].instr == RIGHT) {
            currentOffset += file[i].value.constant();
            continue;
        }
        if (file[i].instr == LEFT) {
            currentOffset -= file[i].value.constant();
            continue;
        }

        if (file[i].is(Rules.InterruptOffset)) {
            if (currentOffset) {
                if (currentOffset > 0n) {
                    result.push(new Instruction(RIGHT, new Value(new Constant(currentOffset)), 0n, null, null));
                } else if (currentOffset < 0n) {
                    result.push(new Instruction(LEFT, new Value(new Constant(-currentOffset)), 0n, null, null));
                }
                currentOffset = 0n;
            }
        }
        if (file[i] instanceof Container) {
            file[i].pass(calculateOffsets);
        }
        
        file[i]?.value?.contents?.filter(e => e instanceof Register)?.forEach(e => {
            e.data += currentOffset;
        });
        file[i].offset += currentOffset;

        result.push(file[i]);
    }
    return result;
}

module.exports = { calculateOffsets };