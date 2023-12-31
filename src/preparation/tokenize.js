
const operators = new Map(
    "+-<>[],."
        .split("")
        .map(e => [e, true])
);

function tokenize(file) {
    file = file
        .replaceAll("\t", "    ")
        .replaceAll("\r\n", "\n")
        .replaceAll("\n\r", "\n")
        .replaceAll("\r", "\n");
    // .replaceAll(/\/\/.*?$/gm, "")
    // .replaceAll(/\;\;.*?$/gm, "")
    const tokens = [];
    let currentString;
    let line = 0;
    let char = 0;
    for (let i = 0; i < file.length; i++) {
        if (file[i] == "\n") {
            line++;
            char = 0;
            continue;
        }
        if (file[i] == " ") {
            char++;
            continue;
        }
        currentString = "";

        if (!operators.get(file[i]))
            continue;

        let charIncreaseCount = 0;
        while (file[i] != " " && file[i] != "\n" && operators.get(currentString + file[i])) {
            currentString += file[i++];
            charIncreaseCount++;
        }
        i--;
        tokens.push({type: "Operator", value: currentString.trim(), line, char});
        char += charIncreaseCount;
    }
    return tokens;
}

module.exports = { tokenize };