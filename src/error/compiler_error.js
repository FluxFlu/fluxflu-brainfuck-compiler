const { note } = require("./format");

const compilerErrors = {
    "generic": x => [
        "An error in the compiler has occured" + (x ? ": \"" + x + "\"" : ".")
    ],
    "invalid_error": errorTag => [
        `Attempted to throw invalid error "${errorTag}".`,
    ],
};

const reportErrorLink = "https://github.com/FluxFlu/fbc/issues";

function logCompilerError(error, originalThrow, ...args) {
    console.error("\x1b[1;31mCompilerError[" + error + "]: \x1b[0m" + compilerErrors[error].apply(null, args).join("\n\n") + "\n\n" + note + `Please report this error at ${reportErrorLink}`);
    console.trace();
    console.log("\nAborting...\n");
    if (originalThrow)
        throw originalThrow;
    else
        process.exit(1);
}

module.exports = { logCompilerError };