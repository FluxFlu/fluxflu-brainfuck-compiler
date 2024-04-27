const { Constant } = require("../../types/value");
const { Single, Unknown } = require("../simulation_types");

class Tape {
    constructor(state, arr) {
        this.state = state;
        this.arr = arr || [];
    }
    toString() {
        return "[" + this.arr.map(e => e.format()).join(", ") + "]";
    }
    reset() {
        this.arr.length = 0;
    }
    push(value) {
        this.arr.push(value);
    }
    uptick(index) {
        if (index < 0n) {
            while (index < 0n) {
                this.arr.unshift(undefined);
                this.state.ptr = this.state.ptr.modify(e => new Constant(e.data + 1n));
                index++;
            }
        }
        return index;
    }
    set(index, value) {
        index = this.uptick(index);
        this.arr[index] = value;
    }
    get(index) {
        index = this.uptick(index);
        this.arr[index] ||= this.state.positionCompromised ? new Unknown() : new Single(new Constant(0n));
        return this.arr[index];
    }
    apply(index, fn) {
        index = this.uptick(index);
        this.arr[index] ||= this.state.positionCompromised ? new Unknown() : new Single(new Constant(0n));
        this.arr[index] = fn(this.arr[index]);
    }
    forEach(fn) {
        this.arr.forEach((value, index, array) => fn(value, index, array));
    }
}

module.exports = { Tape };