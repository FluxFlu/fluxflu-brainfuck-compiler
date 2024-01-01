const { PLUS, MINUS } = require("../preparation/utils/instructions");
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
    // /* MULT_ASSIGN  */ value => {
    //     const op = (value.instr == PLUS ? "+=" : (value.instr == MINUS ? "-=" : "="));
    //     // console.log(`p[${offset || 0}] ${op} ${value.value}*p[0];`);
    //     const offset = value.offset;
    //     // console.log(offset);
    //     if (!offset && (!value.value || value.value == 1) && op == "-=")
    //         return "p[0] = 0;";
    //     // process.exit(1)
    //     if (value.value > 1)
    //         return `p[${value.offset}] ${op} ${value.value}*p[0]; // F`;
    //     else
    //         return `p[${value.offset}] ${op} p[0]; // E`;
    // }
];

function finalize (file) {
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
        output += binding[file[i].instr](file[i].value, file[i].offset) + "\n";
    }
    return output + "return 0;}";
}

module.exports = { finalize };