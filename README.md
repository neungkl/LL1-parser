LL1 Parser
===

[![Build Status](https://travis-ci.org/neungkl/LL1-parser.svg?branch=web)](https://travis-ci.org/neungkl/LL1-parser)
[![codecov](https://codecov.io/gh/neungkl/LL1-parser/branch/web/graph/badge.svg)](https://codecov.io/gh/neungkl/LL1-parser)

*This project associated with 2110316 Programming Language study class.*

LL1 Parser is web-application that parse custom language into context-free grammar with error detecting.

The project aiming for convert the [LL1 context-free grammars](https://en.wikipedia.org/wiki/LL_parser)
to *First Set*, *Follow Set* and *Parsing table*, and scanner
for parsing the given tokens to following grammar
to check, is it the tokens correct. Follows by the **LL1 Parser algorithm**

## Demo

:point_right: [https://neungkl.github.io/LL1-parser/](https://neungkl.github.io/LL1-parser/)

## Features

- Included 3 examples.
- Check if the grammar is correct.
- Convert LL1 grammar to First Set, Follow Set, and Parsing Table
- Parser provided with error checking functional.
- Grammar tree provided.

## Usage

**Build The Project**

Run following command.

```
npm install -g mocha grunt
npm install
npm run-script build
```

Then, open `index.html`

**Testing**

```
# Basic test
npm run-script test

# With coverage report
npm run-script test-cov
```

## License

[MIT](LICENSE) © Kosate Limpongsa
