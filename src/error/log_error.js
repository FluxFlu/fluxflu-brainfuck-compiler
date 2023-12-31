

const errors = {
    "generic": x => [
        x
    ],
    "unbalanced_parenthesis": (x, filename) => [
        "Unbalanced Parenthesis at " + filename +
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
    ]
};

function logError(error, ...args) {
    if (!errors[error]) {
        logCompilerError("invalid_error", null, error);
        return;
    }
    const errorText = errors[error].apply(null, args);
    console.error(BOLD_RED + "Error[" + error + "]: " + RESET + errorText.join("\n\n"));
    console.error("\nAborting...");
    process.exit(1);
}

module.exports = { logError };

const { RESET, BOLD_RED } = require("../utils/colors");
const { getCompilerFlag } = require("../utils/compiler_flags");
const { logCompilerError } = require("./compiler_error");
const { help } = require("./format");

