const { WHILE, LEFT, RIGHT, SCAN_LEFT, SCAN_RIGHT } = require("../../types/instructions");
const { Instruction } = require("../../types/token");


module.exports = (state, { tokens, i }) => {
    // Turn instances of "[>>>]", "[<]", etc. into a scan operation.
    if (tokens[i].instr == WHILE && tokens[i].contents.length == 2 && [LEFT, RIGHT].includes(tokens[i].contents[0].instr)) {
        const instr = tokens[i].contents[0].instr == LEFT ? SCAN_LEFT : SCAN_RIGHT;
        state.result.push(new Instruction(instr, tokens[i].contents[0].value, 0n, tokens[i].line, tokens[i].char));
        state.repeatOptimization = true;
        return true;
    }
};