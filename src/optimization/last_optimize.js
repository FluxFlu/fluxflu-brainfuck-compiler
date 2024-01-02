const { LEFT, RIGHT, END_LOOP, START_LOOP, INPUT, OUTPUT, PRINT, MINUS, MULT_ASSIGN } = require("../preparation/utils/instructions");

function lastOptimize(file) {
    const result = [];
    for (let i = 0; i < file.length; i++) {
        if (file[i].instr == START_LOOP) {
            let totalMovement = 0;
            let zeroMod;
            const instrList = [];
            let j;
            for (j = i + 1; j < file.length; j++) {
                if ([START_LOOP, INPUT, OUTPUT, PRINT].includes(file[j].instr)) {
                    totalMovement = null;
                    break;
                }
                if (file[j].instr == END_LOOP) {
                    break;
                }

                if (file[j].instr == RIGHT) {
                    totalMovement += file[j].value;
                    continue;
                }
                if (file[j].instr == LEFT) {
                    totalMovement -= file[j].value;
                    continue;
                }
                if (file[j].offset === 0)
                    zeroMod = file[j];
                else
                    instrList.push(file[j]);
            }
            if (zeroMod?.instr == MINUS && zeroMod.value == 1 && totalMovement === 0) {
                instrList.push(zeroMod);
                for (let f = 0; f < instrList.length; f++) {
                    if (instrList[f]) {
                        result.push({ instr: MULT_ASSIGN, value: instrList[f], offset: instrList[f] } );
                    }
                }
                i = j;
            } else {
                result.push(file[i]);
            }
            continue;
        }
        result.push(file[i]);
    }
    return result;
}

module.exports = { lastOptimize };