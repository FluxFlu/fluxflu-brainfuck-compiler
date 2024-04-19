const { compilerError } = require("../../error/internal_compiler_error");
const { Value } = require("./value");


class Token {
    constructor(instr, offset, line, char) {
        this.instr = instr;
        this.offset = offset;
        this.line = line;
        this.char = char;
    }
    is(rule) {
        if (rule._tag == "Rule") {
            return this.instr.rules.has(rule);
        } else if (rule._tag == "Relation") {
            return this.instr.relations.has(rule);
        }
    }
}

class Instruction extends Token {
    constructor(instruction, value, offset, line, char) {
        super(instruction, offset, line, char);
        if (instruction._tag != "Instruction") {
            compilerError("Invalid instruction [%o].", instruction);
        }
        this.instr = instruction;
        if (!(value instanceof Value)) {
            compilerError("Invalid value [%o].", value);
        }
        this.value = value;
        this.offset = offset;
    }
    toString() {
        return `${this.instr.toString()}[${this.offset.toString()}](${this.value.toString()})`;
    }
}

class Container extends Token {
    constructor(instruction, contents, offset, line, char) {
        super(instruction, offset, line, char);
        if (instruction._tag != "ContainerInstruction") {
            compilerError("Invalid container instruction [%o].", instruction);
        }
        this.instr = instruction;
        this.contents = contents;
        this.offset = offset;
    }
    toString() {
        return `${this.instr.toString()}[${this.offset.toString()}]<${this.contents.map(e => e.toString()).join(", ")}>`;
    }
}

module.exports = { Instruction, Container };