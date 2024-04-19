const { PLUS, MINUS, START_LOOP, END_LOOP, SET } = require("./types/instructions");
const { Relations } = require("./types/relations");
const { Rules } = require("./types/rules");
const { Instruction } = require("./types/token");
const { Value } = require("./types/value");

function tokenCleanup(tokens) {
    let result;
    let repeatOptimizations = true;

    while (repeatOptimizations) {
        result = [];
        repeatOptimizations = false;
        for (let i = 0; i < tokens.length; i++) {

            // Turn instances of "[-]" into a set operation.
            if (tokens[i].instr == START_LOOP && tokens.length > i + 2 && (tokens[i + 1].instr == MINUS || tokens[i + 1].instr == PLUS) && tokens[i + 2].instr == END_LOOP) {
                result.push(new Instruction(SET, 0, 0, tokens[i].line, tokens[i].char));
                i += 2;
                repeatOptimizations = true;
                continue;
            }

            // Setting to zero after a loop is unneeded because it is already guaranteed to be at position zero.
            if (i && tokens[i - 1].instr == END_LOOP && tokens[i].instr == SET && tokens[i].value.isConstant(0) && tokens[i].offset == 0) {
                continue;
            }

            // When two nullable operations (the second instruction cancels the first instruction) are next to each other, skip the first operation.
            if (tokens.length > i + 1 && tokens[i].offset == tokens[i + 1].offset && tokens[i].is(Rules.Nullable) && tokens[i + 1].is(Rules.Nullable)) {
                repeatOptimizations = true;
                continue;
            }

            // If a set operation is followed by addition or subtraction, we can compress this back into just a set.
            if (tokens.length > i + 1 && tokens[i].offset == tokens[i + 1].offset && tokens[i].instr == SET && (tokens[i + 1].instr == PLUS || tokens[i + 1].instr == MINUS)) {
                if (tokens[i + 1].instr == PLUS) {
                    tokens[i].value.constant += tokens[i + 1].value.constant;
                } else {
                    tokens[i].value.constant -= tokens[i + 1].value.constant;
                }
                result.push(tokens[i]);
                i++;
                repeatOptimizations = true;
                continue;
            }
            
            // If the current operation is repeatable (Eg, "PLUS(3), PLUS(1)" => "PLUS(4)"), then gather all of the operations and fold them together.
            if (tokens.length > i + 1 && tokens[i].offset == tokens[i + 1].offset && tokens[i + 1].instr == tokens[i].instr && tokens[i].is(Rules.Repeatable)) {
                let num = tokens[i].value.constant;
                for (; tokens.length > i + 1 && tokens[i + 1].instr == tokens[i].instr; i++)
                    num += tokens[i + 1].value.constant;
                result.push(new Instruction(tokens[i].instr, new Value(num, []), tokens[i].offset, tokens[i].line, tokens[i].char));
                repeatOptimizations = true;
                continue;
            }

            // Cancel out opposite instructions (Eg, "PLUS(4), MINUS(3)" => "PLUS(1)").
            if (tokens.length > i + 1 && tokens[i].offset == tokens[i + 1].offset && tokens[i].is(Relations.Opposites(tokens[i].instr)) == tokens[i + 1].instr) {
                if (tokens[i].value.equals(tokens[i + 1])) {
                    i++;
                    repeatOptimizations = true;
                    continue;
                }
                if (tokens[i].value.constant > tokens[i + 1].value.constant) {
                    result.push(new Instruction(tokens[i].instr, new Value(tokens[i].value.constant - tokens[i + 1].value.constant, []), tokens[i].offset, tokens[i].line, tokens[i].char));
                    i++;
                    repeatOptimizations = true;
                    continue;
                }
                result.push(new Instruction(tokens[i + 1].instr, new Value(tokens[i + 1].value.constant - tokens[i].value.constant, []), tokens[i].offset, tokens[i].line, tokens[i].char));
                i++;
                repeatOptimizations = true;
                continue;
            }

            // If no optimizations can be made, push the operation as normal.
            result.push(tokens[i]);
        }
        
        // Compress values to bytes. Eg, -1 => 255.
        result.forEach(token => {
            if (!token.is(Rules.CompressToBytes)) {
                return;
            }
            // if (!token.value && (token.instr != SET)) {
            //     token.value = 1;
            // }
            while (token.value.constant < 0) {
                token.value.constant += 256;
            }
            token.value.constant %= 256;
        });
        tokens = result;
    }
    return tokens;
}

module.exports = { tokenCleanup };