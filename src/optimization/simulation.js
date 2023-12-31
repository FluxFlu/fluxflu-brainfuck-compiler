// const { stdout } = require("process");

const { PLUS, MINUS, LEFT, RIGHT, START_LOOP, END_LOOP, INPUT, OUTPUT, PRINT, CREATE_STATE, SET } = require("../preparation/utils/instructions");
const { endLoop } = require("./simulation/instructions/endLoop");
const { left } = require("./simulation/instructions/left");
const { minus } = require("./simulation/instructions/minus");
const { output } = require("./simulation/instructions/output");
const { plus } = require("./simulation/instructions/plus");
const { right } = require("./simulation/instructions/right");
const { UNKNOWN, createState, pushResult } = require("./simulation/simulation_utils");
const { startLoop } = require("./simulation/instructions/startLoop");

function simulate(file) {
    const tape = [];
    const stateStack = [];
    const loops = [];
    const result = [];
    const loopsCompromised = [];

    const State = {
        file, tape, stateStack, loops, result, loopsCompromised,
        positionCompromised: false,
        ptr: 0,
        tapeNotRaw: false,
        i: 0
    };
    for (State.i = 0; State.i < file.length; State.i++) {
        State.token = file[State.i];

        switch (State.token.instr) {
            case PLUS: {
                plus(State);
                break;
            }
            case MINUS: {
                minus(State);
                break;
            }
            case LEFT: {
                left(State);
                break;
            }
            case RIGHT: {
                right(State);
                break;
            }
            case START_LOOP: {
                startLoop(State);
                break;
            }
            case END_LOOP: {
                endLoop(State);
                break;
            }
            case INPUT: {
                // We simply push the current token and indicate that the current value in the tape is unknown.
                // Input can never be handled at compile time, which is why we must always push the input token,
                // and the reason we set the current value to unknown is because it is determined at compile time by the user.
                pushResult(State);
                if (State.ptr !== UNKNOWN)
                    tape[State.ptr] = UNKNOWN;
                break;
            }
            case OUTPUT: {
                output(State);
                break;
            }
            case SET: {
                // If the current position is unknown, the set operation happens at runtime.
                // Treat the tape as entirely fresh.
                if (State.ptr === UNKNOWN) {
                    pushResult(State);
                    break;
                }
                
                tape[State.ptr] = State.token.value || 0;
                State.tapeNotRaw = true;
                break;
            }
            default:
                console.error("INVALID INSTRUCTION: " + file[State.i]);
                process.exit(1);
        }
    }
    // compileProgress();
    // for (let i = 0; i < chunks.length; i++) {
    //     for (let j = 0; j < chunks[i].length; j++) {
    //         result.push(chunks[i][j]);
    //     }
    // }
    // process.exit(1)
    // process.exit(1);
    return result;
}

module.exports = { simulate };