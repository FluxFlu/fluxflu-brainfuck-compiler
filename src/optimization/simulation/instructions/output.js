const { PRINT } = require("../../../preparation/utils/instructions");
const { UNKNOWN, pushResult } = require("../simulation_utils");

function output(State) {
    const { tape, result, loopsCompromised, positionCompromised, token } = State;
    let ptr = State.ptr;
    

    if (ptr !== UNKNOWN) {
        ptr = ptr + token.offset;
        while (ptr < 0) {
            tape.unshift(undefined);
            ptr++;
            State.ptr++;
            State.zero++;
        }
    }

    // If the current place is known but the current byte is undefined, then either one of two things must be true.
    //
    // 1. The position is compromised (read: has been reset), meaning that the current value is unknown.
    //     the current value must be unknown if the position is compromised because it could have already been defined.
    //
    // 2. The position is not compromised. If this is the case, then the current value must simply be uninitialized,
    //     and can be freely initialized to 0.
    if (ptr !== UNKNOWN && tape[ptr] === undefined)
        tape[ptr] = (loopsCompromised.at(-1) || positionCompromised) ? UNKNOWN : 0;

    // If we don't know what the value to print is, then we must handle the print at runtime.
    if (ptr === UNKNOWN || tape[ptr] === UNKNOWN) {
        pushResult(State);
        return;
    } else {
        // Otherwise, we can print in a more efficient method, as determined at compile time.

        // We replace escape characters, as the program must compile to C.
        const printString = String.fromCharCode(tape[ptr])
            .replace("\\", "\\\\")
            .replace("\r", "\\r")
            .replace("\n", "\\n")
            .replace("\"", "\\\"")
            .replace("\0", "\\0");
        
        // If there is already a print instruction, instead of creating a new one, we add to it.
        if (result.length && result[result.length - 1].instr == PRINT)
            result[result.length - 1].value += printString;
        else
            result.push({ instr: PRINT, value: printString });
    }
}

module.exports = { output };