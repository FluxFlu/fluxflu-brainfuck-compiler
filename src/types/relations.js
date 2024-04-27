const { compilerError } = require("../error/internal_compiler_error");

// The right side of this object represents the number of arguments.
const Relations = {
    // These instructions, when next to each other, cancel each other out. Eg, "++++---" can be optimized to "+".
    Opposites: 1,
    
    // This instruction adds to the argument when placed directly after.
    // E.G.
    // E :: Attachment<T>(T, (a, b) => a + b)
    // "T(3), E(2)" == "T(5)"
    Attachment: 1,
    
    // When two of these instructions are next to each other, the second nullifies the first.
    // For example,
    // PLUS :: Nullable<SET>
    // Which indicates that "PLUS(4), SET(2)" can by optimized to "SET(2)".
    Nullable: 1,
};

Object.keys(Relations).forEach((key, index) => {
    const value = Relations[key];
    Relations[key] = (...tokens) => {
        if (tokens.length !== value) {
            compilerError("Invalid use of relation [%s]. Used [%o] arguments, when the proper number is [%o].", key, tokens.length, value);
        } else {
            const relation = {
                _tag: "Relation",
                value: index + 1,
                tokens,
                toString: () => key,
                to: (data) => {
                    relation.data = data;
                    return relation;
                },
                get: () => relation.data
            };
            return relation;
        }
    };
});

class RelationSet {
    constructor(...relations) {
        relations.forEach(relation => {
            if (relation._tag != "Relation") {
                compilerError("Invalid relation [%o].", relation);
            }
        });
        this.relations = relations;
    }
    has(relation) {
        if (relation._tag != "Relation") {
            compilerError("Invalid relation [%o].", relation);
        }
        return this.relations.some(e => e.value == relation.value && e.tokens.every((thisToken, index) => relation.tokens[index].instr.value == thisToken.value));
    }
    get(relation) {
        if (relation._tag != "Relation") {
            compilerError("Invalid relation [%o].", relation);
        }
        return this.relations.find(e => e.value == relation.value && e.tokens.every((thisToken, index) => relation.tokens[index].instr.value == thisToken.value));
    }
}

module.exports = { Relations, RelationSet };