const { RESET, GREEN, BOLD_BLUE, BOLD_WHITE } = require("../utils/colors");

const note  = `${BOLD_WHITE}Note: ${RESET}`;
const help  = `${BOLD_BLUE}Help: ${RESET}`;
const quote = `${GREEN}* ${RESET}`;

module.exports = { note, help, quote }