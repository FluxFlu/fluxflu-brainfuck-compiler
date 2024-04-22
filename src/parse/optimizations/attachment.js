const { Relations } = require("../../types/relations");


module.exports = (state, { tokens, i }) => {
    // Apply the Attachment rule.
    // E.G. "SET(5), PLUS(2)" == "SET(7)"
    if (
        tokens.length > i + 1 &&
        tokens[i].offset == tokens[i + 1].offset &&
        (
            tokens[i + 1].is(Relations.Attachment(tokens[i]))
        )
    ) {
        const data = tokens[i + 1].is(Relations.Attachment(tokens[i])).get();
        
        tokens[i].instr = data.instruction;
        tokens[i].value = data.operation(tokens[i].value, tokens[i + 1].value);

        state.result.push(tokens[i]);
        state.index++;
        state.repeatOptimizations = true;
        return true;
    }
};