const { compilerError } = require("../../error/internal_compiler_error");

const Rules = {
    // For these instructions, increasing the token's value is equal to adding a new token with value 1.
    // For example, "PLUS(1), PLUS(1), PLUS(1), PLUS(1)" == "PLUS(4)".
    Repeatable: null,
    // These instructions experience single byte overflow.
    // For example PLUS(-1) => PLUS(255).
    CompressToBytes: null,
    // When two of these instructions are next to each other, the second nullifies the first.
    // For example, "SET(4), SET(2)" can by optimized to "SET(2)".
    Nullable: null,
    // The chronological order of these instructions makes no difference when they have a different offset.
    // Eg. "PLUS[1](5), MINUS[0](2)" == "MINUS[0](2), PLUS[1](5)"
    OffsetSortable: null,
};

Object.keys(Rules).forEach((key, index) => {
    Rules[key] = {
        _tag: "Rule",
        value: index + 1,
        toString: () => key
    };
});

class RuleSet {
    constructor(...rules) {
        rules.forEach(rule => {
            if (rule._tag != "Rule") {
                compilerError("Invalid rule [%o].", rule);
            }
        });
        this.rules = new Set(rules);
    }
    has(rule) {
        if (rule._tag != "Rule") {
            compilerError("Invalid rule [%o].", rule);
        }
        return this.rules.has(rule);
    }
}

module.exports = { Rules, RuleSet };