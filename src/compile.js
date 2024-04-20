const { emit } = require("./target/emit");
const { tokenize } = require("./parse/tokenize");
const { offsetSort } = require("./parse/offset_sort");
const { collapseLoops } = require("./parse/collapse_loops");
const { tokenCleanup } = require("./parse/token_cleanup");
const { calculateOffsets } = require("./parse/calculate_offsets");
const { multWhile } = require("./parse/mult_while");

function compile(file) {
    file = file.toString();
    file = tokenize(file);

    // let size = Infinity;
    // while (file.reduce((a, b) => a + b.instrSize(), 0) < size) {
    // size = file.reduce((a, b) => a + b.instrSize(), 0);
    file = tokenCleanup(file);
    file = collapseLoops(file);
    file = calculateOffsets(file);
    file = offsetSort(file);
    file = multWhile(file);
    // }

    return emit(file);
}

module.exports = { compile };