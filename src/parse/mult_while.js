const { compilerError } = require("../error/internal_compiler_error");
const { LEFT, RIGHT, MINUS, WHILE, PLUS, SET, RELATIVE_PLUS, RELATIVE_MINUS, CHECK_SET, END, STILL_WHILE } = require("../types/instructions");
const { Instruction, Container } = require("../types/token");
const { Value, Constant, Register } = require("../types/value");

function multWhile(file) {
    const result = [];
    for (let i = 0; i < file.length; i++) {
        if (file[i] instanceof Container) {
            const arr = file[i].contents;
            const offset = file[i].offset;
            if (![WHILE, STILL_WHILE].includes(file[i].instr) || arr.some(e => ![LEFT, RIGHT, PLUS, MINUS, SET, END].includes(e.instr))) {
                file[i].pass(multWhile);
                result.push(file[i]);
                continue;
            }

            const totalMovement = arr.reduce((a, b) => a + (b.instr == RIGHT ? b.value.constant() : b.instr == LEFT ? -b.value.constant() : 0n), 0n);
            const zeroMod = arr.filter(e => e.offset == 0n).reduce((a, b) => a + (b.instr == PLUS ? b.value.constant() : b.instr == MINUS ? -b.value.constant() : 0n), 0n);
            if (
                totalMovement == 0n
                &&
                zeroMod == -1n
            ) {
                const instrList = arr.filter(e => (e.instr == PLUS || e.instr == MINUS || e.instr == SET) && e.offset !== 0n);
                instrList.push(arr.find(e => (e.instr == PLUS || e.instr == MINUS || e.instr == SET) && e.offset === 0n));
                for (let f = 0; f < instrList.length; f++) {
                    const [line, char] = [instrList[f].line, instrList[f].char];
                    if (instrList[f].instr == PLUS) {
                        result.push(new Instruction(RELATIVE_PLUS, new Value(
                            // tape[index + offset] += x + y * tape[z + index]

                            new Constant(0n),                            // x
                            new Constant(instrList[f].value.constant()), // y
                            new Register(0n)                             // z
                        ), instrList[f].offset + offset                  // offset
                        , line, char
                        ));
                        continue;
                    } else if (instrList[f].instr == MINUS) {
                        if (instrList[f].offset === 0n) {
                            result.push(new Instruction(SET, new Value(new Constant(0n)), offset, line, char));
                        } else {
                            result.push(new Instruction(RELATIVE_MINUS, new Value(
                                // tape[index + offset] += x + y * tape[z + index]

                                new Constant(0n),                            // x
                                new Constant(instrList[f].value.constant()), // y
                                new Register(0n)                             // z
                            ), instrList[f].offset + offset                  // offset
                            , line, char
                            ));
                        }
                        continue;
                    } else if (instrList[f].instr == SET) {
                        result.push(new Instruction(CHECK_SET, new Value(new Constant(0n), new Register(0n), new Constant(instrList[f].value.constant())), instrList[f].offset + offset, line, char));
                        continue;
                    } else {
                        compilerError("Invalid relative instruction [%s].", instrList[f].toString());
                        return;
                    }
                }
                continue;
            }
        }
        result.push(file[i]);
    }
    return result;
}

module.exports = { multWhile };