const fs = require("fs");
const path = require("path");
const { compile } = require("./compile");

const testDir = path.join(__dirname, "../test_programs");

jest.mock("./utils/compiler_flags");

const mockflags = new Map([
    ["full-optimize", true],
    ["tape-size", "3000"],
    ["final", true],
]);

jest.mock("./utils/compiler_flags", () => {
    const originalModule = jest.requireActual("./utils/compiler_flags");

    return {
        __esModule: true,
        ...originalModule,
        getCompilerFlag: (flag) => mockflags.get(flag),
        defineRuntimeTypes: () => {},
    };
});

function capitalize(str) {
    return str.split("_").map(e => {
        return e[0].toUpperCase() + e.slice(1);
    }).join(" ");
}

function removeDelimiter(str) {
    return str.replaceAll("\n", "").replaceAll("\r", "");
}

fs.readdirSync(testDir).filter(e => e.slice(-3) == ".bf").forEach(file => {
    const fileName = capitalize(file.slice(0, -3));
    test("Sample Program: " + fileName, () => {
        expect(removeDelimiter(compile(fs.readFileSync(path.join(testDir, file), "utf-8")))).toBe(removeDelimiter(fs.readFileSync(path.join(testDir, file.slice(0, -3) + ".c"), "utf-8")));
    });
});