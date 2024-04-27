const { compilerError } = require("../error/internal_compiler_error");
const { PLUS, RIGHT, WHILE, MINUS, END, LEFT, OUTPUT, INPUT, SET, RELATIVE_PLUS, RELATIVE_MINUS, CHECK_SET, IF, RELATIVE_SET } = require("../types/instructions");
const { Constant } = require("../types/value");
const { Single, Unknown, Union } = require("./simulation_types");
const { Tape } = require("./utils/tape");

const instructions = new Map([
    [PLUS, require("./instructions/plus")],
    [MINUS, require("./instructions/minus")],
    [LEFT, require("./instructions/left")],
    [RIGHT, require("./instructions/right")],
    [INPUT, require("./instructions/input")],
    [OUTPUT, () => { }],

    [SET, require("./instructions/set")],

    [RELATIVE_PLUS, require("./instructions/relative_plus")],
    [RELATIVE_MINUS, require("./instructions/relative_minus")],
    [RELATIVE_SET, require("./instructions/relative_set")],
    [CHECK_SET, require("./instructions/check_set")],


    [END, () => { }],
    [WHILE, require("./instructions/while")],
    [IF, require("./instructions/if")],
]);

function analyze(file, state) {

    state ||= {
        file,
        tape: undefined,
        positionCompromised: false,
        ptr: new Single(new Constant(0n)),
        iteration: 0,
        analyze,
    };

    state.tape ||= new Tape(state, [new Single(new Constant(0n))]);

    const copyState = () => {
        const out = {
            tape: undefined,
            ptr: state.ptr,
            positionCompromised: state.positionCompromised,
            iteration: state.iteration,
        };
        out.tape = new Tape(out, [...state.tape.arr]);
        return out;
    };
    for (let i = 0; i < file.length; i++) {
        state.token = file[i];
        if (!file[i].state || file[i].state < state.iteration) {
            file[i].state = copyState();
        } else {
            const tokenState = file[i].state;
            const state = copyState();
            tokenState.tape.forEach((value, index) => {
                index = BigInt(index);
                tokenState.ptr.modify(({data: ptrData}) => {
                    const stateIndex = index + (state.ptr.value.data - ptrData);
                    if (!value) {
                        return new Constant(ptrData);
                    } else {
                        if (state.tape.get(stateIndex) instanceof Unknown) {
                            tokenState.tape.set(index, state.tape.get(stateIndex));
                        } else if (state.tape.get(stateIndex) instanceof Union) {
                            state.tape.get(stateIndex).value.forEach(value => {
                                tokenState.tape.apply(index, e => e.add(() => value));
                            });
                        } else if (state.tape.get(stateIndex) instanceof Single) {
                            tokenState.tape.apply(index, e => e.add(() => state.tape.get(stateIndex).value));
                        } else {
                            // Do nothing.
                            return new Constant(ptrData);
                        }
                        return new Constant(ptrData);
                    }
                });
            });
            if (state.ptr instanceof Unknown) {
                tokenState.ptr = state.ptr;
            } else if (state.ptr instanceof Union) {
                state.ptr.values.forEach(value => {
                    tokenState.ptr = tokenState.ptr.add(() => value);
                });
            } else if (state.ptr instanceof Single) {
                tokenState.ptr = tokenState.ptr.add(() => state.ptr.value);
            }
        }

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