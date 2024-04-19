const { compilerError } = require("../../error/internal_compiler_error");

// The right side of this object represents the number of arguments.
const Relations = {
    // These instructions, when next to each other, cancel each other out. Eg, "++++---" can be optimized to "+".
    Opposites: 1
};

Object.keys(Relations).forEach((key, index) => {
    const value = Relations[key];
    Relations[key] = (...tokens) => {
        if (tokens.length !== value) {
            compilerError("Invalid use of relation [%s]. Used [%o] arguments, when the proper number is [%o].", key, tokens.length, value);
        } else {
            return {
                _tag: "Relation",
                value: index + 1,
                tokens,
                toString: () => key
            };
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
        return this.relations.some(e => e.value == relation.value && e.tokens.every(thisToken => relation.tokens.some(thatToken => thisToken.value == thatToken.value)));
    }
}

module.exports = { Relations, RelationSet };