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
        } else if (file[i].instr == LEFT) {
            currentOffset -= file[i].value.constant();
            continue;
        } else if (file[i] instanceof Container && !file[i].is(Rules.InterruptOffset())) {
            file[i].pass(calculateOffsets);
        }

        if (file[i].is(Rules.InterruptOffset())) {
            if (currentOffset) {
                if (currentOffset > 0n) {
                    result.push(new Instruction(RIGHT, new Value(new Constant(currentOffset)), 0n, null, null));
                } else if (currentOffset < 0n) {
                    result.push(new Instruction(LEFT, new Value(new Constant(-currentOffset)), 0n, null, null));
                }
                currentOffset = 0n;
            }

            if (file[i] instanceof Container) {
                file[i].pass(calculateOffsets);
            }
        }
        
        const modOffsets = token => {
            if (token instanceof Instruction) {
                token.value.contents.filter(e => e instanceof Register)?.forEach(e => {
                    e.data += currentOffset;
                });
            } else {
                token.contents.forEach(modOffsets);
            }
        };
        modOffsets(file[i]);
        
        file[i].offset += currentOffset;

        result.push(file[i]);
    }
    return result;
}

module.exports = { calculateOffsets };