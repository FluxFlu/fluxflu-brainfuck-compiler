const { compilerError } = require("../error/internal_compiler_error");

const Rules = {
    // For these instructions, increasing the token's value is equal to adding a new token with value 1.
    // For example, "PLUS(1), PLUS(1), PLUS(1), PLUS(1)" == "PLUS(4)".
    // This also applies to strings, such as with CONST_PRINT.
    Repeatable: null,
    
    // These instructions experience single byte overflow.
    // For example PLUS(-1) => PLUS(255).
    CompressToBytes: null,
    
    // The chronological order of these instructions makes no difference when they have a different offset.
    // Eg. "PLUS[1](5), MINUS[0](2)" == "MINUS[0](2), PLUS[1](5)"
    OffsetSortable: null,

    // These instructions imply that the current value in the tape is zero after it is run.
    // An example of this is WHILE.
    ImpliesZero: null,

    // These instructions only do anything when the current value in the tape is nonzero.
    // An example of this is WHILE.
    RequiresNonzero: null,

    // These instructions interrupt offset calculation.
    // This is because after one of these is interpreted,
    // the index into the tape changes in a manner that is unknowable at compile-time.
    InterruptOffset: null,

    // When two of these instructions are next to each other,
    // and the instructions' offsets are equal to the other instruction's register,
    // the first instruction cancels the second.
    CancelWhenOppositeRegister: null,

    // This relation describes a specific category of instructions that follow the type pattern:
    // ( Constant, Constant, Register )
    // And in which the result follows the pattern:
    // ( $plus, $mult, %register) => plus + mult * register
    RegisterType: null,

    // These operators need no offset, and for the purposes of sorting, have an offset of -Infinity.
    NullOffset: null,

    // These operators don't perform IO. For exmaple, this rule includes PLUS and SET, but not INPUT and OUTPUT.
    DoesNotOutput: null,

    // These operators move the index in the tape. Eg. LEFT, RIGHT, SCAN_LEFT.
    Moves: null,
};

Object.keys(Rules).forEach((key, index) => {
    Rules[key] = () => {
        const rule = {
            _tag: "Rule",
            value: index + 1,
            toString: () => key,
            to: (data) => {
                rule.data = data;
                return rule;
            },
            get: () => rule.data
        };
        return rule;
    };
});

class RuleSet {
    constructor(...rules) {
        rules.forEach(rule => {
            if (rule._tag != "Rule") {
                compilerError("Invalid rule [%o].", rule);
            }
        });
        this.rules = rules;
    }
    has(rule) {
        if (rule._tag != "Rule") {
            compilerError("Invalid rule [%o].", rule);
        }
        return this.rules.some(e => e.value == rule.value);
    }
    get(rule) {
        if (rule._tag != "Rule") {
            compilerError("Invalid rule [%o].", rule);
        }
        return this.rules.find(e => e.value == rule.value);
    }
}

module.exports = { Rules, RuleSet };