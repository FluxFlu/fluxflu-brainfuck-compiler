module.exports = `
                            FluxFlu Brainfuck Compiler
--------------------------------------------------------------------------------
  Usage
--------------------------------------------------------------------------------
  fbc [--options] <filename>

                                Available options
--------------------------------------------------------------------------------
  Options                                           Description
--------------------------------------------------------------------------------

  --help -h                                         Display help message

  --full-optimize -f                                Apply all optimization levels
  --final                                           Don't include debug in runtime
  --heap-memory                                     Put the tape on the heap

  --output -o   <filename>                          Specify output filename

  --tape-size   <size>                              Specify tape size.
                                                    Must be a positive integer.

                                   File Input
--------------------------------------------------------------------------------
  Input                                             Description
--------------------------------------------------------------------------------

  <filename>                                        The input filename
`;