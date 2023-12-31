const { UNKNOWN, pushResult } = require("../simulation_utils");

function left(State) {
    const { ptr, loopsCompromised, positionCompromised, token } = State;

    // If the current tape is arbitrary,
    // we have to treat the "left" operation differently.
    // Basically, we cut our losses on the optimizations we've done so far, and start over from scratch.
    if (loopsCompromised.at(-1) || positionCompromised) {
        pushResult(State);

        // The location of the ptr is now unknown.
        State.ptr = UNKNOWN;
        return;
    }

    // If we don't know where the pointer is in the tape, how could we perform the "left" operation at compile-time?
    // Add it to the program normally.
    if (ptr === UNKNOWN) {
        pushResult(State);
        return;
    }

    // If we are aware of where the pointer is, however, the operation can be completed at runtime.
    if (token.value > 1) {
        if (token.value >= State.ptr)
            State.ptr = 0;
        else
            State.ptr -= token.value;
    } else if (State.ptr)
        State.ptr--;

    // Since we have enacted a compile-time operation, the tape isn't "raw" anymore, it stores real meaningful data.
    State.tapeNotRaw = true;
}

module.exports = { left }