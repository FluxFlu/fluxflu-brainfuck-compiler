const { compilerError } = require("../error/internal_compiler_error");
const { PLUS, MINUS, LEFT, RIGHT, WHILE, INPUT, OUTPUT, SET, RELATIVE_PLUS, RELATIVE_MINUS, END, CHECK_SET, RELATIVE_SET, IF, START_LOOP, END_LOOP, CONST_PRINT, STILL_WHILE, SCAN_LEFT, SCAN_RIGHT } = require("../types/instructions");
const { Constant, Register, StringConstant } = require("../types/value");
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
        ({value}) =>
            `\tp -= ${value.emit(null)};` +
            (getCompilerFlag("final") ? "" :
                " if (p < tape) {puts(dbgString); return 1;}")
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
    [ CONST_PRINT,
        ({value}) => {
            value.forceMatch(StringConstant);
            return `\tfputs(${value.emit(null)}, stdout);`;
        }
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
            token.value.forceMatch(Constant, Register, Constant);
            return `\tif (${token.value.contents[0].emit()} + p[${token.value.contents[1].emit()}]) p[${token.offset}] = ${token.value.contents[2].emit()};`;
        }
    ],
    [ SCAN_LEFT,
        (token) => {
            token.value.forceMatch(Constant);
            if (token.value.constant() === 1n) {
                return "\tif (!gnu) { p = (char*)((char*)(memrchr(tape, 0, p - tape + 1))); } else { while (*p) { p--; }; };";
            } else {
                return `\twhile (*p) { p -= ${token.value.constant()}; };`;
            }
        }
    ],
    [ SCAN_RIGHT,
        (token) => {
            token.value.forceMatch(Constant);
            if (token.value.constant() === 1n) {
                return "\tp = (char*)(memchr(p, 0, sizeof(tape)));";
            } else {
                return `\twhile (*p) { p += ${token.value.constant()}; };`;
            }
        }
    ],
    [ END,
        () => ""
    ],
    [ START_LOOP,
        () => "\twhile (*p) {\n"
    ],
    [ END_LOOP,
        () => "}"
    ],
    [ WHILE,
        ({contents}, indent) => "\twhile (*p) {\n" + emitTokens(contents, indent + 1) + "}"
    ],
    [ STILL_WHILE,
        ({contents, offset}, indent) => {
            return "\twhile (p[" + offset + "]) {\n" + emitTokens(contents.map(token => {
                token = token.copy();
                token.offset += offset;
                return token;
            }), indent + 1) + "}";
        }
    ],
    [
        IF,
        ({contents}, indent) => "\tif (*p) {\n" + emitTokens(contents, indent + 1) + "}"
    ],
]);


function emitTokens(tokens, indent = 0) {
    return tokens.map((e, i) => {
        if (!binding.has(tokens[i].instr)) {
            compilerError("Invalid instruction [%s].", tokens[i].toString());
        }
        return "\t".repeat(indent) + binding.get(tokens[i].instr)(tokens[i], indent);
    }).join("\n");
}

function emit(tokens) {
    let output = "";
    output += (
        "#ifdef __GNUC__\n" +
        "\t#define _GNU_SOURCE\n" +
        "\tconst int gnu = 1;\n" +
        "#else\n" +
        "\tconst int gnu = 0;\n" +
        "#endif\n"
    );
    output += "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n";
    if (!getCompilerFlag("final")) {
        output += "const char* dbgString = \"" + RED + "Runtime Error:" + RESET + " Moved further than the tape allows. You can extend the length of the tape using " + BOLD_BLUE + "--tape-size {number}" + RESET + "\\n\";\n";
    }
    output += "\nint main() {\n";
    if (!tokens.static) {
        if (getCompilerFlag("heap-memory")) {
            output += "\tchar* tape = malloc(" + getCompilerFlag("tape-size") + ");\n\ttape[0] = 0;\n\tchar* size = tape;\n\t";
        } else {
            output += "\tchar tape[" + getCompilerFlag("tape-size") + "] = {0};\n\t";
        }
        output += "char* p = tape;\n\n";
    }
    output += emitTokens(tokens);
    return output + (tokens.static ? "" : "\n") + "\n\treturn EXIT_SUCCESS;\n}";
}

module.exports = { emit };