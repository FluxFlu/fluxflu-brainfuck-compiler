#!/usr/bin/env node

const fs = require("fs");
const { compile } = require("./compile");
const { handleArguments, getCompilerFlag } = require("./utils/compiler_flags");
const { logError } = require("./error/log_error");

function main() {
    const filename = handleArguments(process.argv);

    if (!filename)
        logError("no_filename");

    if (!fs.existsSync(filename))
        logError("file_not_exist", filename);

    // If the output was not specified, we generate a file by replacing the original file extension (if there is one) with ".c"
    const targetFilename = getCompilerFlag("output") || (filename.includes(".") ? filename.slice(0, filename.lastIndexOf(".")) + ".c" : filename + ".c");
    
    fs.writeFileSync(targetFilename, compile(fs.readFileSync(filename)));
}

main();