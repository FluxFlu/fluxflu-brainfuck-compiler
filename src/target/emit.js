const { compilerError } = require("../error/internal_compiler_error");
const { PLUS, MINUS, LEFT, RIGHT, WHILE, INPUT, OUTPUT, SET, PRINT, MULT_ASSIGN } = require("../parse/types/instructions");
const { RESET, RED, BOLD_BLUE } = require("../utils/colors");
const { getCompilerFlag } = require("../utils/compiler_flags");

const binding = new Map([
    [ PLUS,
        ({value, offset}) => (value > 1) ? `p[${offset}]+=${value};` : `p[${offset}]++;`
    ],
    [ MINUS,
        ({value, offset}) => (value > 1) ? `p[${offset}]-=${value};` : `p[${offset}]--;`
    ],
    [ LEFT,
        ({value}) => (value > 1) ? `if(p-${value}>tape)p-=${value};else p=tape;` : "if(p>tape)p--;"
    ],
    [ RIGHT,
        ({value}) => {
            return (
                (
                    (value > 1) ?
                        `p+=${value};`
                        : "p++;"
                )
                +
                (
                    getCompilerFlag("final") ? "" :
                        "if(p-tape>" + getCompilerFlag("tape-size") + "){puts(dbgString);return 1;}"
                ) +
                (getCompilerFlag("heap-memory") ? "while(p>size){size++;(*size)=0;}" : "")
            );
        },
    ],
    [ WHILE,
        ({contents}) => "while(*p){" + emitTokens(contents) + "}"
    ],
    [ INPUT,
        ({value, offset}) => `p[${offset}]=getchar();`
    ],
    [ OUTPUT,
        ({value, offset}) => `putchar(p[${offset}]);`
    ],
    [ PRINT,
        ({value}) => `puts("${value}");`
    ],
    [ SET,
        ({value, offset}) => value ? `p[${offset}]=${value};` : `p[${offset}]=0;`
    ],
    [ MULT_ASSIGN,
        ({value, offset}) => {

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
    ],
]);


let hasMoved = false;


function emitTokens(tokens) {
    return tokens.map((e, i) => {
        if (tokens[i].instr !== SET && tokens[i].instr !== PRINT) {
            hasMoved = true;
        } else if (tokens[i].instr === SET && !hasMoved && tokens[i].value == 0) {
            return;
        }
        if (!binding.has(tokens[i].instr)) {
            compilerError("Invalid instruction [%s].", tokens[i].toString());
        }
        return binding.get(tokens[i].instr)(tokens[i]);
    }).join("\n")
}

function emit(tokens) {
    let output = "#include <stdio.h>\n";
    if (getCompilerFlag("heap-memory")) {
        output += "#include <stdlib.h>\n";
    }
    if (!getCompilerFlag("final")) {
        output += "const char* dbgString = \"" + RED + "Runtime Error:" + RESET + " Moved further than the tape allows. You can extend the length of the tape using " + BOLD_BLUE + "--tape-size {number}" + RESET + "\\n\";\n";
    }
    output += "int main(){";
    if (getCompilerFlag("heap-memory")) {
        output += "char*tape=malloc(" + getCompilerFlag("tape-size") + ");tape[0]=0;char*size=tape;";
    } else {
        output += "char tape[" + getCompilerFlag("tape-size") + "]={0};";
    }
    output += "char*p=tape;";
    output += emitTokens(tokens);
    return output + "return 0;}";
}

module.exports = { emit };