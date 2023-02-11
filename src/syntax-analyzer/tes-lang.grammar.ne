@preprocessor typescript
@lexer lexer

@{%
import {lexer} from "../lexical-analyzer/lexer";
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
    Coordinates
} from "./symbols";

function tokenStart(token: any) {
    return  new Coordinates(token.line, token.col - 1);
}

function convertToken(token: any) {
    return {
        type: token.type,
        value: token.value,
        start: tokenStart(token)
    };
}

%}

input
    -> program
        {% id %}

program
    ->  statement
            {% data => [data[0]] %}
        |  statement _ %nl _ program
            {% data => [data[0], ...data[4]] %}
        |  _ %nl program
            {% data => data[2] %}
        |  _
            {% () => [] %}

statement
    -> function_expression
        {% id %}
    | line_comment
        {% id %}

function_expression
    -> "function" __ identifier _  %lparen _ parameter_list _ %rparen _ %colon _ type _ %arrow _ code_block
        {% data => new FunctionExpression(data[2], data[12], data[6], data[16], tokenStart(data[0])) %}
    |  "function" __ identifier _ %lparen _ parameter_list _ %rparen _ %colon _ type _ %arrow _ expression
        {% data => new FunctionExpression(data[2], data[12], data[6], data[16], tokenStart(data[0])) %}

parameter_list
    -> null
        {% () => [] %}
    |  identifier _ %colon _ type
        {% data => [new Parameter(data[0], data[4], data[0].start)] %}
    |  identifier _ %colon _ type _ %comma _ parameter_list
        {% data => [new Parameter(data[0], data[4], data[0].start), ...data[8]] %}

code_block
    -> %lbrace executable_statements %rbrace
        {% data => new CodeBlock(data[1], tokenStart(data[0])) %}

executable_statements
    -> _
        {% () => [] %}
    |  _ %nl executable_statements
        {% data => data[2] %}
    |  _ executable_statement _
        {% data => [data[1]] %}
    |  _ executable_statement _ %nl executable_statements
        {% data => [data[1], ...data[4]] %}

executable_statement
    -> return_statement _ %semicolon
        {% data => data[0] %}
    |  var_assignment _ %semicolon
        {% data => data[0] %}
    |  var_define _ %semicolon
        {% data => data[0] %}
    |  call_statement
        {% id %}
    |  line_comment
        {% id %}
    |  indexed_assignment _ %semicolon
        {% data => data[0] %}
    |  while_loop
        {% id %}
    |  if_statement
        {% id %}
    |  for_loop
        {% id %}

return_statement
    -> "return" __ expression
        {% data => new Return(data[2], tokenStart(data[0])) %}

var_define
    -> "let" __ identifier _ %colon _ type
        {% data => new VariableDefine(data[2], data[6], tokenStart(data[0])) %}
    |  "let" __ identifier _ %colon _ type _ %assignment _ expression
        {% data => new VariableDefine(data[2], data[6], tokenStart(data[0]), data[10]) %}

var_assignment
    -> identifier _ %assignment _ expression
        {% data => new VariableAssignment(data[0], data[4], data[0].start) %}

call_statement
    -> call_expression
        {% id %}
    | call_expression _ %semicolon
        {% data => data[0] %}

call_expression
    -> identifier _ %lparen argument_list %rparen
        {% data => new CallExpression(data[0], data[3], data[0].start) %}

indexed_access
    -> iterable _ %lbracket _ expression _ %rbracket
        {% data => new IndexedAccess(data[0], data[4], data[0].start) %}

indexed_assignment
    -> iterable _ %lbracket _ expression _ %rbracket _ %assignment _ expression
        {% data => new IndexedAssignment(data[0], data[4], data[10], data[0].start) %}

iterable
    -> identifier
        {% data => new VariableReference(data[0], data[0].start) %}
    |  call_expression
        {% id %}

while_loop
    -> "while" __ expression __ code_block
        {% data => new WhileLoop(data[2], data[4], tokenStart(data[0])) %}

if_statement
    -> "if" __ expression __ code_block
        {% data => new IfStatement(data[2], data[4], tokenStart(data[0])) %}
    |  "if" __ expression _ code_block _ "else" __ code_block
        {% data => new IfStatement(data[2], data[4], tokenStart(data[0]), data[8]) %}

for_loop
    -> "for" _ %lparen _ identifier _ %comma _ identifier __ "of" __ expression _ %rparen _ code_block
        {% data => new ForLoop(data[4], data[8], data[12], data[16], tokenStart(data[0])) %}

argument_list
    -> null
        {% () => [] %}
    |  _ expression _
        {% data => [data[1]] %}
    |  _ expression _ %comma argument_list
        {% data => [data[1], ...data[4]] %}

type
    -> "Number"
        {% id %}
    |  "List"
        {% id %}
    |  "Null"
        {% id %}

expression
    -> boolean_expression
        {% id %}
    | %not boolean_expression
        {% data => new NotExpression(data[1], tokenStart(data[0])) %}

boolean_expression
    -> comparison_expression
        {% id %}
    |  comparison_expression _ boolean_operator _ boolean_expression
        {% data => new BinaryOperation(convertToken(data[2]), data[0], data[4], data[0].start) %}

boolean_operator
    -> %and
        {% id %}
    |  %or
        {% id %}

comparison_expression
    -> additive_expression
        {% id %}
    |  additive_expression _ comparison_operator _ comparison_expression
        {% data =>  new BinaryOperation(data[2], data[0], data[4], data[0].start) %}

comparison_operator
    -> %greaterThan
        {% data => convertToken(data[0]) %}
    |  %greaterThanEqual
        {% data => convertToken(data[0]) %}
    |  %lessThan
        {% data => convertToken(data[0]) %}
    |  %lessThanEqual
        {% data => convertToken(data[0]) %}
    |  %equality
        {% data => convertToken(data[0]) %}

additive_expression
    -> multiplicative_expression
        {% id %}
    |  multiplicative_expression _ [+-] _ additive_expression
        {% data => new BinaryOperation(convertToken(data[2]), data[0], data[4], data[0].start) %}

multiplicative_expression
    -> unary_expression
        {% id %}
    |  unary_expression _ [*/%] _ multiplicative_expression
        {% data => new BinaryOperation(convertToken(data[2]), data[0], data[4], data[0].start) %}

unary_expression
    -> number
        {% id %}
    |  identifier
        {% data => new VariableReference(data[0], data[0].start) %}
    |  call_expression
        {% id %}
    |  list_literal
        {% id %}
    |  indexed_access
        {% id %}
    |  %lparen expression %rparen
        {% data => data[1] %}

list_literal
    -> %lbracket list_items %rbracket
        {% data => new ListLiteral(data[1], tokenStart(data[0])) %}

list_items
    -> null
        {% () => [] %}
    |  _ml expression _ml
        {% data => [data[1]] %}
    |  _ml expression _ml %comma list_items
        {% data => [data[1], ...data[4]] %}

line_comment
    -> %comment
        {% data => new Comment(data[0].value, tokenStart(data[0])) %}

number
    -> %number
        {% data => new NumberSymbol(parseInt(data[0].value), tokenStart(data[0])) %}

identifier
    -> %identifier
        {% data => new Identifier(data[0].value, tokenStart(data[0])) %}

_ ->
    %ws:*

__ ->
    %ws:+

multi_line_ws_char
    -> %ws
    |  %nl

_ml
    -> multi_line_ws_char:*