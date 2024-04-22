const { Rules } = require("../../types/rules");


module.exports = (state, { tokens, i }) => {
    // When two nullable operations (the second instruction cancels the first instruction) are next to each other, skip the first operation.
    if (tokens.length > i + 1 && tokens[i].offset == tokens[i + 1].offset && tokens[i].is(Rules.Nullable) && tokens[i + 1].is(Rules.Nullable)) {
        state.repeatOptimizations = true;
        return true;
    }
};