const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Constant, Register } = require("../../types/value");
const { Unknown, Union, Single } = require("../simulation_utils");


module.exports = function While (state, { tape, ptr, token, analyze, args, ctxMaybe }) {
    if (ptr instanceof Union) {
        TODO("Implement Union PTR for While.");
    } else if (ptr instanceof Single) {
        const ptrType = ptr.value;
        if (ptrType instanceof Constant) {
            const ptrData = ptrType.data;
            console.log(ptrData);
            const value = tape[ptrData];
            if (value instanceof Unknown) {
                TODO("Implement Unknown for While Single.");
            } else if (value instanceof Union) {
                TODO("Implement Union for While Single.");
            } else if (value instanceof Single) {
                const valueType = value.value;
                if (valueType instanceof Constant) {
                    const valueData = valueType.data;
                    // if (!valueData) {
                    //     return;
                    // }
                    console.log(state.tape);
                    if (valueData) {
                        analyze(token.contents, state, true);
                        state.token = token;
                        state.ctxMaybe = ctxMaybe;
                        While(state, args);
                    }
                    console.log(token.contents.map(e => e.state));
                    // console.log(valueData, token.contents.map(e => e.state.tape));
                    // While(state, args);
                    process.exit(50);
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
    console.log(token);
    process.exit(90);
}