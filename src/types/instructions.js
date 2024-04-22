const { RelationSet, Relations } = require("./relations");
const { RuleSet, Rules } = require("./rules");
const { Value, Constant } = require("./value");

const instructions = {
    // PLUS[o]( $x )
    // tape[index + o] += x
    PLUS: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.Repeatable,
            Rules.CompressToBytes,
            Rules.OffsetSortable,
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.MINUS),
            Relations.Attachment(instructions.SET).to({
                instruction: instructions.SET,
                operation: (a, b) => new Value(new Constant(a.constant() + b.constant()))
            }),
        ),
    },
    // MINUS[o]( $x )
    // tape[index + o] -= x
    MINUS: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.Repeatable,
            Rules.CompressToBytes,
            Rules.OffsetSortable,
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.PLUS),
            Relations.Attachment(instructions.SET).to({
                instruction: instructions.SET,
                operation: (a, b) => new Value(new Constant(a.constant() - b.constant()))
            }),
        ),
    },
    // LEFT( $x )
    // index -= x
    LEFT: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.Repeatable,
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.RIGHT)
        ),
    },
    // RIGHT( $x )
    // index += x
    RIGHT: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.Repeatable,
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.LEFT)
        ),
    },
    // START_LOOP
    // while (tape[index]) {
    START_LOOP: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.END_LOOP)
        ),
    },
    // END_LOOP
    // }
    END_LOOP: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.ImpliesZero
        ),
        relations: () => new RelationSet(),
    },
    // INPUT[o]
    // tape[index + o] = getchar();
    INPUT: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(),
    },
    // OUTPUT
    // putchar(tape[index + o])
    OUTPUT: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(),
    },
    // DEBUG
    // outputDebugInfo()
    DEBUG: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(),
    },
    // PRINT( $str )
    // puts(str)
    PRINT: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(),
    },
    // SET[o]( $str )
    // tape[index + o] = str
    SET: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.CompressToBytes,
            Rules.Nullable,
            Rules.OffsetSortable,
        ),
        relations: () => new RelationSet(),
    },

    // RELATIVE_MULT_PLUS[o]( $mult, %value )
    // tape[index + o] += mult * value
    RELATIVE_PLUS: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(
            Relations.Attachment(instructions.SET).to({
                instruction: instructions.RELATIVE_SET,
                operation: (a, b) => new Value(new Constant(a.constant() + b.contents[0].data), b.contents[1], b.contents[2])
            }),
        ),
    },
    // RELATIVE_MULT_MINUS[o]( $mult, %value )
    // tape[index + o] -= mult * value
    RELATIVE_MINUS: {
        type     : "Instruction",
        rules    : new RuleSet(),
        relations: () => new RelationSet(
            Relations.Attachment(instructions.SET).to({
                instruction: instructions.RELATIVE_SET,
                operation: (a, b) => new Value(new Constant(a.constant() - b.contents[0].data), new Constant(-1n * b.contents[1].data), b.contents[2])
            }),
        ),
    },
    RELATIVE_SET: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.CancelWhenOppositeRegister
        ),
        relations: () => new RelationSet(),
    },
    // CHECK_SET[o]( $value, %check )
    // if (check) tape[index + o] = value
    CHECK_SET: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.RequiresNonzero,
        ),
        relations: () => new RelationSet(),
    },

    END: {
        type     : "Instruction",
        rules    : new RuleSet(
            Rules.InterruptOffset,
        ),
        relations: () => new RelationSet(),
    },
    WHILE: {
        type     : "ContainerInstruction",
        rules    : new RuleSet(
            Rules.ImpliesZero,
            Rules.RequiresNonzero,
            Rules.InterruptOffset,
        ),
        relations: () => new RelationSet(),
    },
    IF: {
        type     : "ContainerInstruction",
        rules    : new RuleSet(
            Rules.ImpliesZero,
            Rules.RequiresNonzero,
            Rules.InterruptOffset,
        ),
        relations: () => new RelationSet(),
    },
};

Object.keys(instructions).forEach((key, index) => {
    instructions[key] = {
        _tag: instructions[key].type,
        value: index + 1,
        rules: instructions[key].rules,
        relations: instructions[key].relations,
        toString: () => key
    };
});
Object.keys(instructions).forEach(key => {
    instructions[key].relations = instructions[key].relations();
});

module.exports = instructions;