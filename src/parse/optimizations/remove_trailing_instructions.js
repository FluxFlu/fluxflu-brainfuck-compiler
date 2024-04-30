const { Rules } = require("../../types/rules");
const { Container } = require("../../types/token");

const doesNotOutput = token => {
    if (token instanceof Container) {
        return token.contents.every(doesNotOutput);
    } else {
        return token.is(Rules.DoesNotOutput());
    }
};

module.exports = (state, { tokens, i, global }) => {
    // There are some things that don't need to be done at the end of a program. Remove these.
    if (
        global &&
        i == tokens.length - 1 &&
        doesNotOutput(tokens[i])
    ) {
        state.repeatOptimizations = true;
        return true;
    }
};