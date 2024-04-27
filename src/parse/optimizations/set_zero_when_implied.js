const { SET } = require("../../types/instructions");
const { Rules } = require("../../types/rules");


module.exports = (state, { tokens, i }) => {
    // Setting to zero when the value is already zero is unneeded.
    if (i && tokens[i - 1].is(Rules.ImpliesZero()) && tokens[i].instr == SET && tokens[i].value.constant() == 0 && tokens[i].offset == 0) {
        state.repeatOptimizations = true;
        return true;
    }
};