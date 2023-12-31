#!/usr/bin/env node

const fs = require("fs");
const { compile } = require("./compile");
const { handleArguments, getCompilerFlag } = require("./utils/compiler_flags");

function main() {
    const filename = handleArguments(process.argv);

    // If the output was not specified, we generate a file by replacing the original file extension (if there is one) with ".c"
    const targetFilename = getCompilerFlag("output") || (filename.includes(".") ? filename.slice(0, filename.lastIndexOf(".")) + ".c" : filename + ".c");
    fs.writeFileSync(targetFilename, compile(fs.readFileSync(filename, "utf-8")));
}

main();