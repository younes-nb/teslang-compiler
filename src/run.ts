import {readFileSync} from 'fs';
import Parser from './syntax-analyzer/parser';
import {SemanticChecker} from './semantic-analyzer/checker';
import {SemanticErrors} from './semantic-analyzer/semantic-errors';
import {formatSyntaxErrors} from './syntax-analyzer/syntax-errors';

function run() {
  try {
    const script = readFileSync(process.argv[2], {encoding: 'utf8', flag: 'r'});
    const errors = new SemanticErrors();
    const parser = new Parser(script, errors);
    const ast = parser.ast;
    const symbolTable = parser.generateSymbolTable();
    new SemanticChecker(ast, symbolTable, errors);
    errors.print();
  } catch (e: any) {
    formatSyntaxErrors(e);
  }
}

run();
