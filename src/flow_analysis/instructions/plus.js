const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Constant } = require("../../types/value");
const { byte } = require("../../utils/toByte");
const { Unknown } = require("../simulation_types");


module.exports = ({ tape, ptr, token }) => {
    const tokenOffset = token.offset;
    const tokenValue = token.value.constant();
    if (ptr instanceof Unknown) {
        compilerError("Invalid ptr value [%o].", ptr);
    }
    ptr.modify(({data: ptrData}) => {
        tape.apply(ptrData + tokenOffset, e => e.modify(value => {
            if (value instanceof Constant) {
                return new Constant(byte(value.data + tokenValue));
            } else {
                TODO("Add register handling.");
            }
        }));
        return new Constant(ptrData);
    });
};