const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Unknown, Union, Single } = require("../simulation_types");


module.exports = ({ tape, ptr, token }) => {
    const tokenOffset = token.offset;

    token.value.forceMatch();

    if (!(ptr instanceof Unknown)) {
        if (ptr instanceof Union) {
            TODO("Add union handling.");
        } else if (ptr instanceof Single) {
            const ptrData = ptr.value.data;
            tape.set(ptrData + tokenOffset, new Unknown());
        } else {
            compilerError("Invalid ptr value [%o].", ptr);
        }
    } else {
        compilerError("Invalid ptr value [%o].", ptr);
    }
};