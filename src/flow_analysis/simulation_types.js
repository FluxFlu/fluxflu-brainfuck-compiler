const { compilerError } = require("../error/internal_compiler_error");
const { ValueType } = require("../types/value");
const { getCompilerFlag } = require("../utils/compiler_flags");

class SimValue {
    constructor() {}
    add() {
        compilerError("Invalid SimValue `add`.");
    }
    modify() {
        compilerError("Invalid SimValue `modify`.");
    }

    toString() {
        compilerError("Cannot call `toString` of SimValue. Use `format` instead.");
    }
    format() {
        compilerError("Invalid SimValue `format`.");
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
        if (this.value.equals(fn(this.value))) {
            return this;
        }
        return new Union(this.value, fn(this.value));
    }
    modify(fn) {
        return new Single(fn(this.value));
    }
    format() {
        return this.value.format();
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
        this.values                    .forEach(value => values.push(value));
        Array.from(this.values).map(fn).forEach(value => values.push(value));
        values = values.filter((e, i) => (i == values.length - 1) || !(e.equals(values[i + 1])));
        if (values.length > Unknown.NumPossibleValues) {
            return new Unknown();
        }
        if (values.length == 1) {
            return new Single(values[0]);
        }
        return new Union(...values);
    }
    modify(fn) {
        let values = Array.from(this.values).map(fn);
        values = values.filter((e, i) => (i == values.length - 1) || !(e.equals(values[i + 1])));
        if (values.length == 1) {
            return new Single(values[0]);
        }
        return new Union(...values);
    }
    every(fn) {
        return Array.from(this.values).every(fn);
    }
    format() {
        return Array.from(this.values).map(e => e.format()).join(" | ");
    }
}

class Unknown extends SimValue {
    static NumPossibleValues = getCompilerFlag("slow-optimize") ? 6 : 4;
    constructor() {
        super();
    }
    add() {
        return this;
    }
    modify() {
        return this;
    }
    format() {
        return "⊤";
    }
}

module.exports = { Single, Union, Unknown };