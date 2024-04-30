const { RelationSet, Relations } = require("./relations");
const { RuleSet, Rules } = require("./rules");
const { Value, Constant } = require("./value");

const instructions = {
    // PLUS[o]( $x )
    // tape[index + o] += x
    PLUS: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.Repeatable(),
            Rules.CompressToBytes(),
            Rules.OffsetSortable(),
            Rules.DoesNotOutput(),
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.MINUS),
            Relations.Attachment(instructions.SET).to({
                instruction: instructions.SET,
                operation: (a, b) => new Value(new Constant(a.constant() + b.constant()))
            }),
            Relations.Nullable(instructions.SET),
            Relations.Nullable(instructions.INPUT),
            Relations.Nullable(instructions.RELATIVE_SET),
        ),
    },
    // MINUS[o]( $x )
    // tape[index + o] -= x
    MINUS: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.Repeatable(),
            Rules.CompressToBytes(),
            Rules.OffsetSortable(),
            Rules.DoesNotOutput(),
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.PLUS),
            Relations.Attachment(instructions.SET).to({
                instruction: instructions.SET,
                operation: (a, b) => new Value(new Constant(a.constant() - b.constant()))
            }),
            Relations.Nullable(instructions.SET),
            Relations.Nullable(instructions.INPUT),
            Relations.Nullable(instructions.RELATIVE_SET),
        ),
    },
    // LEFT( $x )
    // index -= x
    LEFT: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.Moves(),
            Rules.Repeatable(),
            Rules.DoesNotOutput(),
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.RIGHT),
        ),
    },
    // RIGHT( $x )
    // index += x
    RIGHT: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.Moves(),
            Rules.Repeatable(),
            Rules.DoesNotOutput(),
        ),
        relations: () => new RelationSet(
            Relations.Opposites(instructions.LEFT),
        ),
    },
    // START_LOOP
    // while (tape[index]) {
    START_LOOP: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.InterruptOffset(),
        ),
        relations: () => new RelationSet(),
    },
    // END_LOOP
    // }
    END_LOOP: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.ImpliesZero(),
            Rules.InterruptOffset(),
        ),
        relations: () => new RelationSet(),
    },
    // INPUT[o]
    // tape[index + o] = getchar();
    INPUT: {
        type     : "Instruction",
        rules    : () => new RuleSet(),
        relations: () => new RelationSet(),
    },
    // OUTPUT[o]
    // putchar(tape[index + o])
    OUTPUT: {
        type     : "Instruction",
        rules    : () => new RuleSet(),
        relations: () => new RelationSet(),
    },
    // CONST_PRINT( "str" )
    // puts(x);
    CONST_PRINT: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.NullOffset(),
            Rules.Repeatable(),
        ),
        relations: () => new RelationSet(),
    },

    // DEBUG
    // outputDebugInfo()
    DEBUG: {
        type     : "Instruction",
        rules    : () => new RuleSet(),
        relations: () => new RelationSet(),
    },
    // SET[o]( $str )
    // tape[index + o] = str
    SET: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.CompressToBytes(),
            Rules.OffsetSortable(),
            Rules.DoesNotOutput(),
        ),
        relations: () => new RelationSet(
            Relations.Nullable(instructions.SET),
            Relations.Nullable(instructions.INPUT),
            Relations.Nullable(instructions.RELATIVE_SET),
        ),
    },

    // SCAN_LEFT( $by )
    // while (tape[index]) index -= by;
    SCAN_LEFT: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.Moves(),
            Rules.DoesNotOutput(),
            Rules.InterruptOffset(),
        ),
        relations: () => new RelationSet(),
    },

    // SCAN_RIGHT( $by )
    // while (tape[index]) index += by;
    SCAN_RIGHT: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.Moves(),
            Rules.DoesNotOutput(),
            Rules.InterruptOffset(),
        ),
        relations: () => new RelationSet(),
    },

    // RELATIVE_PLUS[o]( $plus, $mult, %value )
    // tape[index + o] += plus + mult * value
    RELATIVE_PLUS: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.RegisterType().to(instructions.PLUS),
            Rules.OffsetSortable(),
            Rules.DoesNotOutput(),
        ),
        relations: () => new RelationSet(
            Relations.Attachment(instructions.SET).to({
                instruction: instructions.RELATIVE_SET,
                operation: (a, b) => new Value(new Constant(a.constant() + b.contents[0].data), b.contents[1], b.contents[2])
            }),
            Relations.Nullable(instructions.SET),
            Relations.Nullable(instructions.INPUT),
            Relations.Nullable(instructions.RELATIVE_SET),
        ),
    },
    // RELATIVE_MINUS[o]( $plus, $mult, %value )
    // tape[index + o] -= plus + mult * value
    RELATIVE_MINUS: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.RegisterType().to(instructions.MINUS),
            Rules.OffsetSortable(),
            Rules.DoesNotOutput(),
        ),
        relations: () => new RelationSet(
            Relations.Attachment(instructions.SET).to({
                instruction: instructions.RELATIVE_SET,
                operation: (a, b) => new Value(new Constant(a.constant() - b.contents[0].data), new Constant(-1n * b.contents[1].data), b.contents[2])
            }),
            Relations.Nullable(instructions.SET),
            Relations.Nullable(instructions.INPUT),
            Relations.Nullable(instructions.RELATIVE_SET),
        ),
    },
    // RELATIVE_SET[o]( $plus, $mult, %value )
    // tape[index + o] = plus + mult * value
    RELATIVE_SET: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.CancelWhenOppositeRegister(),
            Rules.RegisterType().to(instructions.SET),
            Rules.OffsetSortable(),
            Rules.DoesNotOutput(),
        ),
        relations: () => new RelationSet(
            Relations.Nullable(instructions.SET),
            Relations.Nullable(instructions.INPUT),
            Relations.Nullable(instructions.RELATIVE_SET),
        ),
    },
    // CHECK_SET[o]( $modify, %check, $value )
    // if (modify + check) tape[index + o] = value
    CHECK_SET: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.RequiresNonzero(),
            Rules.OffsetSortable(),
            Rules.DoesNotOutput(),
        ),
        relations: () => new RelationSet(
            Relations.Nullable(instructions.SET),
            Relations.Nullable(instructions.INPUT),
            Relations.Nullable(instructions.RELATIVE_SET),
        ),
    },

    END: {
        type     : "Instruction",
        rules    : () => new RuleSet(
            Rules.InterruptOffset(),
            Rules.DoesNotOutput(),
        ),
        relations: () => new RelationSet(),
    },

    // WHILE
    // while (tape[index]) { contents }
    WHILE: {
        type     : "ContainerInstruction",
        rules    : () => new RuleSet(
            Rules.ImpliesZero(),
            Rules.RequiresNonzero(),
            Rules.InterruptOffset(),
        ),
        relations: () => new RelationSet(),
    },
    
    // STILL_WHILE
    // pre_index = index
    // while (tape[index]) { contents }
    // assert(pre_index == index)
    STILL_WHILE: {
        type     : "ContainerInstruction",
        rules    : () => new RuleSet(
            Rules.ImpliesZero(),
            Rules.RequiresNonzero(),
        ),
        relations: () => new RelationSet(),
    },

    // IF
    // if (tape[index]) { contents }
    IF: {
        type     : "ContainerInstruction",
        rules    : () => new RuleSet(
            Rules.ImpliesZero(),
            Rules.RequiresNonzero(),
            Rules.InterruptOffset(),
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
    instructions[key].rules = instructions[key].rules();
    instructions[key].relations = instructions[key].relations();
});

module.exports = instructions;