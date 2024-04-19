const { RelationSet, Relations } = require("./relations");
const { RuleSet, Rules } = require("./rules");

const instructions = {
    PLUS: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.Repeatable,
            Rules.CompressToBytes,
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.MINUS)
        ),
    },
    MINUS: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.Repeatable,
            Rules.CompressToBytes,
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.PLUS)
        ),
    },
    LEFT: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.Repeatable,
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.RIGHT)
        ),
    },
    RIGHT: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.Repeatable,
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.LEFT)
        ),
    },
    START_LOOP: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.END_LOOP)
        ),
    },
    END_LOOP: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.START_LOOP)
        ),
    },
    INPUT: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(),
    },
    OUTPUT: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(),
    },
    DEBUG: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(),
    },
    PRINT: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(),
    },
    SET: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.CompressToBytes,
            Rules.Nullable,
        ),
        relations: () => new RelationSet(),
    },
    MULT_ASSIGN: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(),
    },
    WHILE: {
        type     : "ContainerInstruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(),
    },
};

Object.keys(instructions).forEach((key, index) => {
    instructions[key] = {
        _tag: instructions[key].type,
        value: index + 1,
        rules: instructions[key].rules,
        relations: instructions[key].relations(),
        toString: () => key
    };
});

module.exports = instructions;