const { PLUS, MINUS, LEFT, RIGHT, START_LOOP, END_LOOP, INPUT, PRINT, SET, OUTPUT } = require("../preparation/utils/instructions");

// These operations need their values compressed. Eg, -1 => 255.
const compressToBytes = new Map(
    [
        PLUS, MINUS,
        SET
    ].map(e => [e, true])
);

// These operations can be repeated and have linearly increasing effects. Eg, "++++" can be compressed to "+4".
const repeatable = new Map(
    [
        PLUS, MINUS,
        LEFT, RIGHT,
        PRINT
    ].map(e => [e, true])
);


// When two of these operations are next to each other, the second nullifies the first. Eg, "[-]++++[-]" can by optimized to "[-]".
const nullable = new Map(
    [
        SET, INPUT,
    ].map(e => [e, true])
);

// These operations, when next to each other, cancel each other out. Eg, "++++---" can be optimized to "+".
const opposites = new Map(
    [
        [PLUS, MINUS], [MINUS, PLUS],
        [LEFT, RIGHT], [RIGHT, LEFT],
        [START_LOOP, END_LOOP],
    ]
);

function optimize(file) {
    let result;
    let repeatOptimizations = true;

    while (repeatOptimizations) {
        result = [];
        repeatOptimizations = false;
        for (let i = 0; i < file.length; i++) {

            // Turn instances of "[-]" into a set operation.
            if (file[i].instr == START_LOOP && file.length > i + 2 && (file[i + 1].instr == MINUS || file[i + 1].instr == PLUS) && file[i + 2].instr == END_LOOP) {
                result.push({ instr: SET, value: 0, offset: file[i + 1].offset, line: file[i].line, char: file[i].char });
                i += 2;
                repeatOptimizations = true;
                continue;
            }

            // Setting to zero after a loop is unneeded because it is already guaranteed to be at position zero.
            if (i && file[i - 1].instr == END_LOOP && file[i].instr == SET && file[i].value == 0 && file[i].offset == 0)
                continue;

            // When two nullable operations (second cancels first) are next to each other, skip the first operation.
            if (file.length > i + 1 && file[i].offset == file[i + 1].offset && nullable.get(file[i].instr) && nullable.get(file[i + 1].instr)) {
                repeatOptimizations = true;
                continue;
            }

            // If a set operation is followed by addition or subtraction, we can compress this back into just a set.
            if (file.length > i + 1 && file[i].offset == file[i + 1].offset && file[i].instr == SET && (file[i + 1].instr == PLUS || file[i + 1].instr == MINUS)) {
                if (file[i + 1].instr == PLUS)
                    file[i].value += file[i + 1].value || 1;
                else
                    file[i].value -= file[i + 1].value || 1;
                result.push(file[i]);
                i++;
                repeatOptimizations = true;
                continue;
            }
            
            // If the current operation is repeatable (Eg, "++++" => "+4"), then gather all of the operations and fold them together.
            if (file.length > i + 1 && file[i].offset == file[i + 1].offset && file[i + 1].instr == file[i].instr && repeatable.get(file[i].instr)) {
                let num = file[i].value || 1;
                for (; file.length > i + 1 && file[i + 1].instr == file[i].instr; i++)
                    num += file[i + 1].value || 1;
                result.push({ instr: file[i].instr, value: num, offset: file[i].offset, line: file[i].line, char: file[i].char });
                repeatOptimizations = true;
                continue;
            }

            // Cancel out opposite instructions (Eg, "++++---" => "+") in a way that handles folds (Eg, "+4-3" => "+1") properly.
            if (file.length > i + 1 && file[i].offset == file[i + 1].offset && opposites.get(file[i].instr) == file[i + 1].instr) {
                if (!file[i].value)
                    file[i].value = 1;
                if (!file[i + 1].value)
                    file[i + 1].value = 1;
                if (file[i].value == file[i + 1].value) {
                    i++;
                    repeatOptimizations = true;
                    continue;
                }
                if (file[i].value > file[i + 1].value) {
                    result.push({ instr: file[i].instr, value: file[i].value - file[i + 1].value, offset: file[i].offset, line: file[i].line, char: file[i].char });
                    i++;
                    repeatOptimizations = true;
                    continue;
                }
                result.push({ instr: file[i + 1].instr, value: file[i + 1].value - file[i].value, offset: file[i].offset, line: file[i].line, char: file[i].char });
                i++;
                repeatOptimizations = true;
                continue;
            }

            // If no optimizations can be made, push the operation as normal.
            result.push({ instr: file[i].instr, value: file[i].value, offset: file[i].offset, line: file[i].line, char: file[i].char });
        }
        
        // Compress values to bytes. Eg, -1 => 255.
        result.forEach(token => {
            if (!compressToBytes.get(token.instr))
                return;
            if (!token.value && (token.instr != SET))
                token.value = 1;
            while (token.value < 0)
                token.value += 256;
            token.value %= 256;
        });
        file = result;
    }
    return file;
}

module.exports = { optimize };