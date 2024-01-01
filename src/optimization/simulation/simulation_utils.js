const { logCompilerError } = require("../../error/compiler_error");
const { END_LOOP, RIGHT, SET } = require("../../preparation/utils/instructions");

const UNKNOWN = Symbol("UNKNOWN");

function createState(result, tape, positionCompromised, ptr) {
    if (result.at(-1)?.instr == END_LOOP && tape.filter(e => typeof e == "number").length == 1 && tape[0] == 0 && positionCompromised) {
        result.push({ instr: RIGHT, value: ptr });
        return;
    }
    if (ptr === UNKNOWN) {
        logCompilerError("generic", "POINTER UNKNOWN.");
        console.trace();
        process.exit(1);
    }
    // const set = {};
    // tape.forEach((e, i) => { if (e !== undefined && e !== UNKNOWN) set[i] = e; });
    result.push({ instr: RIGHT, value: ptr });
    tape.forEach((value, i) => {
        if (value !== undefined && value !== UNKNOWN) {
            result.push({ instr: SET, offset: i, value });
        }
    })
    // result.push({ instr: CREATE_STATE, value: { tape: set, ptr, set: !positionCompromised } });
}

function pushResult(State) {

    const { file, tape, ptr, positionCompromised, loopsCompromised, stateStack, result, loops, token } = State;

    // If there is real data in the tape, we add that data to the program.
    if (State.tapeNotRaw) {
        let currentState = stateStack.at(-1);
        if (loopsCompromised.at(-1) || !currentState || currentState.ptr == UNKNOWN) {
            currentState = { tape, ptr };
        }
        createState(result, currentState.tape, loopsCompromised.at(-1) || positionCompromised, currentState.ptr + token.offset);
        State.tapeNotRaw = false;
    }

    // We add all of the items in the program that have currently been skipped over (due to loops).
    // In doing so, we also must indicate that the current loop SHOULD NEVER return back to the beginning of its execution.
    // It has already been determined that it should occur at compile-time.

    let len = loopsCompromised.length;
    if (len-- && !loopsCompromised[len]) {
        loopsCompromised[len] = true;
        for (let j = loops[0]; j < State.i; j++) {
            result.push(file[j]);
        }
    }

    result.push(token);
}

module.exports = { UNKNOWN, createState, pushResult };