const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Constant } = require("../../types/value");
const { Unknown, Union, Single } = require("../simulation_utils");


module.exports = (state, { tape, ptr, token, ctxMaybe }) => {
    const tokenOffset = token.offset;
    const tokenValue = token.value.constant();
    if (!(ptr instanceof Unknown)) {
        if (ptr instanceof Union) {
            TODO("Add union handling.");
        } else if (ptr instanceof Single) {
            const ptrData = ptr.value.data;
            tape[ptrData + tokenOffset] ||= new Single(new Constant(0n));
            
            const fn = e => ctxMaybe ? tape[ptrData + tokenOffset].add(e) : tape[ptrData + tokenOffset].modify(e);
            
            tape[ptrData + tokenOffset] = fn(value => {
                if (value instanceof Constant) {
                    return new Constant(value.data - tokenValue);
                } else {
                    TODO("Add register handling.");
                }
            });
        } else {
            compilerError("Invalid ptr value [%o].", ptr);
        }
    } else {
        compilerError("Invalid ptr value [%o].", ptr);
    }
}