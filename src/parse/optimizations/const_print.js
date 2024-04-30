const { Single } = require("../../flow_analysis/simulation_types");
const { OUTPUT, CONST_PRINT } = require("../../types/instructions");
const { Instruction } = require("../../types/token");
const { Value, Register, StringConstant } = require("../../types/value");
const { byte } = require("../../utils/toByte");


module.exports = (state, { tokens, i }) => {
    // If the current operation is a print, we check if the value is static at compile-time. If so, we don't need the register.
    if (tokens[i].instr == OUTPUT) {
        tokens[i].value.forceMatch();
        const tokenState = tokens[i].state;
        if (!tokenState) {
            return false;
        }
        if (!(tokenState.ptr instanceof Single)) {
            return false;
        }
        const ptrType = tokenState.ptr.value;
        let ptrData;
        if (ptrType instanceof Register) {
            if (tokenState.tape.get(ptrType.data) instanceof Single) {
                ptrData = tokenState.tape.get(ptrType.data).data;
            } else {
                return false;
            }
        } else {
            ptrData = ptrType.data;
        }
        const tokenRegisterData = tokens[i].offset;
        ptrData += tokenRegisterData;
        if (!(tokenState.tape.get(ptrData) instanceof Single)) {
            return false;
        }
        const registerType = tokenState.tape.get(ptrData).value;
        let registerData;
        if (registerType instanceof Register) {
            if (tokenState.tape.get(registerType.data) instanceof Single) {
                registerData = tokenState.tape.get(registerType.data).data;
            } else {
                return false;
            }
        } else {
            registerData = registerType.data;
        }

        state.result.push(new Instruction(CONST_PRINT, new Value(new StringConstant(String.fromCharCode(Number(byte(registerData))))), 0n, tokens[i].line, tokens[i].char));
        state.repeatOptimizations = true;
        return true;
    }
};