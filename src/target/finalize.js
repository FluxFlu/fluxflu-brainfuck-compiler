const { PLUS, MINUS, SET, PRINT } = require("../preparation/utils/instructions");
const { RESET, RED, BOLD_BLUE } = require("../utils/colors");
const { getCompilerFlag } = require("../utils/compiler_flags");

const binding = [
    null,
    /* PLUS         */ (value, offset) => (value > 1) ? `p[${offset}]+=${value};` : `p[${offset}]++;`,
    /* MINUS        */ (value, offset) => (value > 1) ? `p[${offset}]-=${value};` : `p[${offset}]--;`,
    /* LEFT         */ value => (value > 1) ? `if(p-${value}>tape)p-=${value};else p=tape;` : "if(p>tape)p--;",
    /* RIGHT        */ value => {
        return (
            (
                (value > 1) ?
                    `p+=${value};`
                    : "p++;"
            )
            +
            (
                getCompilerFlag("final") ? "" :
                    "if(p-tape>" + getCompilerFlag("tape-size") + "){fputs(\"" + RED + "Runtime Error:" + RESET + " Moved further than the tape allows. You can extend the length of the tape using " + BOLD_BLUE + "--tape-size {number}" + RESET + "\\n\", stdout);return 1;}"
            ) +
            (getCompilerFlag("heap-memory") ? "while(p>size){size++;(*size)=0;}" : "")
        );
    },
    /* START_LOOP   */ () => "while(*p){",
    /* END_LOOP     */ () => "}",
    /* INPUT        */ (value, offset) => `p[${offset}]=getchar();`,
    /* OUTPUT       */ (value, offset) => `putchar(p[${offset}]);`,
    /* PRINT        */ value => `fputs("${value}",stdout);`,
    /* SET          */ (value, offset) => value ? `p[${offset}]=${value};` : `p[${offset}]=0;`,
    /* MULT_ASSIGN  */ (value, offset) => {

        if (!value.offset && !offset && (!value.value || value.value == 1) && value.instr == MINUS)
            return "p[0] = 0;";

        if (value.instr == SET) {
            return `if (p[${offset}]) p[${value.offset + offset}] = ${value.value};`;
        }

        const op = value.instr == PLUS ? "+=" : "-=";

        if (value.value > 1)
            return `p[${value.offset + offset}]${op}${value.value}*p[${offset}];`;
        else
            return `p[${value.offset + offset}]${op}p[${offset}];`;
    }
];


let hasMoved = false;

function finalize(file) {
    let output = "#include <stdio.h>\n";
    if (getCompilerFlag("heap-memory"))
        output += "#include <stdlib.h>\n";
    output += "int main(){";
    if (getCompilerFlag("heap-memory")) {
        output += "char*tape=malloc(" + getCompilerFlag("tape-size") + ");tape[0]=0;char*size=tape;";
    } else {
        output += "char tape[" + getCompilerFlag("tape-size") + "]={0};";
    }
    output += "char*p=tape;";
    for (let i = 0; i < file.length; i++) {
        if (file[i].instr !== SET && file[i].instr !== PRINT) {
            hasMoved = true;
        } else if (file[i].instr === SET && !hasMoved && file[i].value == 0) {
            continue;
        }

        if (file[i].instr == SET && file[i].value === file[i + 1]?.value && file[i].offset === file[i + 1].offset - 1) {
            const offset = file[i].offset;
            const lastSetValue = file[i].value;
            let numSameSet = 1;
            for (let j = i + 1; true; j++) {
                if (file[j].value == lastSetValue && file[j].offset === file[j - 1].offset + 1 && j + 1 < file.length) {
                    numSameSet++;
                } else if (numSameSet > 7) {
                    output += `for (int g=${numSameSet};--g;) tape[g+${offset}]=${lastSetValue};`;
                    i = j;
                    break;
                } else {
                    break;
                }
            }
        }
        output += binding[file[i].instr](file[i].value, file[i].offset);
    }
    return output + "return 0;}";
}

module.exports = { finalize };