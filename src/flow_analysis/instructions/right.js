const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Constant } = require("../../types/value");
const { Unknown, Union, Single } = require("../simulation_utils");


module.exports = (state, { tape, ptr, token, ctxMaybe }) => {
    const tokenValue = token.value.constant();
    if (!(ptr instanceof Unknown)) {
        
        const fn = e => ctxMaybe ? ptr.add(e) : ptr.modify(e);

        state.ptr = fn(value => {
            if (value instanceof Constant) {
                return new Constant(value.data + tokenValue);
            } else {
                TODO("Add register handling.");
            }
        });
    } else {
        compilerError("Invalid ptr value [%o].", ptr);
    }
}