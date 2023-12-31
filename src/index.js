#!/usr/bin/env node

const fs = require("fs");
const { compile } = require("./compile");
const { handleArguments, getCompilerFlag } = require("./utils/compiler_flags");
const { RED, RESET, BLUE } = require("./utils/colors");

const errors = {
    "too_many_O": () => `Too many ${BLUE}-O{number}${RESET} flags passed.`
};

function logError (error, ...args) {
    console.error(RED + "Error[" + error + "]: " + RESET + errors[error].apply(null, args));
    process.exit(1);
}

function main() {
    const filename = handleArguments(process.argv);
    if (+getCompilerFlag("O0") + +(getCompilerFlag("O1") || false) + +getCompilerFlag("O2") > 1)
        logError("too_many_O");

    const targetFilename = filename.includes(".") ? filename.slice(0, filename.lastIndexOf(".")) + ".c" : filename + ".c";
    fs.writeFileSync(targetFilename, compile(fs.readFileSync(filename, "utf-8")));
}

main();