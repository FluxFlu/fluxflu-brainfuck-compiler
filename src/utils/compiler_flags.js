const { logError } = require("../error/log_error");

const shorthand = new Map([
    ["o", "output"],
]);

const flags = new Map([
    ["heap-memory", false],
    ["final", false],
    ["output", ""],
    ["filename", ""],
    ["raw", false],
    ["colors", false],
    
    ["tape-size", "3000"],
]);

// These flags consume a value.
const flagConsumes = new Map([
    "tape-size", "output"
].map(e => [e, true]));

const wasSpecified = new Map();

let filename;
const getFilename = () => filename;

const getCompilerFlag = flag => flags.get(flag);

function handleArguments(args) {
    if (args.includes("--help") || args.includes("-h")) {
        console.log(require("./help"));
        process.exit(0);
    }

    args.shift();
    args.shift();
    let argument;
    while (argument = args.shift()?.toLowerCase()) {

        if (argument[0] == "-") {
            argument = argument.slice(1);
        } else {
            // If the first character isn't a dash, then this argument must be the input filename.

            // If a filename was already specified, throw an error.
            if (filename) {
                logError("filename_overlap", filename, argument);
            }
            filename = argument;
            flags.set("filename", argument);
            continue;
        }


        if (argument[0] == "-") {
            argument = argument.slice(1);
        } else {
            // If there is only one dash, assume a shorthand is being used.
            if (shorthand.has(argument)) {
                argument = shorthand.get(argument);
            } else {
                // But if said shorthand doesn't exist, throw an error.
                logError("invalid_arguments", "-" + argument);
            }
        }

        // If this argument consumes a value...
        if (flagConsumes.has(argument)) {
            
            // If there is no value, or the "value" is just another flag, throw an error
            if (args.length === 0 || args[0][0] == "-") {
                logError("no_argument_value", "--" + argument, flags.get(argument), args[0]);
            }

            // Check to make sure that the tape size is a positive integer.
            if (argument == "tape-size") {
                if (~~+args[0] !== +args[0]) {
                    logError("invalid_tape_size", args[0]);
                }
                args[0] = (+args[0]).toString();
            }

            // If this argument was already specified, throw an error.
            if (wasSpecified.has(argument)) {
                logError("re_specified", argument);
            }
            wasSpecified.set(argument, true);

            flags.set(argument, args.shift());
        } else if (flags.has(argument) && argument !== "filename") {
            
            // If this argument was already specified, throw an error.
            if (wasSpecified.has(argument)) {
                logError("re_specified", argument);
            }
            wasSpecified.set(argument, true);

            flags.set(argument, true);
        } else {
            // Sometimes, users will use `=` to try and specify argument values. Eg, `--tape-size=3000`.
            // If this is the case, we must inform them of the correct syntax.
            if (argument.split("=").length > 1) {
                argument = argument.split("=");
                if (flags.has(argument[0])) {
                    logError("invalid_arguments", "--" + argument.join("="), "--" + argument[0] + " " + argument[1]);
                }
            }

            logError("invalid_arguments", "--" + argument);
        }
    }
    return filename;
}

module.exports = { handleArguments, getFilename, getCompilerFlag };