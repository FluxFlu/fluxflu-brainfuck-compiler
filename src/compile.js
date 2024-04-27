const { emit } = require("./target/emit");
const { tokenize } = require("./parse/tokenize");
const { offsetSort } = require("./parse/offset_sort");
const { collapseLoops } = require("./parse/collapse_loops");
const { optimize } = require("./parse/optimize");
const { calculateOffsets } = require("./parse/calculate_offsets");
const { multWhile } = require("./parse/mult_while");
const { parseIf } = require("./parse/parse_if");
const { analyze } = require("./flow_analysis/analyze");
const { Container } = require("./types/token");

function compile(file) {
    file = file.toString();
    file = tokenize(file);

    const stripAnalysisState = token => {
        if (token instanceof Container) {
            token.contents.forEach(stripAnalysisState);
        }
        token.state = undefined;
        return token;
    };

    let size = BigInt(file.length) + 1n;
    while (file.reduce((a, b) => a + b.instrSize(), 0n) < size) {
        size = file.reduce((a, b) => a + b.instrSize(), 0n);
        file = optimize(file);
        file = collapseLoops(file);
        file = calculateOffsets(file);
        file = offsetSort(file);
        file = multWhile(file);
        file = parseIf(file);
        file.forEach(stripAnalysisState);
        file = analyze(file);
    }

    return emit(file);
}

module.exports = { compile };