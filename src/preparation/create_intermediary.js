const { logError } = require("../error/log_error");
const { PLUS, MINUS, LEFT, RIGHT, START_LOOP, END_LOOP, INPUT, OUTPUT } = require("./utils/instructions");

const convertList = {
    "+": PLUS,
    "-": MINUS,
    "<": LEFT,
    ">": RIGHT,
    "[": START_LOOP,
    "]": END_LOOP,
    ",": INPUT,
    ".": OUTPUT,
};

function createIntermediary(file) {
    return file.map(e => {
        if (!convertList[e.value]) {
            logError("generic", "ERROR: Somehow an invalid char was parsed, ascii(" + e.value.charCodeAt(0) + ").");
            return null;
        }
        return { instr: convertList[e.value], line: e.line, char: e.char };
    });
}

module.exports = { createIntermediary };