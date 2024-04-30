
const escapeMap = new Map([
    ["\n", "\\n"],
    ["\t", "\\t"],
    
    ["\0", "\\0"],
    
    ["\f", "\\f"],
    ["\n", "\\n"],
    ["\r", "\\r"],
    ["\t", "\\t"],
    ["\v", "\\v"],

    ["\x07", "\\a"],
    ["\x08", "\\b"],
    ["\x1b", "\\e"],

    ["\"", "\\\""],
]);

function sanitizeStringLiteral(str) {
    return str.split("").map(e => escapeMap.get(e) || e).join("");
}

module.exports = { sanitizeStringLiteral };