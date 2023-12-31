const { UNKNOWN, pushResult } = require("../simulation_utils");

function right(State) {
    const { tape, ptr, loopsCompromised, positionCompromised, token } = State;
    // If we don't know where the pointer is in the tape, how could we perform the "right" operation at compile-time?
    // Add it to the program normally.
    if (ptr === UNKNOWN) {
        pushResult(State);
        return;
    }


    // If we are aware of where the pointer is, however, the operation can be completed at runtime.

    if ((loopsCompromised.at(-1) || positionCompromised) && tape[ptr] === undefined || tape[ptr] === UNKNOWN) {
        // if (token.value == 8)
        pushResult(State);
        // if (token.value == 8) {
            // process.exit(1)
        // }
        tape[ptr] = UNKNOWN;
    } else {
        State.ptr += token.value || 1;
        // Since we have enacted a compile-time operation, the tape isn't "raw" anymore, it stores real meaningful data.
        State.tapeNotRaw = true;
    }
}

module.exports = { right }