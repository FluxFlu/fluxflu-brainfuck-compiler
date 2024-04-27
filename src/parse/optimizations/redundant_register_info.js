const { Single } = require("../../flow_analysis/simulation_types");
const { Rules } = require("../../types/rules");
const { Instruction } = require("../../types/token");
const { Constant, Value, Register } = require("../../types/value");
const { byte } = require("../../utils/toByte");


module.exports = (state, { tokens, i }) => {
    // If the current operation is a register type, we check if the register is static at compile-time. If so, we don't need the register.
    if (tokens[i].is(Rules.RegisterType())) {
        tokens[i].value.forceMatch(Constant, Constant, Register);
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
        const tokenRegisterData = tokens[i].value.contents[2].data;
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
        const plus = tokens[i].value.contents[0].data;
        const mult = tokens[i].value.contents[1].data;
        const targetInstr = tokens[i].is(Rules.RegisterType()).get();

        state.result.push(new Instruction(targetInstr, new Value(new Constant(byte(plus + mult * registerData))), tokens[i].offset, tokens[i].line, tokens[i].char));
        state.repeatOptimizations = true;
        return true;
    }
};