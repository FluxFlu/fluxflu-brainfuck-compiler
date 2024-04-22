const { compilerError } = require("../error/internal_compiler_error");
const { ValueType } = require("../types/value");

class SimValue {
    constructor() {}
    add() {
        compilerError("Invalid SimValue `add`.");
    }
    modify() {
        compilerError("Invalid SimValue `modify`.");
    }
}

class Single extends SimValue {
    constructor(value) {
        super();
        if (!(value instanceof ValueType) || value === undefined) {
            compilerError("Invalid value in SimConstant [%o].", value);
        }
        this.value = value;
    }
    add(fn) {
        return new Union(this.value, fn(this.value));
    }
    modify(fn) {
        return new Single(fn(this.value));
    }
}

class Union extends SimValue {
    constructor(...values) {
        super();
        if (!values.every(e => e instanceof ValueType)) {
            compilerError("Invalid values in Union %o.", values);
        }
        this.values = new Set(values);
    }
    add(fn) {
        let values = [];
        this.values        .forEach(value => values.push(value));
        Array.from(this.values).map(fn).forEach(value => values.push(value));
        values = values.filter((e, i) => (i == values.length - 1) || !(e.equals(values[i + 1])));
        if (values.length > Unknown.NumPossibleValues) {
            return new Unknown();
        }
        return new Union(...values);
    }
    modify(fn) {
        return new Union(this.values.map(fn));
    }
}

class Unknown extends SimValue {
    static NumPossibleValues = 4;
    constructor() {
        super();
    }
    add() {}
    modify() {}
}

module.exports = { Single, Union, Unknown };