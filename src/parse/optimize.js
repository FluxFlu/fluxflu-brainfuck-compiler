const { Rules } = require("../types/rules");
const { Container } = require("../types/token");
const { byte } = require("../utils/toByte");

const optimizations = [
    require("./optimizations/basic_create_set"),
    require("./optimizations/cancel_nullable"),
    require("./optimizations/cancel_opposite_register"),
    require("./optimizations/cancel_opposite_instructions"),
    require("./optimizations/set_zero_when_implied"),
    require("./optimizations/attachment"),
    require("./optimizations/repeatable"),
    require("./optimizations/loop_when_implied_zero"),
    require("./optimizations/redundant_register_info"),
];

function optimize(tokens) {
    const state = {
        tokens,
        result: [],
        index: 0,
        repeatOptimizations: true
    };

    while (state.repeatOptimizations) {
        state.result = [];
        state.repeatOptimizations = false;
        for (state.index = 0; state.index < state.tokens.length; state.index++) {
            let shouldSkipAdd = false;
            optimizations.forEach(fn => {
                if (!state.tokens[state.index]) {
                    shouldSkipAdd = true;
                    return;
                }
                const args = state;
                args.i = state.index;
                shouldSkipAdd ||= fn(state, args);
            });

            if (state.tokens[state.index] instanceof Container) {
                state.tokens[state.index].pass(optimize);
            }

            // If no optimizations can be made, push the operation as normal.
            if (!shouldSkipAdd) {
                state.result.push(state.tokens[state.index]);
            }
        }
        
        // Compress values to bytes. Eg, -1 => 255.
        state.result.forEach(token => {
            if (!token.is(Rules.CompressToBytes())) {
                return;
            }
            token.value.contents[0].data = byte(token.value.contents[0].data);
        });
        state.tokens = state.result;
    }
    return state.tokens;
}

module.exports = { optimize };