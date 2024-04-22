const { Rules } = require("../../types/rules");
const { Register } = require("../../types/value");


module.exports = (state, { tokens, i }) => {
    // When two opposite operations (the first instruction cancels the second instruction) are next to each other, skip the second operation.
    if (tokens.length > i + 1 && tokens[i].is(Rules.CancelWhenOppositeRegister) && tokens[i + 1].is(Rules.CancelWhenOppositeRegister)) {
        const register1 = tokens[i    ].value.contents.find(e => e instanceof Register);
        const register2 = tokens[i + 1].value.contents.find(e => e instanceof Register);
        const tempCheck = tokens[i].value.contents[0].data == 0n && tokens[i + 1].value.contents[0].data == 0n && tokens[i].value.contents[1].data == 1n && tokens[i + 1].value.contents[1].data == 1n;
        if (tempCheck && tokens[i].offset == register2.data && tokens[i + 1].offset == register1.data) {
            state.result.push(tokens[i]);
            state.index++;
            state.repeatOptimizations = true;
            return true;
        }
    }
};