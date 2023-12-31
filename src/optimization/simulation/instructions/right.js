const { UNKNOWN, pushResult } = require("../simulation_utils");

function right(State) {
    const { ptr, token } = State;
    
    // If we don't know where the pointer is in the tape, how could we perform the "right" operation at compile-time?
    // Add it to the program normally.
    if (ptr === UNKNOWN) {
        pushResult(State);
        return;
    }

    // If we are aware of where the pointer is, however, the operation can be completed at runtime.
    State.ptr += token.value || 1;

    // Since we have enacted a compile-time operation, the tape isn't "raw" anymore, it stores real meaningful data.
    State.tapeNotRaw = true;
}

module.exports = { right };