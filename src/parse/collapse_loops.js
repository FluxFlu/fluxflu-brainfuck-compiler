const { logError } = require("../error/log_error");
const { getFilename } = require("../utils/compiler_flags");
const { START_LOOP, END_LOOP, WHILE, END } = require("../types/instructions");
const { Container, Instruction } = require("../types/token");
const { Value, Constant } = require("../types/value");


function collapseLoops(tokens) {
    const out = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.instr == START_LOOP) {
            let braceCount = 1;
            i++;
            const loopContents = [];
            const loopStart = token;
            let loopEnd = null;
            for(;;) {
                if (!tokens[i]) {
                    logError("unbalanced_braces", loopStart, getFilename());
                }
                if (tokens[i].instr == START_LOOP) {
                    braceCount++;
                } else if (tokens[i].instr == END_LOOP) {
                    braceCount--;
                    if (braceCount == 0) {
                        loopEnd = tokens[i];
                        break;
                    }
                }
                loopContents.push(tokens[i]);
                i++;
            }
            out.push(new Container(WHILE, collapseLoops(loopContents.concat([new Instruction(END, new Value(new Constant(null)), 0n, loopEnd.line, loopEnd.char)])), 0n, loopStart.line, loopStart.char));
        } else {
            out.push(tokens[i]);
        }
    }
    return out;
}

module.exports = { collapseLoops };