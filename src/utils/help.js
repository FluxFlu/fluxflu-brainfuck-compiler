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

  --help -h                                         Display help message.

  -O0                                               Don't optimize code.
  -O1                                               Apply the default optimizations.
  -O2                                               Apply extra optimizations.

  --final                                           Don't include debug checks.
  --heap-memory                                     Put the tape on the heap.

  --slow-optimize                                   Many checks are in place to prevent
                                                    the optimize from running for too long.
                                                    This flag removes those checks.

  --output -o   <filename>                          Specify output filename.

  --tape-size   <size>                              Specify tape size.
                                                    Must be a positive integer.

                                   File Input
--------------------------------------------------------------------------------
  Input                                             Description
--------------------------------------------------------------------------------

  <filename>                                        The input filename
`;