const { PLUS, MINUS, LEFT, RIGHT, START_LOOP, END_LOOP, INPUT, PRINT, SET, CREATE_STATE } = require("../preparation/utils/instructions");

const compressToBytes = new Map(
    [
        PLUS, MINUS,
        SET
    ].map(e => [e, true])
);

const repeatable = new Map(
    [
        PLUS, MINUS,
        LEFT, RIGHT,
        PRINT
    ].map(e => [e, true])
);

// const strRepeatable = new Map(
//     [
//         PRINT
//     ].map(e => [e, true])
// )

const nullable = new Map(
    [
        SET, INPUT,
    ].map(e => [e, true])
);

const opposites = new Map(
    [
        [PLUS, MINUS], [MINUS, PLUS],
        [LEFT, RIGHT], [RIGHT, LEFT],
        [START_LOOP, END_LOOP]/*, [END_LOOP, START_LOOP]*/,
    ]
);
// let c = 0;
function optimize(file) {
    // if (file.length <= 3)
    //     return file;
    // c++;
    let result;
    let repeatOptimizations = true;

    while (repeatOptimizations) {
        result = [];
        repeatOptimizations = false;
        for (let i = 0; i < file.length; i++) {
            if (file[i].instr == START_LOOP && file.length > i + 2 && (file[i + 1].instr == MINUS || file[i + 1].instr == PLUS) && file[i + 2].instr == END_LOOP) {
                result.push({ instr: SET, value: 0 });
                i += 2;
                repeatOptimizations = true;
                continue;
            }
            if (file[i].instr == CREATE_STATE && file[i + 1] && file[i + 1].instr == CREATE_STATE) {
                // console.log(file[i]);
                const keys = Object.keys(file[i].value.tape);
                keys.forEach(key => {
                    if (!file[i + 1].value.tape[key])
                        file[i + 1].value.tape[key] = key;
                });
                continue;
            }
            if (file.length > i + 1 && nullable.get(file[i].instr) && nullable.get(file[i + 1].instr)) {
                if (!file[i + 1].instr) {
                    console.error("Next option has no instruction? Aborting...");
                    process.exit(1);
                }
                result.push({ instr: file[i + 1].instr, value: file[i + 1].value });
                i++;
                repeatOptimizations = true;
                continue;
            }
            if (file.length > i + 1 && file[i].instr == SET && (file[i + 1].instr == PLUS || file[i + 1].instr == MINUS)) {
                if (file[i + 1].instr == PLUS)
                    file[i].value += file[i + 1].value || 1;
                else
                    file[i].value -= file[i + 1].value || 1;
                result.push(file[i]);
                i++;
                repeatOptimizations = true;
                continue;
            }
            if (file.length > i + 1 && file[i + 1].instr == file[i].instr && repeatable.get(file[i].instr)) {
                let num = file[i].value || 1;
                for (; file.length > i + 1 && file[i + 1].instr == file[i].instr; i++)
                    num += file[i + 1].value || 1;
                result.push({ instr: file[i].instr, value: num });
                repeatOptimizations = true;
                continue;
            }
            if (file.length > i + 1 && opposites.get(file[i].instr) == file[i + 1].instr) {
                file[i].value ||= 1;
                file[i + 1].value ||= 1;
                if (file[i].value == file[i + 1].value) {
                    i++;
                    repeatOptimizations = true;
                    continue;
                }
                if (file[i].value > file[i + 1].value) {
                    result.push({ instr: file[i].instr, value: file[i].value - file[i + 1].value });
                    i++;
                    repeatOptimizations = true;
                    continue;
                }
                result.push({ instr: file[i + 1].value, value: file[i + 1].value - file[i].value });
                i++;
                repeatOptimizations = true;
                continue;
            }
            result.push({ instr: file[i].instr, value: file[i].value });
        }
        result.forEach(token => {
            if (!compressToBytes.get(token.instr))
                return;
            while (token.value < 0)
                token.value += 256;
            token.value %= 256;
        });
        file = result;
    }
    return file;
}

module.exports = { optimize };