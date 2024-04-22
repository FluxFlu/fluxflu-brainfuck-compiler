const { emit } = require("./target/emit");
const { tokenize } = require("./parse/tokenize");
const { offsetSort } = require("./parse/offset_sort");
const { collapseLoops } = require("./parse/collapse_loops");
const { optimize } = require("./parse/optimize");
const { calculateOffsets } = require("./parse/calculate_offsets");
const { multWhile } = require("./parse/mult_while");
const { parseIf } = require("./parse/parse_if");

function compile(file) {
    file = file.toString();
    file = tokenize(file);

    let size = BigInt(file.length) + 1n;
    while (file.reduce((a, b) => a + b.instrSize(), 0n) < size) {
        size = file.reduce((a, b) => a + b.instrSize(), 0n);
        file = optimize(file);
        file = collapseLoops(file);
        file = calculateOffsets(file);
        file = offsetSort(file);
        file = multWhile(file);
        file = parseIf(file);
    }

    return emit(file);
}

module.exports = { compile };