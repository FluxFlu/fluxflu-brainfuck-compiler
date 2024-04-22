const { compilerError } = require("../error/internal_compiler_error");


class Value {
    constructor(...contents) {
        if (!contents?.length || !(contents instanceof Array) || !contents.every(e => e instanceof ValueType)) {
            compilerError("Invalid value contents [%o].", contents.map(e => e.format()).join(", "));
        }
        this.contents = contents;
    }
    equals(value) {
        return this.contents.length == value.contents.length && this.contents.every((e, i) => e.equals(value.contents[i]));
    }
    toString() {
        compilerError("Cannot use `toString` of Value. Use `emit` instead.");
    }
    emit(operation) {
        operation = " " + operation + " ";
        return this.contents.map(e => e.emit ? e.emit(operation) : e.toString()).join(operation);
    }
    constant() {
        if (this.contents.length === 1 && this.contents[0] instanceof Constant) {
            return this.contents[0].data;
        } else {
            compilerError("Invalid call to `constant` of Value [%o]. Note that `constant` cannot be called unless it is presupposed that the value is a constant.", this);
        }
    }
    match(...args) {
        return this.contents.length == args.length && this.contents.every((e, i) => e instanceof args[i]);
    }
    forceMatch(...args) {
        if (!this.match(...args)) {
            compilerError("Force match failed.");
        }
    }
}

class ValueType {
    constructor(data) {
        this.data = data;
    }
    toString() {
        compilerError("Cannot use `toString` of ValueType. Use `emit` or `format` instead.");
    }
}

class Constant extends ValueType {
    constructor(data) {
        if (typeof data == "number") {
            compilerError("Use of `number` disallowed. Use `bigint` instead.");
        }
        super(data);
    }
    emit() {
        if (this.data == null) {
            return "null";
        } else {
            return this.data.toString();
        }
    }
    format() {
        if (this.data == null) {
            return "$null";
        } else {
            return "$" + this.data.toString();
        }
    }
    equals(constant) {
        if (!(constant instanceof ValueType)) {
            compilerError("Invalid check if Constant is equal to [%o].", constant);
        }
        if (!(constant instanceof Constant)) {
            return false;
        }
        return this.data == constant.data;
    }
}

class Register extends ValueType {
    constructor(data) {
        if (typeof data == "number") {
            compilerError("Use of `number` disallowed. Use `bigint` instead.");
        }
        super(data);
    }
    emit() {
        return this.data.toString();
    }
    format() {
        return "%" + this.data.toString();
    }
    equals(constant) {
        if (!(constant instanceof ValueType)) {
            compilerError("Invalid check if Register is equal to [%o].", constant);
        }
        if (!(constant instanceof Register)) {
            return false;
        }
        return this.data == constant.data;
    }
}

module.exports = { Value, ValueType, Constant, Register };