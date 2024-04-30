const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const fileNames = fs.readdirSync(path.join(__dirname, "/test_programs")).filter(e => path.extname(e) == ".bf");

let out = [];

const maxFilenameSize = fileNames.reduce((a, b) => a.length > b.length ? a : b).length - 2;

let isFailure = false;

function padTestId(test) {
    let str = "";
    let num = maxFilenameSize - test.length + (isFailure ? 3 : 0);
    while (num--)
        str += " ";
    return " " + test + str;
}

function endLog() {
    for (let i = 0; i < out.length; i++) {
        out[i]();
    }
    if (!isFailure) {
        console.error("\n\n\x1b[7m " + out.length + " \x1b[0;44m TESTS PASSING \x1b[0m");
    }
}

function logSuccess(test) {
    console.error("\x1b[0;44m TEST PASSED \x1b[0m\x1b[7m" + padTestId(test) + "​\x1b[0m");
}

function logFailure(test, expected, received) {
    console.error("\x1b[0;44m TEST FAILED \x1b[0m\x1b[0;41m" + padTestId(test) + "​\x1b[0m");
    expected = expected.replaceAll("\r\n", "\n").replaceAll("\n\r", "\n").replaceAll("\r", "\n").split("\n");
    received = received.replaceAll("\r\n", "\n").replaceAll("\n\r", "\n").replaceAll("\r", "\n").split("\n");
    for (let i = 0; i < expected.length || i < received.length; i++) {
        if (!expected[i]) {
            console.error("    " + (i + 1) + " - \x1b[0;41m\\n\x1b[0m");
            continue;
        } else if (!received[i]) {
            console.error("    " + (i + 1) + " + \x1b[0;42m\\n\x1b[0m");
            continue;
        }

        if (expected[i] !== received[i]) {
            let gStr = "";
            let bStr = "";
            for (let j = 0; j < expected[i].length || j < received[i].length; j++) {
                if (expected[i][j] === received[i][j]) {
                    gStr += expected[i][j];
                    bStr += expected[i][j];
                } else {
                    if (expected[i][j])
                        gStr += "\x1b[0;42m" + expected[i][j] + "\x1b[0m";
                    if (received[i][j])
                        bStr += "\x1b[0;41m" + received[i][j] + "\x1b[0m";
                }
            }
            console.error("    " + (i + 1) + " - " + bStr);
            console.error("    " + (i + 1) + " + " + gStr);
        }
    }
    console.error("");
}

function handleFile(i) {
    const fileName = fileNames[i].slice(0, -3);
    const filePath = path.join("./test/test_programs/", fileName);
    if (fs.existsSync(filePath + ".c"))
        fs.rmSync(filePath + ".c", { force: true });
    if (fs.existsSync(filePath + ".exe"))
        fs.rmSync(filePath + ".exe", { force: true });
    const nodeArgs = [path.normalize("./src/fbc.js"), "--final", "--slow-optimize", "-O2", filePath + ".bf"];
    const nodeProcess = childProcess.spawn("node", nodeArgs, {
        shell: true,
        windowsHide: true,
        stdio: [
            "ignore",
            "ignore",
            "inherit"
        ]
    });
    nodeProcess.on("exit", () => {
        const ccProcess = childProcess.spawn("cc", [filePath + ".c", "-o", filePath + ".exe"], {
            shell: true,
            windowsHide: true,
            stdio: [
                "ignore",
                "ignore",
                "inherit"
            ]
        });
        ccProcess.on("exit", () => {
            const exeProcess = childProcess.spawn("." + path.sep + filePath + ".exe", {
                shell: true,
                windowsHide: true,
                stdio: [
                    "pipe",
                    "pipe",
                    "inherit"
                ],
                encoding: "utf-8",
            });
            let data = "";
            exeProcess.stdout.on("data", chunk => {
                data += chunk.toString();
                if (data.length > 1000) {
                    data = data.slice(0, 50);
                    exeProcess.kill("SIGTERM");
                    i = fileNames.legth - 1;
                }
            });
            if (fs.existsSync(filePath + ".in"))
                fs.createReadStream(filePath + ".in").pipe(exeProcess.stdin);
            exeProcess.on("exit", () => {
                const expected = fs.readFileSync(filePath + ".out", "utf-8");
                const success = data === expected;
                if (success) {
                    out.push(() => logSuccess(fileName));
                } else {
                    isFailure = true;
                    out.push(() => logFailure(fileName, expected, data));
                }
                fs.rmSync(filePath + ".c", { force: true });
                fs.rmSync(filePath + ".exe", { force: true });
                if (i + 1 < fileNames.length) {
                    handleFile(i + 1);
                } else {
                    endLog();
                }
            });
        });
    });
}

handleFile(0);