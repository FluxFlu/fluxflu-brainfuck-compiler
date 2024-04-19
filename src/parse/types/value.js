

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
        if (this.runtime.length == 0) {
            return this.constant;
        }
    }
}

class Constant extends ValueBase {
    constructor(data) {
        this.data = data;
    }
}

module.exports = { Value, Constant };