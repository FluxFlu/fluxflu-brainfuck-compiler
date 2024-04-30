const { logError } = require("../error/log_error");
const { LEFT, RIGHT, RELATIVE_SET, RELATIVE_PLUS, RELATIVE_MINUS, PLUS, MINUS, SET } = require("../types/instructions");
const { Rules } = require("../types/rules");
const { Value, Constant } = require("../types/value");
const { getFilename } = require("../utils/compiler_flags");
const { byte } = require("../utils/toByte");

function simplifySetup(file) {
    const offsets = [];
    let ptr = 0n;
    for (let i = 0; i < file.length; i++) {
        if (file[i].is(Rules.InterruptOffset())) {
            return file;
        }
        if (file[i].instr == RIGHT) {
            ptr += file[i].value.constant();
            continue;
        } else if (file[i].instr == LEFT) {
            ptr -= file[i].value.constant();
            if (ptr < 0n) {
                logError("tape_underflow", file[i], getFilename());
            }
            continue;
        }

        if ([RELATIVE_PLUS, RELATIVE_MINUS, RELATIVE_SET].includes(file[i].instr)) {
            if (file[i].instr == RELATIVE_MINUS && !offsets[file[i].offset + ptr]) {
                file[i].value.contents[1].data = byte(-file[i].value.contents[1].data);
            }

            if (!offsets[file[i].value.contents[2].data + ptr]) {
                const plus = file[i].value.contents[0].data;
                const targetInstr = offsets[file[i].offset + ptr] ? file[i].is(Rules.RegisterType()).get() : SET;
                file[i].instr = targetInstr;
                file[i].value = new Value(new Constant(byte(plus)));
            } else if (!offsets[file[i].offset + ptr]) {
                file[i].instr = RELATIVE_SET;
            }
            offsets[file[i].offset + ptr] = true;
        } else if ([PLUS, MINUS].includes(file[i].instr) && !offsets[file[i].offset + ptr]) {
            if (file[i].instr == MINUS) {
                file[i].value.contents[0].data = byte(-file[i].value.constant());
            }

            file[i].instr = SET;
            offsets[file[i].offset + ptr] = true;
        } else if (file[i].instr == SET && file[i].value.constant() === 0n && !offsets[file[i].offset + ptr]) {
            file.splice(i, 1);
            i--;
        } else {
            offsets[file[i].offset + ptr] = true;
        }
    }
    return file;
}

module.exports = { simplifySetup };