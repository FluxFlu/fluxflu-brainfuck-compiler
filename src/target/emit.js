const { compilerError } = require("../error/internal_compiler_error");
const { PLUS, MINUS, LEFT, RIGHT, WHILE, INPUT, OUTPUT, SET, PRINT, RELATIVE_MULT_PLUS, RELATIVE_MULT_MINUS, END, RELATIVE_SET } = require("../parse/types/instructions");
const { RESET, RED, BOLD_BLUE } = require("../utils/colors");
const { getCompilerFlag } = require("../utils/compiler_flags");

const binding = new Map([
    [ PLUS,
        ({value, offset}) => `p[${offset}]+=${value.emit(null)};`
    ],
    [ MINUS,
        ({value, offset}) => `p[${offset}]-=${value.emit(null)};`
    ],
    [ LEFT,
        ({value}) => `if(p-${value.emit(null)}>tape)p-=${value.emit(null)};else p=tape;`
    ],
    [ RIGHT,
        ({value}) => {
            return (
                (
                    `p+=${value.emit(null)};`
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
    [ END,
        () => ""
    ],
    [ INPUT,
        ({offset}) => `p[${offset}]=getchar();`
    ],
    [ OUTPUT,
        ({offset}) => `putchar(p[${offset}]);`
    ],
    [ PRINT,
        ({value}) => `puts("${value.emit(null)}");`
    ],
    [ SET,
        ({value, offset}) => value ? `p[${offset}]=${value.emit(null)};` : `p[${offset}]=0;`
    ],
    [ RELATIVE_MULT_PLUS,
        (token) => {
            return `p[${token.offset}] += ${token.value.emit("*")};`;
        }
    ],
    [ RELATIVE_MULT_MINUS,
        (token) => {
            if (token.offset == 0 && token.value.emit("*") == "(1 * p[0])") {
                return "p[0] = 0;";
            }
            return `p[${token.offset}] -= ${token.value.emit("*")};`;
        }
    ],
    [ RELATIVE_SET,
        (token) => {
            return `if (p[${token.value.runtime[0]}]) p[${token.offset}] = ${token.value.constant.emit()};`;
        }
    ]
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
    }).join("\n");
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