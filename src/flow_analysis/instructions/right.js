const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Constant } = require("../../types/value");
const { Unknown } = require("../simulation_types");


module.exports = (state, { ptr, token }) => {
    const tokenValue = token.value.constant();
    if (!(ptr instanceof Unknown)) {
        
        state.ptr = ptr.modify(value => {
            if (value instanceof Constant) {
                return new Constant(value.data + tokenValue);
            } else {
                TODO("Add register handling.");
            }
        });
    } else {
        compilerError("Invalid ptr value [%o].", ptr);
    }
};