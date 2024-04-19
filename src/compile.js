const { emit } = require("./target/emit");
const { optimize } = require("./optimization/optimize");
const { tokenize } = require("./parse/tokenize");
const { offsetOptimize } = require("./optimization/offset_optimize");
const { sort } = require("./optimization/sort");
const { lastOptimize } = require("./optimization/last_optimize");
const { collapseLoops } = require("./parse/collapse_loops");
const { tokenCleanup } = require("./parse/token_cleanup");

function compile(file) {
    file = file.toString();
    file = tokenize(file);
    file = tokenCleanup(file);
    file = collapseLoops(file);
    console.log(file.map(e => e.toString()));

    // let oldLength = Infinity;

    // while (oldLength > file.length) {
    //     oldLength = file.length;
    //     file = optimize(file);
    //     file = offsetOptimize(file);
    //     file = sort(file);
    // }
    // file = lastOptimize(file);

    // oldLength = Infinity;

    // while (oldLength > file.length) {
    //     oldLength = file.length;
    //     file = optimize(file);
    //     file = offsetOptimize(file);
    // }

    return emit(file);
}

module.exports = { compile };