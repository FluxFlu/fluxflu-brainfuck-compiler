const { START_LOOP, SET, MINUS, PLUS, END_LOOP } = require("../../types/instructions");
const { Instruction } = require("../../types/token");
const { Value, Constant } = require("../../types/value");


module.exports = (state, { tokens, i }) => {
    // Turn instances of "[-]" into a set operation.
    if (tokens[i].instr == START_LOOP && tokens.length > i + 2 && (tokens[i + 1].instr == MINUS || tokens[i + 1].instr == PLUS) && tokens[i + 2].instr == END_LOOP) {
        state.result.push(new Instruction(SET, new Value(new Constant(0n)), 0n, tokens[i].line, tokens[i].char));
        state.index += 2;
        state.repeatOptimization = true;
        return true;
    }
};