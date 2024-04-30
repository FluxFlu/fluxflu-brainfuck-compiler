const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { logError } = require("../../error/log_error");
const { Constant } = require("../../types/value");
const { Unknown } = require("../simulation_types");


module.exports = (state, { ptr, token, tape }) => {
    const tokenValue = token.value.constant();
    if (!(ptr instanceof Unknown)) {
        
        state.ptr = ptr.modify(value => {
            if (value instanceof Constant) {
                if (value.data - tokenValue < 0n) {
                    if (state.positionCompromised) {
                        return new Constant(tape.uptick(0n));
                    } else {
                        logError("tape_overflow");
                    }
                }
                return new Constant(value.data - tokenValue);
            } else {
                TODO("Add register handling.");
            }
        });
    } else {
        compilerError("Invalid ptr value [%o].", ptr);
    }
};