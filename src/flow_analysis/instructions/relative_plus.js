const { compilerError, TODO } = require("../../error/internal_compiler_error");
const { Constant, Register } = require("../../types/value");
const { byte } = require("../../utils/toByte");
const { Unknown } = require("../simulation_types");


module.exports = ({ tape, ptr, token }) => {
    const tokenOffset = token.offset;

    token.value.forceMatch(Constant, Constant, Register);
    
    const tokenPlus = token.value.contents[0].data;
    const tokenMult = token.value.contents[1].data;
    const tokenRegisterLocation = token.value.contents[2].data;
    if (ptr instanceof Unknown) {
        compilerError("Invalid ptr value [%o].", ptr);
    }
    ptr.modify(({data: ptrData}) => {
        const tokenRegister = tape.get(ptrData + tokenRegisterLocation);
        if (tokenRegister instanceof Unknown) {
            tape.set(ptrData + tokenOffset, new Unknown());
        }
        tokenRegister.modify(tokenRegisterType => {
            if (tokenRegisterType instanceof Constant) {
                const tokenRegisterValue = tokenRegisterType.data;
                tape.apply(ptrData + tokenOffset, e => e.modify(value => {
                    if (value instanceof Constant) {
                        return new Constant(byte(value.data + (tokenPlus + tokenMult * tokenRegisterValue)));
                    } else {
                        TODO("Add register handling.");
                    }
                }));
            } else if (tokenRegisterType instanceof Register) {
                TODO("Add register handling.");
            }
            return tokenRegisterType;
        });
        return new Constant(ptrData);
    });
};