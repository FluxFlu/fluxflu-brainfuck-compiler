function compilerError(error, ...args) {
    if (error.at(-1) != ".") {
        console.error("Internal Compiler Error: Compiler errors must end with a '.'\n");
    }
    console.error("\x1b[1;31mInternal Compiler Error: \x1b[0m" + error, ...args);
    console.trace();
    process.exit(1);
}

function TODO(error) {
    console.error("\x1b[1;31mTODO:\x1b[0m", error);
    console.trace();
    process.exit(2);
}

module.exports = { compilerError, TODO };