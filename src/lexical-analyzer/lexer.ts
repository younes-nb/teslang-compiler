import moo from 'moo';

export const lexer = moo.states({
  main: {
    comment: /\/\/.*?$/,
    number: {match: /0|[+-][1-9][0-9]*|[1-9][0-9]*/},
    identifier: {
      match: /[a-zA-Z_][a-zA-Z_0-9]*/,
      type: moo.keywords({
        keyword: [
          'function',
          'for',
          'while',
          'of',
          'if',
          'else',
          'return',
          'let',
          'Number',
          'List',
          'Null',
        ],
      }),
    },
    lparen: '(',
    rparen: ')',
    lbrace: '{',
    rbrace: '}',
    lbracket: '[',
    rbracket: ']',
    colon: ':',
    semicolon: ';',
    comma: ',',
    equality: '==',
    lessThanEqual: '<=',
    greaterThanEqual: '>=',
    notEqual: '!=',
    arrow: '=>',
    and: '&&',
    or: '||',
    ternary: '?',
    not: '!',
    lessThan: '<',
    greaterThan: '>',
    assignment: '=',
    arithmetic: ['+', '-', '*', '/', '%'],
    ws: /[ \t]+/,
    nl: {match: /[\n\r]/, lineBreaks: true},
  },
});
