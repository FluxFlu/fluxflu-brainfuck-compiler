const { Instruction } = require("../types/token");
const { PLUS, MINUS, LEFT, RIGHT, START_LOOP, END_LOOP, INPUT, OUTPUT } = require("../types/instructions");
const { Value, Constant } = require("../types/value");

const operators = new Map([
    ["+", PLUS],
    ["-", MINUS],
    ["<", LEFT],
    [">", RIGHT],
    ["[", START_LOOP],
    ["]", END_LOOP],
    [",", INPUT],
    [".", OUTPUT],

    // TODO: Add debugging. Perhaps with custom characters.
    // ["#", DEBUG],
]);

function tokenize(file) {
    file = file
        .replaceAll("\t",   "    ")
        .replaceAll("\r\n", "\n")
        .replaceAll("\n\r", "\n")
        .replaceAll("\r",   "\n");
    const tokens = [];
    let line = 0;
    let char = 0;
    for (let i = 0; i < file.length; i++) {
        if (file[i] == "\n") {
            line++;
            char = 0;
            continue;
        }

        if (!operators.has(file[i])) {
            char++;
            continue;
        }
        if (",.[]".includes(file[i])) {
            tokens.push(new Instruction(operators.get(file[i]), new Value(                ), 0n, line, char));
        } else {
            tokens.push(new Instruction(operators.get(file[i]), new Value(new Constant(1n)), 0n, line, char));
        }
        char++;
    }
    return tokens;
}

module.exports = { tokenize };