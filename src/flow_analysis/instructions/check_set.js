const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Constant, Register } = require("../../types/value");
const { byte } = require("../../utils/toByte");
const { Unknown, Single } = require("../simulation_types");


module.exports = ({ tape, ptr, token }) => {
    const tokenOffset = token.offset;

    token.value.forceMatch(Constant, Register, Constant);
    
    const tokenRegisterMod = token.value.contents[0].data;
    const tokenCheckLocation = token.value.contents[1].data;
    const tokenValue = token.value.contents[2].data;
    
    if (ptr instanceof Unknown) {
        compilerError("Invalid ptr value [%o].", ptr);
    }
    ptr.modify(({data: ptrData}) => {
        const tokenCheckRegister = tape.get(ptrData + tokenCheckLocation);
        tokenCheckRegister.modify(tokenCheckRegisterType => {
            if (tokenCheckRegisterType instanceof Constant) {
                const tokenCheckValue = tokenCheckRegisterType.data;
                if (byte(tokenCheckValue + tokenRegisterMod)) {
                    tape.set(ptrData + tokenOffset, new Single(new Constant(byte(tokenValue))));
                }
            } else if (tokenCheckRegisterType instanceof Register) {
                TODO("Add register handling.");
            }
            return tokenCheckRegisterType;
        });
        return new Constant(ptrData);
    });
};