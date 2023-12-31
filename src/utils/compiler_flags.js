

const flags = new Map([
    ["O0", false],
    ["O1", false],
    ["O2", false],
    ["tape-size", "3000"],
    // "regular-brainfuck": false,
    ["final", false],
]);

const flagConsumes = new Map([
    "tape-size"
].map(e => [e, true]));

function handleArguments(args) {
    args.shift();
    args.shift();
    let filename;
    let argument;
    while (argument = args.shift()) {
        if (argument[0] == "-")
            argument = argument.slice(1);
        if (argument[0] == "-")
            argument = argument.slice(1);

        if (flagConsumes.has(argument)) {
            flags.set(argument, args.shift());
        } else if (flags.has(argument)) {
            flags.set(argument, true);
        } else {
            filename = argument;
        }
    }
    return filename;
}

const getCompilerFlag = flag => flags.get(flag);

module.exports = { handleArguments, getCompilerFlag }