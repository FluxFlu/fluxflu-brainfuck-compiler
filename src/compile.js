
const { createIntermediary } = require("./preparation/create_intermediary");
const { finalize } = require("./target/finalize");
const { optimize } = require("./optimization/optimize");
const { simulate } = require("./optimization/simulation");
const { tokenize } = require("./preparation/tokenize");
const { getCompilerFlag } = require("./utils/compiler_flags");
const { toPlaintext } = require("braincomp");
const { offsetOptimize } = require("./optimization/offset_optimize");
const { sort } = require("./optimization/sort");
const { lastOptimize } = require("./optimization/last_optimize");

function compile(file) {
    if (file.subarray(0, 4) == "BFF:") {
        file = toPlaintext(file);
    } else {
        file = file.toString();
    }
    file = tokenize(file);
    file = createIntermediary(file);

    file.forEach(e => { if (!e.offset) e.offset = 0; });

    let oldLength = Infinity;

    while (oldLength > file.length) {
        oldLength = file.length;
        file = optimize(file);
        file = offsetOptimize(file);
        file = sort(file);
    }
    if (getCompilerFlag("full-optimize")) {
        file = simulate(file);

        file = sort(file);
        file = optimize(file);
        file = offsetOptimize(file);
    }
    file = lastOptimize(file);

    oldLength = Infinity;

    while (oldLength > file.length) {
        oldLength = file.length;
        file = optimize(file);
        file = offsetOptimize(file);
    }

    file = finalize(file);
    return file;
}

module.exports = { compile };