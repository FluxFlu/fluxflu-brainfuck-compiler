const { UNKNOWN, pushResult } = require("../simulation_utils");

function right(State) {
    const { loopsCompromised, positionCompromised, tape, ptr, token } = State;
    
    // If we don't know where the pointer is in the tape, how could we perform the "right" operation at compile-time?
    // Add it to the program normally.
    if (ptr === UNKNOWN) {
        pushResult(State);
        return;
    }

    if ((loopsCompromised.at(-1) || positionCompromised) && tape[ptr + 1] == undefined || tape[ptr + 1] == UNKNOWN) {
        pushResult(State);

        // We move both at compile-time and runtime to maintain a sense of propriety.
        State.ptr += token.value || 1;
        tape[State.ptr] = UNKNOWN;
        return;
    }

    // We move both at compile-time and runtime to maintain a sense of propriety.
    State.ptr += token.value || 1;
    // Since we have enacted a compile-time operation, the tape isn't "raw" anymore, it stores real meaningful data.
    State.tapeNotRaw = true;
}

module.exports = { right };