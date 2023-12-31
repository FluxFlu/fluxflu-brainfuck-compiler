const { RESET, RED, BOLD_BLUE } = require("../utils/colors");
const { getCompilerFlag } = require("../utils/compiler_flags");


const binding = [
    null,
    /* PLUS         */ value => (value > 1) ? `*p += ${value};` : "(*p)++;",
    /* MINUS        */ value => (value > 1) ? `*p -= ${value};` : "(*p)--;",
    /* LEFT         */ value => (value > 1) ? `if (p - ${value} > tape) p -= ${value}; else p = tape;` : "if (p > tape) p--;",
    /* RIGHT        */ value => {
        return (
            (
                (value > 1) ?
                    `p += ${value};`
                    : "p++;"
            )
            +
            (
                getCompilerFlag("final") ? "" :
                    "\nif (p - tape > " + getCompilerFlag("tape-size") + ") { fputs(\"" + RED + "Runtime Error:" + RESET + " Moved further than the tape allows. You can extend the length of the tape using " + BOLD_BLUE + "--tape-size {number}" + RESET + "\\n\", stdout); return 1; }"
            )
        );
    },
    /* START_LOOP   */ () => "while (*p) {",
    /* END_LOOP     */ () => "}",
    /* INPUT        */ () => "(*p) = getchar();",
    /* OUTPUT       */ () => "putchar(*p);",
    /* PRINT        */ value => `fputs("${value}", stdout);`,
    /* SET          */ value => value ? `(*p) = ${value};` : "(*p) = 0;",
    /* CREATE_STATE */ value => {
        const tape = value.tape;
        const keys = Object.keys(tape);
        return (
            // Set each part of the tape to expected values
            keys.map(byte => `p[${byte}] = ${tape[byte]};\n`).join("") +
            // Set the pointer location
            (value.set ?
                "p = tape + " + value.ptr + ";\n"
                :   (value.ptr ?
                    "p += " + value.ptr + ";\n"
                    : "")
            )
        );
    }
];

function finalize (file) {
    let output = "#include <stdio.h>\n\nint main() {\nchar tape[" + getCompilerFlag("tape-size") + "] = {0};\nchar *p = tape;\n\n";
    for (let i = 0; i < file.length; i++) {
        output += binding[file[i].instr](file[i].value, i) + "\n";
    }
    return output + "\nreturn 0;\n}";
}

module.exports = { finalize };