const { compilerError } = require("./internal_compiler_error");
const { RESET, BOLD_RED } = require("../utils/colors");
const { help } = require("./format");

const errors = {
    "unbalanced_braces": (x, filename) => [
        "Unbalanced Braces at " + filename +
        (x.line === null ? "" :
            (":" + (x.line + 1) + ":" + (x.char + 1))
        )
    ],
    "filename_overlap": (x, filename) => [
        "Specified filename twice: both [" + filename + "] and [" + x + "]."
    ],
    "invalid_arguments": (x, shouldHint) =>
        shouldHint ? [
            "Attempted to pass compiler flag [" + x + "]. This flag does not exist.",
            help + "Did you mean: [" + shouldHint + "]"
        ] :
            [
                "Attempted to pass compiler flag [" + x + "]. This flag does not exist."
            ]
    ,
    "no_argument_value": (x, def, y) =>
        y ? [
            "Attempted to pass compiler flag [" + x + "] but instead of providing a value (such as default value [" + def + "]), provided [" + y + "]."
        ] :
            [
                "Attempted to pass compiler flag [" + x + "] but instead of providing a value (such as default value [" + def + "]), provided nothing."
            ],
    "invalid_tape_size": size => [
        "Invalid tape size specified [" + size + "]. Tape size must be a positive integer."
    ],
    "re_specified": argument => [
        "Argument [" + argument + "] specified multiple times."
    ],
    "no_filename": () => [
        "No filename specified."
    ],
    "file_not_exist": filename => [
        "Specified file [" + filename + "] doesn't exist."
    ]
};

function logError(error, ...args) {
    if (!errors[error]) {
        compilerError("Invalid Error [%s].", error);
        return;
    }
    const errorText = errors[error].apply(null, args);
    console.error(BOLD_RED + "Error[" + error + "]: " + RESET + errorText.join("\n\n"));
    console.error("\nAborting...");
    process.exit(1);
}

module.exports = { logError };