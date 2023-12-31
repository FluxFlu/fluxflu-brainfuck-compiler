
const { createIntermediary } = require("./preparation/create_intermediary");
const { finalize } = require("./target/finalize");
const { optimize } = require("./optimization/optimize");
const { simulate } = require("./optimization/simulation");
const { tokenize } = require("./preparation/tokenize");
const { getCompilerFlag } = require("./utils/compiler_flags");

function compile(file) {
    file = tokenize(file);
    file = createIntermediary(file);

    // if (!getCompilerFlag("O0"))
    file = optimize(file);

    if (getCompilerFlag("full-optimize")) {
        file = simulate(file);
        file = optimize(file);
    }
    file = finalize(file);
    return file;
}

module.exports = { compile };