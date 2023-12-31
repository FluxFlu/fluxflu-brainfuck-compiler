const { PRINT } = require("../../../preparation/utils/instructions");
const { UNKNOWN, pushResult } = require("../simulation_utils");

function output(State) {
    const { tape, ptr, result } = State;

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