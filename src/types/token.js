const { compilerError } = require("../error/internal_compiler_error");
const { Value } = require("./value");


class Token {
    constructor(instr, offset, line, char) {
        this.instr = instr;
        if (typeof offset != "bigint") {
            compilerError("Invalid offset [%o]. Must use type `bigint`.", offset);
        }
        this.offset = offset;
        this.line = line;
        this.char = char;
    }
    is(rule) {
        if (rule._tag == "Rule") {
            return this.instr.rules.get(rule);
        } else if (rule._tag == "Relation") {
            return this.instr.relations.get(rule);
        }
    }
    copy() {
        compilerError("Cannot use base `copy` of Token. All Token subclasses must implement their own `copy`.");
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
        if (!(typeof offset == "bigint")) {
            compilerError("Invalid offset [%o].", offset);
        }
        this.offset = offset;
    }
    toString() {
        return `${this.instr.toString()}[${this.offset.toString()}](${this.value.emit("&")})`;
    }
    instrSize() {
        return 1n;
    }
    copy() {
        return new Instruction(this.instr, this.value, this.offset, this.line, this.char);
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
    instrSize() {
        return this.contents.reduce((a, b) => a + b.instrSize(), 0n) + 1n;
    }
    pass (fn) {
        this.contents = fn(this.contents);
    }
    copy() {
        return new Container(this.instr, this.contents, this.offset, this.line, this.char);
    }
}

module.exports = { Instruction, Container };