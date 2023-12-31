const { logError } = require("../../../error/log_error");
const { UNKNOWN, createState } = require("../simulation_utils");

function endLoop(State) {
    const { tape, ptr, loopsCompromised, positionCompromised, loops, result, stateStack, token } = State;

    // If the current place is known but the current byte is undefined, then either one of two things must be true.
    //
    // 1. The position is compromised (read: determined at runtime), meaning that the current value is unknown.
    //    The current value must be unknown if the position is compromised because it could have already been defined.
    //
    // 2. The position is not compromised. If this is the case, then the current value must simply be uninitialized,
    //    And can be freely initialized to 0.

    if (loops.length == 0) {
        logError("unbalanced_parenthesis", token, getCompilerFlag("filename"));
    }

    if (ptr !== UNKNOWN && tape[ptr] === undefined)
        tape[ptr] = (loopsCompromised.at(-1) || positionCompromised) ? UNKNOWN : 0;

    // If we are compromised, we have no idea whether or not the loop has truly ended.
    // Thus, we treat this as a runtime-value, currently unknown, and continue the simulation past that.
    if (loopsCompromised.pop()) {

        if (State.tapeNotRaw) {
            // let current_state = stateStack.at(-1);
            // if (!current_state || current_state.ptr == UNKNOWN) {
            //     current_state = { tape, ptr };
            // }
            const current_state = { tape, ptr };
            createState(result, current_state.tape, true, current_state.ptr);
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
        // if (ptr !== UNKNOWN)
        //     tape[ptr] = 0;
        loops.shift();
        stateStack.pop();
    }
}

module.exports = { endLoop }