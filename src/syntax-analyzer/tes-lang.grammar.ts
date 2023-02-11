// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0];
}

declare let nl: any;
declare let lparen: any;
declare let rparen: any;
declare let colon: any;
declare let arrow: any;
declare let comma: any;
declare let lbrace: any;
declare let rbrace: any;
declare let semicolon: any;
declare let assignment: any;
declare let lbracket: any;
declare let rbracket: any;
declare let not: any;
declare let and: any;
declare let or: any;
declare let greaterThan: any;
declare let greaterThanEqual: any;
declare let lessThan: any;
declare let lessThanEqual: any;
declare let equality: any;
declare let comment: any;
declare let number: any;
declare let identifier: any;
declare let ws: any;

import {lexer} from '../lexical-analyzer/lexer';
import {
  BinaryOperation,
  CallExpression,
  CodeBlock,
  Comment,
  ForLoop,
  FunctionExpression,
  Identifier,
  IfStatement,
  IndexedAccess,
  IndexedAssignment,
  ListLiteral,
  NotExpression,
  NumberSymbol,
  Parameter,
  Return,
  VariableAssignment,
  VariableDefine,
  VariableReference,
  WhileLoop,
  Coordinates,
} from './symbols';

function tokenStart(token: any) {
  return new Coordinates(token.line, token.col - 1);
}

function convertToken(token: any) {
  return {
    type: token.type,
    value: token.value,
    start: tokenStart(token),
  };
}

interface NearleyToken {
  value: any;

  [key: string]: any;
}

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
}

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

type NearleySymbol = string | {literal: any} | {test: (token: any) => boolean};

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
}

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {name: 'input', symbols: ['program'], postprocess: id},
    {name: 'program', symbols: ['statement'], postprocess: data => [data[0]]},
    {
      name: 'program',
      symbols: [
        'statement',
        '_',
        lexer.has('nl') ? {type: 'nl'} : nl,
        '_',
        'program',
      ],
      postprocess: data => [data[0], ...data[4]],
    },
    {
      name: 'program',
      symbols: ['_', lexer.has('nl') ? {type: 'nl'} : nl, 'program'],
      postprocess: data => data[2],
    },
    {name: 'program', symbols: ['_'], postprocess: () => []},
    {name: 'statement', symbols: ['function_expression'], postprocess: id},
    {name: 'statement', symbols: ['line_comment'], postprocess: id},
    {
      name: 'function_expression',
      symbols: [
        {literal: 'function'},
        '__',
        'identifier',
        '_',
        lexer.has('lparen') ? {type: 'lparen'} : lparen,
        '_',
        'parameter_list',
        '_',
        lexer.has('rparen') ? {type: 'rparen'} : rparen,
        '_',
        lexer.has('colon') ? {type: 'colon'} : colon,
        '_',
        'type',
        '_',
        lexer.has('arrow') ? {type: 'arrow'} : arrow,
        '_',
        'code_block',
      ],
      postprocess: data =>
        new FunctionExpression(
          data[2],
          data[12],
          data[6],
          data[16],
          tokenStart(data[0])
        ),
    },
    {
      name: 'function_expression',
      symbols: [
        {literal: 'function'},
        '__',
        'identifier',
        '_',
        lexer.has('lparen') ? {type: 'lparen'} : lparen,
        '_',
        'parameter_list',
        '_',
        lexer.has('rparen') ? {type: 'rparen'} : rparen,
        '_',
        lexer.has('colon') ? {type: 'colon'} : colon,
        '_',
        'type',
        '_',
        lexer.has('arrow') ? {type: 'arrow'} : arrow,
        '_',
        'expression',
      ],
      postprocess: data =>
        new FunctionExpression(
          data[2],
          data[12],
          data[6],
          data[16],
          tokenStart(data[0])
        ),
    },
    {name: 'parameter_list', symbols: [], postprocess: () => []},
    {
      name: 'parameter_list',
      symbols: [
        'identifier',
        '_',
        lexer.has('colon') ? {type: 'colon'} : colon,
        '_',
        'type',
      ],
      postprocess: data => [new Parameter(data[0], data[4], data[0].start)],
    },
    {
      name: 'parameter_list',
      symbols: [
        'identifier',
        '_',
        lexer.has('colon') ? {type: 'colon'} : colon,
        '_',
        'type',
        '_',
        lexer.has('comma') ? {type: 'comma'} : comma,
        '_',
        'parameter_list',
      ],
      postprocess: data => [
        new Parameter(data[0], data[4], data[0].start),
        ...data[8],
      ],
    },
    {
      name: 'code_block',
      symbols: [
        lexer.has('lbrace') ? {type: 'lbrace'} : lbrace,
        'executable_statements',
        lexer.has('rbrace') ? {type: 'rbrace'} : rbrace,
      ],
      postprocess: data => new CodeBlock(data[1], tokenStart(data[0])),
    },
    {name: 'executable_statements', symbols: ['_'], postprocess: () => []},
    {
      name: 'executable_statements',
      symbols: [
        '_',
        lexer.has('nl') ? {type: 'nl'} : nl,
        'executable_statements',
      ],
      postprocess: data => data[2],
    },
    {
      name: 'executable_statements',
      symbols: ['_', 'executable_statement', '_'],
      postprocess: data => [data[1]],
    },
    {
      name: 'executable_statements',
      symbols: [
        '_',
        'executable_statement',
        '_',
        lexer.has('nl') ? {type: 'nl'} : nl,
        'executable_statements',
      ],
      postprocess: data => [data[1], ...data[4]],
    },
    {
      name: 'executable_statement',
      symbols: [
        'return_statement',
        '_',
        lexer.has('semicolon') ? {type: 'semicolon'} : semicolon,
      ],
      postprocess: data => data[0],
    },
    {
      name: 'executable_statement',
      symbols: [
        'var_assignment',
        '_',
        lexer.has('semicolon') ? {type: 'semicolon'} : semicolon,
      ],
      postprocess: data => data[0],
    },
    {
      name: 'executable_statement',
      symbols: [
        'var_define',
        '_',
        lexer.has('semicolon') ? {type: 'semicolon'} : semicolon,
      ],
      postprocess: data => data[0],
    },
    {
      name: 'executable_statement',
      symbols: ['call_statement'],
      postprocess: id,
    },
    {name: 'executable_statement', symbols: ['line_comment'], postprocess: id},
    {
      name: 'executable_statement',
      symbols: [
        'indexed_assignment',
        '_',
        lexer.has('semicolon') ? {type: 'semicolon'} : semicolon,
      ],
      postprocess: data => data[0],
    },
    {name: 'executable_statement', symbols: ['while_loop'], postprocess: id},
    {name: 'executable_statement', symbols: ['if_statement'], postprocess: id},
    {name: 'executable_statement', symbols: ['for_loop'], postprocess: id},
    {
      name: 'return_statement',
      symbols: [{literal: 'return'}, '__', 'expression'],
      postprocess: data => new Return(data[2], tokenStart(data[0])),
    },
    {
      name: 'var_define',
      symbols: [
        {literal: 'let'},
        '__',
        'identifier',
        '_',
        lexer.has('colon') ? {type: 'colon'} : colon,
        '_',
        'type',
      ],
      postprocess: data =>
        new VariableDefine(data[2], data[6], tokenStart(data[0])),
    },
    {
      name: 'var_define',
      symbols: [
        {literal: 'let'},
        '__',
        'identifier',
        '_',
        lexer.has('colon') ? {type: 'colon'} : colon,
        '_',
        'type',
        '_',
        lexer.has('assignment') ? {type: 'assignment'} : assignment,
        '_',
        'expression',
      ],
      postprocess: data =>
        new VariableDefine(data[2], data[6], tokenStart(data[0]), data[10]),
    },
    {
      name: 'var_assignment',
      symbols: [
        'identifier',
        '_',
        lexer.has('assignment') ? {type: 'assignment'} : assignment,
        '_',
        'expression',
      ],
      postprocess: data =>
        new VariableAssignment(data[0], data[4], data[0].start),
    },
    {name: 'call_statement', symbols: ['call_expression'], postprocess: id},
    {
      name: 'call_statement',
      symbols: [
        'call_expression',
        '_',
        lexer.has('semicolon') ? {type: 'semicolon'} : semicolon,
      ],
      postprocess: data => data[0],
    },
    {
      name: 'call_expression',
      symbols: [
        'identifier',
        '_',
        lexer.has('lparen') ? {type: 'lparen'} : lparen,
        'argument_list',
        lexer.has('rparen') ? {type: 'rparen'} : rparen,
      ],
      postprocess: data => new CallExpression(data[0], data[3], data[0].start),
    },
    {
      name: 'indexed_access',
      symbols: [
        'iterable',
        '_',
        lexer.has('lbracket') ? {type: 'lbracket'} : lbracket,
        '_',
        'expression',
        '_',
        lexer.has('rbracket') ? {type: 'rbracket'} : rbracket,
      ],
      postprocess: data => new IndexedAccess(data[0], data[4], data[0].start),
    },
    {
      name: 'indexed_assignment',
      symbols: [
        'iterable',
        '_',
        lexer.has('lbracket') ? {type: 'lbracket'} : lbracket,
        '_',
        'expression',
        '_',
        lexer.has('rbracket') ? {type: 'rbracket'} : rbracket,
        '_',
        lexer.has('assignment') ? {type: 'assignment'} : assignment,
        '_',
        'expression',
      ],
      postprocess: data =>
        new IndexedAssignment(data[0], data[4], data[10], data[0].start),
    },
    {
      name: 'iterable',
      symbols: ['identifier'],
      postprocess: data => new VariableReference(data[0], data[0].start),
    },
    {name: 'iterable', symbols: ['call_expression'], postprocess: id},
    {
      name: 'while_loop',
      symbols: [{literal: 'while'}, '__', 'expression', '__', 'code_block'],
      postprocess: data => new WhileLoop(data[2], data[4], tokenStart(data[0])),
    },
    {
      name: 'if_statement',
      symbols: [{literal: 'if'}, '__', 'expression', '__', 'code_block'],
      postprocess: data =>
        new IfStatement(data[2], data[4], tokenStart(data[0])),
    },
    {
      name: 'if_statement',
      symbols: [
        {literal: 'if'},
        '__',
        'expression',
        '_',
        'code_block',
        '_',
        {literal: 'else'},
        '__',
        'code_block',
      ],
      postprocess: data =>
        new IfStatement(data[2], data[4], tokenStart(data[0]), data[8]),
    },
    {
      name: 'for_loop',
      symbols: [
        {literal: 'for'},
        '_',
        lexer.has('lparen') ? {type: 'lparen'} : lparen,
        '_',
        'identifier',
        '_',
        lexer.has('comma') ? {type: 'comma'} : comma,
        '_',
        'identifier',
        '__',
        {literal: 'of'},
        '__',
        'expression',
        '_',
        lexer.has('rparen') ? {type: 'rparen'} : rparen,
        '_',
        'code_block',
      ],
      postprocess: data =>
        new ForLoop(data[4], data[8], data[12], data[16], tokenStart(data[0])),
    },
    {name: 'argument_list', symbols: [], postprocess: () => []},
    {
      name: 'argument_list',
      symbols: ['_', 'expression', '_'],
      postprocess: data => [data[1]],
    },
    {
      name: 'argument_list',
      symbols: [
        '_',
        'expression',
        '_',
        lexer.has('comma') ? {type: 'comma'} : comma,
        'argument_list',
      ],
      postprocess: data => [data[1], ...data[4]],
    },
    {name: 'type', symbols: [{literal: 'Number'}], postprocess: id},
    {name: 'type', symbols: [{literal: 'List'}], postprocess: id},
    {name: 'type', symbols: [{literal: 'Null'}], postprocess: id},
    {name: 'expression', symbols: ['boolean_expression'], postprocess: id},
    {
      name: 'expression',
      symbols: [lexer.has('not') ? {type: 'not'} : not, 'boolean_expression'],
      postprocess: data => new NotExpression(data[1], tokenStart(data[0])),
    },
    {
      name: 'boolean_expression',
      symbols: ['comparison_expression'],
      postprocess: id,
    },
    {
      name: 'boolean_expression',
      symbols: [
        'comparison_expression',
        '_',
        'boolean_operator',
        '_',
        'boolean_expression',
      ],
      postprocess: data =>
        new BinaryOperation(
          convertToken(data[2]),
          data[0],
          data[4],
          data[0].start
        ),
    },
    {
      name: 'boolean_operator',
      symbols: [lexer.has('and') ? {type: 'and'} : and],
      postprocess: id,
    },
    {
      name: 'boolean_operator',
      symbols: [lexer.has('or') ? {type: 'or'} : or],
      postprocess: id,
    },
    {
      name: 'comparison_expression',
      symbols: ['additive_expression'],
      postprocess: id,
    },
    {
      name: 'comparison_expression',
      symbols: [
        'additive_expression',
        '_',
        'comparison_operator',
        '_',
        'comparison_expression',
      ],
      postprocess: data =>
        new BinaryOperation(data[2], data[0], data[4], data[0].start),
    },
    {
      name: 'comparison_operator',
      symbols: [lexer.has('greaterThan') ? {type: 'greaterThan'} : greaterThan],
      postprocess: data => convertToken(data[0]),
    },
    {
      name: 'comparison_operator',
      symbols: [
        lexer.has('greaterThanEqual')
          ? {type: 'greaterThanEqual'}
          : greaterThanEqual,
      ],
      postprocess: data => convertToken(data[0]),
    },
    {
      name: 'comparison_operator',
      symbols: [lexer.has('lessThan') ? {type: 'lessThan'} : lessThan],
      postprocess: data => convertToken(data[0]),
    },
    {
      name: 'comparison_operator',
      symbols: [
        lexer.has('lessThanEqual') ? {type: 'lessThanEqual'} : lessThanEqual,
      ],
      postprocess: data => convertToken(data[0]),
    },
    {
      name: 'comparison_operator',
      symbols: [lexer.has('equality') ? {type: 'equality'} : equality],
      postprocess: data => convertToken(data[0]),
    },
    {
      name: 'additive_expression',
      symbols: ['multiplicative_expression'],
      postprocess: id,
    },
    {
      name: 'additive_expression',
      symbols: [
        'multiplicative_expression',
        '_',
        /[+-]/,
        '_',
        'additive_expression',
      ],
      postprocess: data =>
        new BinaryOperation(
          convertToken(data[2]),
          data[0],
          data[4],
          data[0].start
        ),
    },
    {
      name: 'multiplicative_expression',
      symbols: ['unary_expression'],
      postprocess: id,
    },
    {
      name: 'multiplicative_expression',
      symbols: [
        'unary_expression',
        '_',
        /[*/%]/,
        '_',
        'multiplicative_expression',
      ],
      postprocess: data =>
        new BinaryOperation(
          convertToken(data[2]),
          data[0],
          data[4],
          data[0].start
        ),
    },
    {name: 'unary_expression', symbols: ['number'], postprocess: id},
    {
      name: 'unary_expression',
      symbols: ['identifier'],
      postprocess: data => new VariableReference(data[0], data[0].start),
    },
    {name: 'unary_expression', symbols: ['call_expression'], postprocess: id},
    {name: 'unary_expression', symbols: ['list_literal'], postprocess: id},
    {name: 'unary_expression', symbols: ['indexed_access'], postprocess: id},
    {
      name: 'unary_expression',
      symbols: [
        lexer.has('lparen') ? {type: 'lparen'} : lparen,
        'expression',
        lexer.has('rparen') ? {type: 'rparen'} : rparen,
      ],
      postprocess: data => data[1],
    },
    {
      name: 'list_literal',
      symbols: [
        lexer.has('lbracket') ? {type: 'lbracket'} : lbracket,
        'list_items',
        lexer.has('rbracket') ? {type: 'rbracket'} : rbracket,
      ],
      postprocess: data => new ListLiteral(data[1], tokenStart(data[0])),
    },
    {name: 'list_items', symbols: [], postprocess: () => []},
    {
      name: 'list_items',
      symbols: ['_ml', 'expression', '_ml'],
      postprocess: data => [data[1]],
    },
    {
      name: 'list_items',
      symbols: [
        '_ml',
        'expression',
        '_ml',
        lexer.has('comma') ? {type: 'comma'} : comma,
        'list_items',
      ],
      postprocess: data => [data[1], ...data[4]],
    },
    {
      name: 'line_comment',
      symbols: [lexer.has('comment') ? {type: 'comment'} : comment],
      postprocess: data => new Comment(data[0].value, tokenStart(data[0])),
    },
    {
      name: 'number',
      symbols: [lexer.has('number') ? {type: 'number'} : number],
      postprocess: data =>
        new NumberSymbol(parseInt(data[0].value), tokenStart(data[0])),
    },
    {
      name: 'identifier',
      symbols: [lexer.has('identifier') ? {type: 'identifier'} : identifier],
      postprocess: data => new Identifier(data[0].value, tokenStart(data[0])),
    },
    {name: '_$ebnf$1', symbols: []},
    {
      name: '_$ebnf$1',
      symbols: ['_$ebnf$1', lexer.has('ws') ? {type: 'ws'} : ws],
      postprocess: d => d[0].concat([d[1]]),
    },
    {name: '_', symbols: ['_$ebnf$1']},
    {name: '__$ebnf$1', symbols: [lexer.has('ws') ? {type: 'ws'} : ws]},
    {
      name: '__$ebnf$1',
      symbols: ['__$ebnf$1', lexer.has('ws') ? {type: 'ws'} : ws],
      postprocess: d => d[0].concat([d[1]]),
    },
    {name: '__', symbols: ['__$ebnf$1']},
    {
      name: 'multi_line_ws_char',
      symbols: [lexer.has('ws') ? {type: 'ws'} : ws],
    },
    {
      name: 'multi_line_ws_char',
      symbols: [lexer.has('nl') ? {type: 'nl'} : nl],
    },
    {name: '_ml$ebnf$1', symbols: []},
    {
      name: '_ml$ebnf$1',
      symbols: ['_ml$ebnf$1', 'multi_line_ws_char'],
      postprocess: d => d[0].concat([d[1]]),
    },
    {name: '_ml', symbols: ['_ml$ebnf$1']},
  ],
  ParserStart: 'input',
};

export default grammar;
