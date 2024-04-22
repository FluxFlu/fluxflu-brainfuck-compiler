const { compilerError } = require("../error/internal_compiler_error");
const { PLUS, MINUS, LEFT, RIGHT, WHILE, INPUT, OUTPUT, SET, PRINT, RELATIVE_PLUS, RELATIVE_MINUS, END, CHECK_SET, RELATIVE_SET, IF } = require("../types/instructions");
const { Constant, Register } = require("../types/value");
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
    [ RELATIVE_PLUS,
        (token) => {
            token.value.forceMatch(Constant, Constant, Register);
            const add = token.value.contents[0].emit();
            const mult = token.value.contents[1].emit();
            const value = `p[${token.value.contents[2].emit()}];`;
            
            let base = `p[${token.offset}] += `;
            if (add != "0") {
                base += `${add} + `;
            }
            if (mult != "1") {
                base += `${mult} * `;
            }
            return base + value;
        }
    ],
    [ RELATIVE_MINUS,
        (token) => {
            token.value.forceMatch(Constant, Constant, Register);
            const add = token.value.contents[0].emit();
            const mult = token.value.contents[1].emit();
            const value = `p[${token.value.contents[2].emit()}];`;
            
            let base = `p[${token.offset}] -= `;
            if (add != "0") {
                base += `${add} + `;
            }
            if (mult != "1") {
                base += `${mult} * `;
            }
            return base + value;
        }
    ],
    [ RELATIVE_SET,
        (token) => {
            token.value.forceMatch(Constant, Constant, Register);
            const add = token.value.contents[0].emit();
            const mult = token.value.contents[1].emit();
            const value = `p[${token.value.contents[2].emit()}];`;
            
            let base = `p[${token.offset}] = `;
            if (add != "0") {
                base += `${add} + `;
            }
            if (mult != "1") {
                base += `${mult} * `;
            }
            return base + value;
        }
    ],
    [ CHECK_SET,
        (token) => {
            token.value.forceMatch(Constant, Register);
            return `if (p[${token.value.contents[1].emit()}]) p[${token.offset}] = ${token.value.contents[0].emit()};`;
        }
    ],
    [ END,
        () => ""
    ],
    [ WHILE,
        ({contents}) => "while(*p){" + emitTokens(contents) + "}"
    ],
    [
        IF,
        ({contents}) => "if(*p){" + emitTokens(contents) + "}"
    ],
]);


let hasMoved = false;


function emitTokens(tokens) {
    return tokens.map((e, i) => {
        if (tokens[i].instr !== SET && tokens[i].instr !== PRINT) {
            hasMoved = true;
        } else if (tokens[i].instr === SET && !hasMoved && tokens[i].value.constant() == 0n) {
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