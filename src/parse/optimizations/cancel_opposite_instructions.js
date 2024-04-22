const { Relations } = require("../../types/relations");
const { Instruction } = require("../../types/token");
const { Value, Constant } = require("../../types/value");


module.exports = (state, { tokens, i }) => {
    // Cancel out opposite instructions (Eg, "PLUS(4), MINUS(3)" => "PLUS(1)").
    if (tokens.length > i + 1 && tokens[i].offset == tokens[i + 1].offset && tokens[i].is(Relations.Opposites(tokens[i + 1]))) {
        if (tokens[i].value.equals(tokens[i + 1].value)) {
            state.index++;
            state.repeatOptimizations = true;
            return true;
        }
        if (tokens[i].value.constant() > tokens[i + 1].value.constant()) {
            state.result.push(new Instruction(tokens[i].instr, new Value(new Constant(tokens[i].value.constant() - tokens[i + 1].value.constant())), tokens[i].offset, tokens[i].line, tokens[i].char));
            state.index++;
            state.repeatOptimizations = true;
            return true;
        }
        state.result.push(new Instruction(tokens[i + 1].instr, new Value(new Constant(tokens[i + 1].value.constant() - tokens[i].value.constant())), tokens[i].offset, tokens[i].line, tokens[i].char));
        state.index++;
        state.repeatOptimizations = true;
        return true;
    }
};