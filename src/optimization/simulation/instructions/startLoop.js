const { START_LOOP, END_LOOP } = require("../../../preparation/utils/instructions");
const { UNKNOWN, createState } = require("../simulation_utils");

function startLoop(State) {
    const { file, tape, ptr, loopsCompromised, positionCompromised, loops, stateStack, result, token } = State;

    if (!token.hasStateStack) {
        token.hasStateStack = true;
        stateStack.push({ tape: [...tape], ptr });
    }

    // If the current place is known but the current byte is undefined, then either one of two things must be true.
    //
    // 1. The position is compromised (read: determined at runtime), meaning that the current value is unknown.
    //    The current value must be unknown if the position is compromised because it could have already been defined.
    //
    // 2. The position is not compromised. If this is the case, then the current value must simply be uninitialized,
    //    And can be freely initialized to 0.
    if (ptr !== UNKNOWN && tape[ptr] === undefined)
        tape[ptr] = (loopsCompromised.at(-1) || positionCompromised) ? UNKNOWN : 0;

    // If either the current pointer or current tape value are unknown, our whole goose is cooked.
    // This makes logical sense, as once we enter a loop with an unknown value present,
    // we don't know if the loop will occur.
    //
    // What this means is, we don't know if the code in this loop is going to run,
    // which means we have no way of telling what is going to happen.
    //
    // In this situation, we add the loop to the file and then enter a state of total unawareness.
    if (ptr === UNKNOWN || tape[ptr] === UNKNOWN || positionCompromised) {
        let current_state = stateStack.at(-1);
        if (!current_state || current_state.ptr == UNKNOWN) {
            current_state = { tape, ptr };
        }
        if (State.tapeNotRaw)
            createState(result, current_state.tape, loopsCompromised.at(-1) || positionCompromised, current_state.ptr);
        loopsCompromised.push(true);
        State.positionCompromised = true;
        result.push(token);
        State.tapeNotRaw = false;
        State.ptr = UNKNOWN;
        return;
    }

    // Otherwise, we carry out the loop as if it were a regular interpreter.

    loopsCompromised.push(false);
    loops.unshift(State.i);

    if (tape[ptr] === 0) {
        if (token.endPosition) {
            State.i = token.endPosition;
            return;
        }
        let braceBalance = 1;
        while (braceBalance) {
            State.i++;
            if (file.length <= State.i)
                throw "Unbalanced Parens";
            if (file[State.i].instr == START_LOOP) braceBalance++;
            if (file[State.i].instr == END_LOOP) braceBalance--;
        }
        State.i--;
        token.endPosition = State.i;
    }
}

module.exports = { startLoop }