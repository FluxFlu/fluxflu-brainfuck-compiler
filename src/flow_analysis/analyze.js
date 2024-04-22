const { compilerError } = require("../error/internal_compiler_error");
const { PLUS, RIGHT, WHILE, MINUS, END } = require("../types/instructions");
const { Constant } = require("../types/value");
const { Single } = require("./simulation_utils");

const instructions = new Map([
    [PLUS, require("./instructions/plus")],
    [MINUS, require("./instructions/minus")],

    [RIGHT, require("./instructions/right")],

    [END, () => {}],
    [WHILE, require("./instructions/while")],
]);

function analyze(file, state, ctxMaybe) {
    // const stateStack = [];
    // const loops = [];
    // const loopsCompromised = [];

    state ||= {
        file, tape: [new Single(new Constant(0n))],// stateStack, loops, loopsCompromised,
        //positionCompromised: false,
        ptr: new Single(new Constant(0n)),
        //tapeNotRaw: false,
        // index: 0,
        analyze,
    };
    state.ctxMaybe = ctxMaybe;
    const copyState = () => {
        return {
            tape: [...state.tape],
            ptr: state.ptr,
        }
    }
    for (let i = 0; i < file.length; i++) {
        state.token = file[i];
        state.token.state = copyState();

        const fn = instructions.get(state.token.instr);
        if (!fn) {
            compilerError("Unable to analyze instruction [%s].", state.token.toString());
        }

        const args = state;
        args.args = args;
        fn(state, args);
    }
    return file;
}

module.exports = { analyze };