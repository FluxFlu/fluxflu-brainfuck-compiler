
const { createIntermediary } = require("./preparation/create_intermediary");
const { finalize } = require("./target/finalize");
const { optimize } = require("./optimization/optimize");
const { simulate } = require("./optimization/simulation");
const { tokenize } = require("./preparation/tokenize");
const { getCompilerFlag } = require("./utils/compiler_flags");
const { toPlaintext } = require("braincomp");

function compile(file) {
    if (file.subarray(0, 4) == "BFF:") {
        file = toPlaintext(file);
    } else {
        file = file.toString();
    }
    file = tokenize(file);
    file = createIntermediary(file);

    file = optimize(file);

    if (getCompilerFlag("full-optimize")) {
        file = simulate(file);
        file = optimize(file);
    }
    
    file = finalize(file);
    return file;
}

module.exports = { compile };