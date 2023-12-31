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
  --raw                                             Disallow C interop
  --final                                           Don't include debug in runtime
  --output -o   <filename>                          Specify output filename

  --tape-size   <size>                              Specify tape size.
                                                    Must be either a positive int
                                                    or "Dynamic".

                                   File Input
--------------------------------------------------------------------------------
  Input                                             Description
--------------------------------------------------------------------------------

  <filename>                                        The input filename
`;