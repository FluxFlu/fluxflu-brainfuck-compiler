const { compilerError } = require("../error/internal_compiler_error");
const { SET, RELATIVE_SET, PLUS, CHECK_SET, MINUS } = require("../types/instructions");
const { Rules } = require("../types/rules");
const { Container } = require("../types/token");
const { Constant, Register } = require("../types/value");
const { byte } = require("../utils/toByte");

function hasMovement(token, offset) {
    if (token instanceof Container) {
        return token.contents.some(e => hasMovement(e, offset));
    } else {
        return (
            token.is(Rules.Moves())
            || [SET, CHECK_SET, RELATIVE_SET].includes(token.instr) && token.offset == offset
        );
    }
}

function delayModify(file) {
    for (let i = 0; i < file.length; i++) {
        if (i && (file[i].instr == SET || file[i].instr == RELATIVE_SET)) {
            const register = file[i].offset;
            const instructions = [];
            while (i && !hasMovement(file[i - 1], register)) {
                i--;
                const token = file.splice(i, 1)[0];
                instructions.unshift(token);
            }
            const withRegister = instructions.filter(e => (e.offset == register || e.value && e.value.contents.some(e => e instanceof Register && e.data == register)));
            withRegister.forEach((token, index) => {
                if ([
                    PLUS, MINUS
                ].includes(token.instr)) {
                    const remaining = withRegister.slice(index + 1).filter(e => e.value.contents.some(e => e instanceof Register && e.data == register));
                    if (remaining.length) {
                        instructions.splice(instructions.indexOf(token), 1);
                    }
                    remaining.forEach(toModify => {
                        
                        if (!(toModify.value.match(Constant, Constant, Register) || toModify.value.match(Constant, Register, Constant))) {
                            compilerError("Invalid register instruction [%o].", toModify);
                        }

                        switch (token.instr) {
                            case PLUS: {
                                if (toModify.value.match(Constant, Constant, Register)) {
                                    toModify.value.contents[0].data += toModify.value.contents[1].data * token.value.contents[0].data;
                                } else {
                                    toModify.value.contents[0].data += token.value.contents[0].data;
                                }
                                toModify.value.contents[0].data = byte(toModify.value.contents[0].data);
                            } break;
                            case MINUS: {
                                if (toModify.value.match(Constant, Constant, Register)) {
                                    toModify.value.contents[0].data -= toModify.value.contents[1].data * token.value.contents[0].data;
                                } else {
                                    toModify.value.contents[0].data -= token.value.contents[0].data;
                                }
                                toModify.value.contents[0].data = byte(toModify.value.contents[0].data);
                            } break;
                            default: {
                                compilerError("Invalid delay_modify instruction on token [%o].", token.toString());
                            } break;
                        }
                    });
                }
            });
            instructions.forEach(token => {
                file.splice(i, 0, token);
                i++;
            });
            continue;
        } else if (file[i] instanceof Container) {
            file[i].pass(delayModify);
        }
    }
    return file;
}

module.exports = { delayModify };