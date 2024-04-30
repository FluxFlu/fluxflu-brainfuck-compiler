const { emit } = require("./target/emit");
const { tokenize } = require("./parse/tokenize");
const { offsetSort } = require("./parse/offset_sort");
const { collapseLoops } = require("./parse/collapse_loops");
const { optimize } = require("./parse/optimize");
const { calculateOffsets } = require("./parse/calculate_offsets");
const { multWhile } = require("./parse/mult_while");
const { parseIf } = require("./parse/parse_if");
const { analyze } = require("./flow_analysis/analyze");
const { Container, Instruction } = require("./types/token");
const { delayModify } = require("./parse/delay_modify");
const { getCompilerFlag } = require("./utils/compiler_flags");
const { logError } = require("./error/log_error");
const { Rules } = require("./types/rules");
const { CONST_PRINT } = require("./types/instructions");
const { simplifySetup } = require("./parse/simplify_setup");

function compile(file) {
    const O0 = getCompilerFlag("-O0");
    let   O1 = getCompilerFlag("-O1");
    const O2 = getCompilerFlag("-O2");
    if ((+!!O0 + +!!O1 + +!!O2) > 1) {
        logError("twice_optimize_flag", O0, O1, O2);
    }
    if (!O0 && !O1 && !O2) {
        O1 = true;
    }

    file = file.toString();
    file = tokenize(file);

    const stripAnalysisState = token => {
        if (token instanceof Container) {
            token.contents.forEach(stripAnalysisState);
        }
        token.state = undefined;
        return token;
    };

    if (O1 || O2) {
        let requireNum = O2 ? 14 : 7;
        let size = BigInt(file.length) + 1n;
        while (file.reduce((a, b) => a + b.instrSize(), 0n) < size || requireNum > 0) {
            size = file.reduce((a, b) => a + b.instrSize(), 0n);
            file = optimize(file);
            file = collapseLoops(file);
            file = calculateOffsets(file);
            file = offsetSort(file);
            file = multWhile(file);
            file = parseIf(file);
            file = delayModify(file);
            file = simplifySetup(file);
            if (O2 && requireNum <= 3) {
                file.forEach(stripAnalysisState);
                file = analyze(file);
            }
            requireNum--;
        }
    }

    const nonStatic = token => {
        if (token instanceof Instruction) {
            return (!token.is(Rules.DoesNotOutput()) && token.instr !== CONST_PRINT);
        } else {
            return token.contents.some(nonStatic);
        }
    };

    if (!file.some(nonStatic)) {
        const doesOutput = token => {
            if (token instanceof Instruction) {
                return (!token.is(Rules.DoesNotOutput()));
            } else {
                return token.contents.some(nonStatic);
            }
        };
        file = file.filter(doesOutput);
        file.static = true;
    }

    return emit(file);
}

module.exports = { compile };