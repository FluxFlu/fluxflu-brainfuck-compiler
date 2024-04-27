const { compilerError } = require("../error/internal_compiler_error");
const { WHILE, SET, IF, END } = require("../types/instructions");
const { Rules } = require("../types/rules");
const { Container } = require("../types/token");

function parseIf(file) {
    const result = [];
    for (let i = 0; i < file.length; i++) {
        if (file[i] instanceof Container) {
            if (file[i].instr == WHILE) {
                let arr = file[i].contents;
                if (
                    arr.at(-2)?.instr == SET && arr.at(-2).value.constant() == 0n && arr.at(-2).offset == 0n ||
                    arr.at(-2)?.is(Rules.ImpliesZero())
                ) {
                    if (arr.at(-1).instr !== END) {
                        compilerError("Invalid loop [%o].", file[i]);
                    }
                    arr = parseIf(arr);
                    result.push(new Container(IF, arr, file[i].offset, file[i].line, file[i].char));
                    continue;
                }
            }
            file[i].pass(e => parseIf(e));
        }
        result.push(file[i]);
    }
    return result;
}

module.exports = { parseIf };