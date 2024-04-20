const { compilerError } = require("../../error/internal_compiler_error");


class ValueBase {
    constructor() {}
}

class Value extends ValueBase {
    constructor(constant, runtime) {
        super();
        this.constant = constant;
        this.runtime = runtime;
    }
    isConstant(constant) {
        return this.constant == constant && this.runtime.length == 0;
    }
    equals(value) {
        return this.constant == value.constant && this.runtime.length == value.runtime.length && this.runtime.every((e, i) => e == value.runtime[i]);
    }
    toString() {
        compilerError("Cannot use `toString` of Value. Use `emit` instead.");
    }
    emit(operation) {
        const constant =
            this.constant.emit
                ? this.constant.emit(operation)
                : this.constant.toString();
        operation = " " + operation + " ";
        if (this.runtime.length == 0) {
            return constant;
        } else if (constant === "0") {
            return "(" + this.runtime.map(e => "p[" + e + "]").join(operation) + ")";
        } else {
            return `(${constant}${operation}${this.runtime.map(e => "p[" + e + "]").join(operation)})`;
        }
    }
}

class Constant extends ValueBase {
    constructor(data) {
        super();
        this.data = data;
    }
}

module.exports = { Value, Constant };