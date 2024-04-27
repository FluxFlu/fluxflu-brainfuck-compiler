const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Container, Instruction } = require("../../types/token");
const { Constant, Register } = require("../../types/value");
const { Unknown, Union, Single } = require("../simulation_types");
const { resetState } = require("../utils/reset_state");

module.exports = function (state) {
    for (;;) {
        const { tape, ptr, token, analyze } = state;
        if (ptr instanceof Union) {
            TODO("Implement Union PTR for While.");
        } else if (ptr instanceof Single) {
            const ptrType = ptr.value;
            if (ptrType instanceof Constant) {
                const ptrData = ptrType.data;
                const value = tape.get(ptrData);
                if (value instanceof Unknown) {
                    const deleteState = token => {
                        if (token instanceof Container) {
                            delete token.state;
                            token.contents.forEach(deleteState);
                        } else if (token instanceof Instruction) {
                            delete token.state;
                        }
                        return token;
                    };
                    deleteState(token);
                    resetState(state);
                    return;
                } else if (value instanceof Union) {
                    TODO("Implement Union for While Single.");
                } else if (value instanceof Single) {
                    const valueType = value.value;
                    if (valueType instanceof Constant) {
                        const valueData = valueType.data;
                        if (valueData) {
                            analyze(token.contents, state);
                            state.token = token;
                            continue;
                        } else {
                            return;
                        }
                    } else if (valueType instanceof Register) {
                        TODO("Implement register for While.");
                    } else {
                        compilerError("Invalid valueType [%o].", valueType);
                    }
                } else {
                    compilerError("Invalid value [%o].", value);
                }
            } else if (ptrType instanceof Register) {
                TODO("Implement register for While.");
            } else {
                compilerError("Invalid ptrType [%o].", ptrType);
            }
        } else {
            compilerError("Invalid ptr type of ptr [%o].", ptr);
        }
    }
};