# FluxFlu Brainfuck Compiler
> The only brutally optimizing brainfuck compiler.

![Endpoint Badge](https://img.shields.io/npm/dt/fbc)
![Static Badge](https://img.shields.io/badge/License-GPL--3.0-blue)

# CLI Installation
Pre-built binaries for FBC can be downloaded at [the releases page](https://github.com/FluxFlu/fbc/releases/).

It can also be installed using the NPM as follows.

```sh
$ npm i @fluxflu/bc -g
```

# Module Installation
FBC can also be used as a Node.js module that programs can include. This can be done as normal.

```sh
$ npm i @fluxflu/bc
```

# Usage
FBC is run with the syntax `fbc [file.bf] options`.

```sh
$ fbc mandelbrot.bf --compress
```

# Licensing

FBC is licensed under the [GPL-3.0](https://github.com/FluxFlu/fbc/blob/main/LICENSE). A copy is included with the compiler.