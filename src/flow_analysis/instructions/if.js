const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Constant, Register } = require("../../types/value");
const { Unknown, Union, Single } = require("../simulation_types");
const { resetState } = require("../utils/reset_state");

module.exports = function (state) {
    const { tape, ptr, token, analyze } = state;
    if (ptr instanceof Union) {
        TODO("Implement Union PTR for If.");
    } else if (ptr instanceof Single) {
        const ptrType = ptr.value;
        if (ptrType instanceof Constant) {
            const ptrData = ptrType.data;
            const value = tape.get(ptrData);
            if (value instanceof Unknown) {
                // TODO: Add more in-depth analysis of this.
                resetState(state);
                return;
            } else if (value instanceof Union) {
                TODO("Implement Union for If Single.");
            } else if (value instanceof Single) {
                const valueType = value.value;
                if (valueType instanceof Constant) {
                    const valueData = valueType.data;
                    if (valueData) {
                        analyze(token.contents, state);
                        state.token = token;
                        return;
                    } else {
                        return;
                    }
                } else if (valueType instanceof Register) {
                    TODO("Implement register for If.");
                } else {
                    compilerError("Invalid valueType [%o].", valueType);
                }
            } else {
                compilerError("Invalid value [%o].", value);
            }
        } else if (ptrType instanceof Register) {
            TODO("Implement register for If.");
        } else {
            compilerError("Invalid ptrType [%o].", ptrType);
        }
    } else {
        compilerError("Invalid ptr type of ptr [%o].", ptr);
    }
};