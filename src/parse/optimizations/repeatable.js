const { Rules } = require("../../types/rules");
const { Instruction } = require("../../types/token");
const { Constant, Value, StringConstant } = require("../../types/value");


module.exports = (state, { tokens, i }) => {
    // If the current operation is repeatable (Eg, "PLUS(3), PLUS(1)" => "PLUS(4)"), then gather all of the operations and fold them together.
    if (tokens.length > i + 1 && tokens[i + 1].offset === tokens[i].offset && tokens[i + 1].instr === tokens[i].instr && tokens[i].is(Rules.Repeatable())) {
        const type = tokens[i].value.match(StringConstant) ? StringConstant : Constant;
        let num = tokens[i].value.constant();
        while (tokens.length > i + 1 && tokens[i + 1].offset === tokens[i].offset && tokens[i + 1].instr === tokens[i].instr) {
            num += tokens[i + 1].value.constant();
            i++;
        }
        state.index = i;
        state.result.push(new Instruction(tokens[i].instr, new Value(new type(num)), tokens[i].offset, tokens[i].line, tokens[i].char));
        state.repeatOptimizations = true;
        return true;
    }
};