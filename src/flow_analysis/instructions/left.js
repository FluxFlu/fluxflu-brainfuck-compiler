const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Constant } = require("../../types/value");
const { Unknown } = require("../simulation_types");
const { resetState } = require("../utils/reset_state");


module.exports = (state, { ptr, token }) => {
    const tokenValue = token.value.constant();
    if (!(ptr instanceof Unknown)) {
        
        state.ptr = ptr.modify(value => {
            if (value instanceof Constant) {
                if (tokenValue > value.data && state.positionCompromised) {
                    resetState(state);
                    return new Constant(0n);
                } else {
                    return new Constant(tokenValue >= value.data ? 0n : value.data - tokenValue);
                }
            } else {
                TODO("Add register handling.");
            }
        });
    } else {
        compilerError("Invalid ptr value [%o].", ptr);
    }
};