const { compilerError } = require("../error/internal_compiler_error");
const { LEFT, RIGHT, INPUT, OUTPUT, PRINT, MINUS, WHILE, PLUS, SET, RELATIVE_MULT_PLUS, RELATIVE_MULT_MINUS, RELATIVE_SET } = require("../parse/types/instructions");
const { Instruction } = require("./types/token");
const { Value } = require("./types/value");

function multWhile(file) {
    const result = [];
    for (let i = 0; i < file.length; i++) {
        if (file[i].instr == WHILE) {
            const arr = file[i].contents;

            if (
                arr.some(e => [WHILE, INPUT, OUTPUT, PRINT, RELATIVE_MULT_PLUS, RELATIVE_MULT_MINUS].includes(e.instr))
                ||
                (
                    arr.some(e =>
                        (
                            (e.instr == LEFT || e.instr == RIGHT) ||
                            e.offset == 0 && (e.instr == PLUS || e.instr == MINUS)
                        )
                        && e.value.runtime.length != 0)
                )
            ) {
                file[i].pass(multWhile);
                result.push(file[i]);
                continue;
            }

            const totalMovement = arr.reduce((a, b) => a + (b.instr == RIGHT ? b.value.constant : b.instr == LEFT ? -b.value.constant : 0), 0);
            const zeroMod = arr.filter(e => e.offset == 0).reduce((a, b) => a + (b.instr == PLUS ? b.value.constant : b.instr == MINUS ? -b.value.constant : 0), 0);
            if (
                totalMovement == 0
                &&
                zeroMod == -1
            ) {
                const instrList = arr.filter(e => (e.instr == PLUS || e.instr == MINUS || e.instr == SET) && e.offset !== 0);
                instrList.push(arr.find(e => (e.instr == PLUS || e.instr == MINUS || e.instr == SET) && e.offset === 0));
                for (let f = 0; f < instrList.length; f++) {
                    if (instrList[f].instr == PLUS) {
                        result.push(new Instruction(RELATIVE_MULT_PLUS , new Value(instrList[f].value, [ 0 ]), instrList[f].offset));
                        continue;
                    } else if (instrList[f].instr == MINUS) {
                        result.push(new Instruction(RELATIVE_MULT_MINUS, new Value(instrList[f].value, [ 0 ]), instrList[f].offset));
                        continue;
                    } else if (instrList[f].instr == SET) {
                        result.push(new Instruction(RELATIVE_SET, new Value(instrList[f].value, [ 0 ]), instrList[f].offset));
                        continue;
                    } else {
                        compilerError("Invalid relative_mult instruction [%s].", instrList[f].toString());
                        return;
                    }
                }
                continue;
            } else {
                file[i].pass(multWhile);
                result.push(file[i]);
                continue;
            }
        }
        result.push(file[i]);
    }
    return result;
}

module.exports = { multWhile };