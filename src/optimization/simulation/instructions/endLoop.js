const { logError } = require("../../../error/log_error");
const { getCompilerFlag } = require("../../../utils/compiler_flags");
const { UNKNOWN, createState } = require("../simulation_utils");

function endLoop(State) {
    const { tape, ptr, loopsCompromised, positionCompromised, loops, result, stateStack, token } = State;

    // If the current place is known but the current byte is undefined, then either one of two things must be true.
    //
    // 1. The position is compromised (read: has been reset), meaning that the current value is unknown.
    //     the current value must be unknown if the position is compromised because it could have already been defined.
    //
    // 2. The position is not compromised. If this is the case, then the current value must simply be uninitialized,
    //     and can be freely initialized to 0.

    if (loops.length == 0) {
        logError("unbalanced_parenthesis", token, getCompilerFlag("filename"));
    }

    if (ptr !== UNKNOWN && tape[ptr] === undefined)
        tape[ptr] = (loopsCompromised.at(-1) || positionCompromised) ? UNKNOWN : 0;

    // This basically checks if the previous loop was written to the file.
    // This is the perfect check to make, as we only ever want to push the loop end
    //  if and only if we have already pushed the loop start.
    if (loopsCompromised.pop()) {

        if (State.tapeNotRaw) {
            const currentState = { tape, ptr };
            createState(result, currentState.tape, true, currentState.ptr);
            State.tapeNotRaw = false;
        }

        result.push(token);

        // If the current position is unknown or the tape was reset earilier,
        // We reset the tape, based on our knowledge that the current value is 0.
        //  (we know the current value is 0 because a loop has just ended)
        State.ptr = 0;
        tape.length = 1;
        tape[0] = 0;
        State.positionCompromised = true;
        stateStack.pop();
        return;
    }

    // Otherwise, we carry out the loop as if it were a regular interpreter.
    if (tape[ptr] > 0) {
        State.i = loops.shift() - 1;
    } else {
        loops.shift();
        stateStack.pop();
    }
}

module.exports = { endLoop };