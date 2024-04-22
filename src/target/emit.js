const { compilerError } = require("../error/internal_compiler_error");
const { PLUS, MINUS, LEFT, RIGHT, WHILE, INPUT, OUTPUT, SET, PRINT, RELATIVE_PLUS, RELATIVE_MINUS, END, CHECK_SET, RELATIVE_SET, IF } = require("../types/instructions");
const { Constant, Register } = require("../types/value");
const { RESET, RED, BOLD_BLUE } = require("../utils/colors");
const { getCompilerFlag } = require("../utils/compiler_flags");

const binding = new Map([
    [ PLUS,
        ({value, offset}) => `\tp[${offset}] += ${value.emit(null)};`
    ],
    [ MINUS,
        ({value, offset}) => `\tp[${offset}] -= ${value.emit(null)};`
    ],
    [ LEFT,
        ({value}) => `\tif (p - ${value.emit(null)} > tape) p -= ${value.emit(null)}; else p = tape;`
    ],
    [ RIGHT,
        ({value}) => {
            return (
                (
                    `\tp += ${value.emit(null)};`
                )
                +
                (
                    getCompilerFlag("final") ? "" :
                        " if (p - tape > " + getCompilerFlag("tape-size") + ") {puts(dbgString); return 1;}"
                ) +
                (getCompilerFlag("heap-memory") ? " while (p > size) {size++; (*size) = 0;}" : "")
            );
        },
    ],
    [ INPUT,
        ({offset}) => `\tp[${offset}] = getchar();`
    ],
    [ OUTPUT,
        ({offset}) => `\tputchar(p[${offset}]);`
    ],
    [ PRINT,
        ({value}) => `\tputs("${value.emit(null)}");`
    ],
    [ SET,
        ({value, offset}) => value ? `\tp[${offset}] = ${value.emit(null)};` : `\tp[${offset}] = 0;`
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
            return "\t" + base + value;
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
            return "\t" + base + value;
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
            return "\t" + base + value;
        }
    ],
    [ CHECK_SET,
        (token) => {
            token.value.forceMatch(Constant, Register);
            return `\tif (p[${token.value.contents[1].emit()}]) p[${token.offset}] = ${token.value.contents[0].emit()};`;
        }
    ],
    [ END,
        () => ""
    ],
    [ WHILE,
        ({contents}, indent) => "\twhile (*p) {\n" + emitTokens(contents, indent + 1) + "}"
    ],
    [
        IF,
        ({contents}, indent) => "\tif (*p) {\n" + emitTokens(contents, indent + 1) + "}"
    ],
]);


let hasMoved = false;


function emitTokens(tokens, indent = 0) {
    return tokens.map((e, i) => {
        if (tokens[i].instr !== SET && tokens[i].instr !== PRINT) {
            hasMoved = true;
        } else if (tokens[i].instr === SET && !hasMoved && tokens[i].value.constant() == 0n) {
            return;
        }
        if (!binding.has(tokens[i].instr)) {
            compilerError("Invalid instruction [%s].", tokens[i].toString());
        }
        return "\t".repeat(indent) + binding.get(tokens[i].instr)(tokens[i], indent);
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
    output += "int main() {\n\t";
    if (getCompilerFlag("heap-memory")) {
        output += "char* tape = malloc(" + getCompilerFlag("tape-size") + ");\n\ttape[0] = 0;\n\tchar* size = tape;\n\t";
    } else {
        output += "char tape[" + getCompilerFlag("tape-size") + "] = {0};\n\t";
    }
    output += "char* p = tape;\n\n";
    output += emitTokens(tokens);
    return output + "\n\n\treturn 0;\n}";
}

module.exports = { emit };