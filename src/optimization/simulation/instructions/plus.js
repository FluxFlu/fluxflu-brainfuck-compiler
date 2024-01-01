const { UNKNOWN, pushResult } = require("../simulation_utils");

let h = 0;
function plus(State) {
    const { tape, ptr, loopsCompromised, positionCompromised, token } = State;

    // If the current place is known but the current byte is undefined, then either one of two things must be true.
    //
    // 1. The position in the tape is compromised (read: has been reset), meaning that the current value is unknown.
    //    The current value must be unknown if the position is compromised because it could have already been defined.
    //
    // 2. The position is not compromised. If this is the case, then the current value must simply be uninitialized,
    //     and can be freely initialized to 0.
    if (ptr !== UNKNOWN && tape[ptr] === undefined)
        tape[ptr] = (loopsCompromised.at(-1) || positionCompromised) ? UNKNOWN : 0;

    // If the current place is unknown, we can't treat this as a compile-time operation,
    //  so we add it to the program as normal and move on.
    if (tape[ptr] === UNKNOWN || ptr === UNKNOWN) {
        pushResult(State);
        return;
    }

    // If the current place is known, however, we run the add operation at compile time instead.
    tape[ptr] = (tape[ptr] + (token.value || 1)) % 256;

    // Since we have enacted a compile-time operation, the tape isn't "raw" anymore, it stores real meaningful data.
    State.tapeNotRaw = true;
}

module.exports = { plus };