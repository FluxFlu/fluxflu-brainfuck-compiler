const { logCompilerError } = require("../../error/compiler_error");
const { END_LOOP, RIGHT, SET, LEFT } = require("../../preparation/utils/instructions");

const UNKNOWN = Symbol("UNKNOWN");

function createState(result, tape, ptr, zero) {
    let instr = RIGHT;
    if (ptr < 0) {
        instr = LEFT;
        ptr *= -1;
    }
    ptr -= zero;
    if (result.at(-1)?.instr == END_LOOP && tape.filter(e => typeof e == "number").length == 1 && tape[0] == 0) {
        result.push({ instr, value: ptr });
        return;
    }
    if (ptr === UNKNOWN) {
        logCompilerError("generic", "POINTER UNKNOWN.");
        console.trace();
        process.exit(1);
    }

    tape.forEach((value, i) => {
        if (value !== undefined && value !== UNKNOWN) {
            result.push({ instr: SET, offset: i - zero, value });
        }
    });
    if (ptr > 0)
        result.push({ instr, value: ptr });
}

function pushResult(State) {
    const { file, tape, ptr, zero, loopsCompromised, stateStack, result, loops, token } = State;

    // If there is real data in the tape, we add that data to the program.
    if (State.tapeNotRaw) {
        let currentState = stateStack.at(-1);
        if (loopsCompromised.at(-1) || !currentState || currentState.ptr == UNKNOWN) {
            currentState = { tape, ptr, zero };
        }
        createState(result, currentState.tape, currentState.ptr, currentState.zero);
        State.tapeNotRaw = false;
        State.ptr = 0;
        State.zero = 0;
        tape.length = 0;
    }

    // We add all of the items in the program that have currently been skipped over (due to loops).
    // In doing so, we also must indicate that the current loop SHOULD NEVER return back to the beginning of its execution.
    // It has already been determined that it should occur at compile-time.

    let len = loopsCompromised.length;
    if (len-- && !loopsCompromised[len]) {
        loopsCompromised[len] = true;
        for (let j = loops[0]; j < State.i; j++) {
            if (file[j].print)
                file[j].print.value = "";
            result.push(file[j]);
        }
    }

    result.push(token);
}

module.exports = { UNKNOWN, createState, pushResult };