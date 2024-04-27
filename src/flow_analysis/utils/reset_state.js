const { Constant } = require("../../types/value");
const { Single } = require("../simulation_types");


function resetState(state) {
    state.iteration++;
    state.tape.reset();
    state.ptr = new Single(new Constant(0n));
    state.positionCompromised = true;
}

module.exports = { resetState };