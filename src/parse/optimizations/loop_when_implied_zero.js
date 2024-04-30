const { SET } = require("../../types/instructions");
const { Rules } = require("../../types/rules");


module.exports = (state, { tokens, i }) => {
    // Attempting to loop when it is already known that the value is zero is fruitless.
    if (
        i && (
            tokens[i - 1].is(Rules.ImpliesZero()) ||
            tokens[i - 1].instr == SET && tokens[i - 1].value.constant() == 0
        ) && (tokens[i].is(Rules.RequiresNonzero())) && tokens[i].offset == tokens[i - 1].offset
    ) {
        state.repeatOptimizations = true;
        return true;
    }
};