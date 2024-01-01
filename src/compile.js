
const { createIntermediary } = require("./preparation/create_intermediary");
const { finalize } = require("./target/finalize");
const { optimize } = require("./optimization/optimize");
const { simulate } = require("./optimization/simulation");
const { tokenize } = require("./preparation/tokenize");
const { getCompilerFlag } = require("./utils/compiler_flags");
const { toPlaintext } = require("braincomp");
const { furtherOptimize } = require("./optimization/further_optimize");

function compile(file) {
    if (file.subarray(0, 4) == "BFF:") {
        file = toPlaintext(file);
    } else {
        file = file.toString();
    }
    file = tokenize(file);
    file = createIntermediary(file);

    file = optimize(file);

    file.forEach(e => { if (!e.offset) e.offset = 0; });


    let oldLength = file.length + 1;

    while (oldLength !== file.length) {
        oldLength = file.length;
        file = optimize(file);
        file = furtherOptimize(file);
        if (getCompilerFlag("full-optimize")) {
            file = simulate(file);
        }
    }

    file = finalize(file);
    return file;
}

module.exports = { compile };