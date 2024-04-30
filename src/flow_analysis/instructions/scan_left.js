const { TODO } = require("../../error/internal_compiler_error");
const { Constant, Register } = require("../../types/value");
const { Unknown, Single, Union } = require("../simulation_types");
const { resetState } = require("../utils/reset_state");


module.exports = (state, { tape, token }) => {
    const tokenValue = token.value.constant();
    if (state.ptr instanceof Unknown) {
        resetState(state);
        return;
    } else if (state.ptr instanceof Union) {
        TODO("Add Union handling.");
    } else if (state.ptr.value instanceof Register) {
        TODO("Add register handling.");
    }
    const ptrData = state.ptr.value.data;
    const initValue = tape.get(ptrData);
    let toLoop = false;
    if (initValue instanceof Unknown) {
        resetState(state);
        return;
    } else if (initValue instanceof Union) {
        if (initValue.data.every(e => e instanceof Constant && e.data > 0n)) {
            toLoop = true;
        } else {
            resetState(state);
            return;
        }
    } else if (initValue instanceof Single) {
        if (initValue.value instanceof Constant) {
            toLoop = initValue.value.data > 0n;
        } else {
            TODO("Add register handling.");
        }
    }
    while (toLoop) {
        toLoop = false;
        if (state.ptr instanceof Unknown) {
            resetState(state);
            return;
        }
        state.ptr = state.ptr.modify(value => {
            if (value instanceof Constant) {
                const out = new Constant(value.data - tokenValue);
                const toCheck = tape.get(value.data - tokenValue);
                if (toCheck instanceof Single) {
                    if (toCheck.value instanceof Register) {
                        TODO("Add register handling.");
                    }
                    if (toCheck.value.data > 0n) {
                        toLoop = true;
                    }
                    return out;
                } else {
                    resetState(state);
                    return new Constant(0n);
                }
            } else {
                TODO("Add register handling.");
            }
        });
    }
};