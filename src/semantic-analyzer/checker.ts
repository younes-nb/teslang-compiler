import {
  AST,
  Expression,
  IBinaryOperation,
  ICallExpression,
  ICodeBlock,
  IForLoop,
  IFunctionExpression,
  IIfStatement,
  IIndexedAccess,
  IIndexedAssignment,
  IVariableAssignment,
  IVariableReference,
  IWhileLoop,
  Table,
  UnaryExpression,
} from '../types';
import {SymbolTable} from '../syntax-analyzer/symbol-table';
import {
  BinaryOperation,
  CallExpression,
  ForLoop,
  FunctionExpression,
  IfStatement,
  IndexedAccess,
  IndexedAssignment,
  ListLiteral,
  NotExpression,
  NumberSymbol,
  Return,
  VariableAssignment,
  VariableReference,
  WhileLoop,
} from '../syntax-analyzer/symbols';
import {SemanticErrors} from './semantic-errors';

export class SemanticChecker {
  private readonly ast: AST;
  private symbolTable: SymbolTable;
  private errors: SemanticErrors;

  constructor(ast: AST, symbolTable: SymbolTable, errors: SemanticErrors) {
    this.ast = ast;
    this.symbolTable = symbolTable;
    this.errors = errors;
    this.checkProgram();
  }

  private checkProgram() {
    let index = 0;
    for (const node of this.ast) {
      if (node instanceof FunctionExpression) {
        if (node.name.value === 'main') {
          this.checkMainFunction(
            node,
            this.symbolTable.rootTable.children[index]
          );
        } else {
          this.checkFunctionExpression(
            node,
            this.symbolTable.rootTable.children[index]
          );
        }
        index++;
      }
    }
  }

  private checkMainFunction(node: IFunctionExpression, table: Table) {
    const mainFunction = this.symbolTable.get('main');
    if (mainFunction) {
      if (mainFunction.returnType !== 'Number') {
        this.errors.add(
          mainFunction.start.line,
          mainFunction.start.col,
          `"main" function return type expected to be "Number" but got "${mainFunction.returnType}" instead`
        );
      } else {
        for (const statement of node.body.statements) {
          if (statement instanceof Return) {
            const functionReturnedType = this.checkExpression(
              statement.value,
              table
            );
            if (
              functionReturnedType &&
              functionReturnedType !== node.type.value
            ) {
              this.errors.add(
                statement.start.line,
                statement.start.col,
                `function "main" expected to return "Number" but got "${functionReturnedType}"`
              );
            }
          }
        }
      }
      if (mainFunction.parameters?.length) {
        this.errors.add(
          mainFunction.parameters[0].start.line,
          mainFunction.parameters[0].start.col,
          `"main" function can not have parameters but got ${mainFunction.parameters?.length} instead`
        );
      }
    } else {
      this.errors.add(1, 1, '"main" function is missing');
    }
    this.checkCodeBlock(node.body, table);
  }

  private checkFunctionExpression(node: IFunctionExpression, table: Table) {
    for (const statement of node.body.statements) {
      if (statement instanceof Return) {
        const functionReturnedType = this.checkExpression(
          statement.value,
          table
        );
        if (functionReturnedType && functionReturnedType !== node.type.value) {
          this.errors.add(
            statement.start.line,
            statement.start.col,
            `return type of function "${node.name}" is "${node.type}" but got "${functionReturnedType}"`
          );
        }
      }
    }
    this.checkCodeBlock(node.body, table);
  }

  private checkCodeBlock(node: ICodeBlock, table: Table) {
    let index = 0;
    for (const statement of node.statements) {
      if (statement instanceof VariableAssignment) {
        this.checkVariableAssignment(statement, table);
      } else if (statement instanceof CallExpression) {
        this.checkCallExpression(statement, table);
      } else if (statement instanceof IndexedAssignment) {
        this.checkIndexedAssignment(statement, table);
      } else if (statement instanceof WhileLoop) {
        this.checkWhileLoop(statement, table.children[index]);
        index++;
      } else if (statement instanceof IfStatement) {
        this.checkIfStatement(statement, table.children[index]);
        index++;
      } else if (statement instanceof ForLoop) {
        this.checkForLoop(statement, table.children[index]);
        index++;
      }
    }
  }

  private checkVariableAssignment(node: IVariableAssignment, table: Table) {
    const variableType = this.checkVariableReference(node, table);
    const assignedType = this.checkExpression(node.value, table);
    if (variableType && assignedType && assignedType !== variableType) {
      this.errors.add(
        node.start.line,
        node.start.col,
        `"${node.name.value}" is a "${variableType}" but got "${assignedType}"`
      );
    }
  }

  private checkIndexedAssignment(node: IIndexedAssignment, table: Table) {
    let subjectType = undefined;
    if (node.subject instanceof VariableReference) {
      subjectType = this.checkVariableReference(node.subject, table);
    } else if (node.subject instanceof CallExpression) {
      subjectType = this.checkCallExpression(node.subject, table);
    }
    if (subjectType && subjectType !== 'List') {
      this.errors.add(
        node.subject.start.line,
        node.subject.start.col,
        `"${node.subject.name.value}" expected be an iterable bot got "${subjectType}" instead`
      );
    } else {
      const assignedType = this.checkExpression(node.value, table);
      if (assignedType && assignedType !== 'Number') {
        this.errors.add(
          node.value.start.line,
          node.value.start.col,
          `expected "Number" but got ${assignedType} instead`
        );
      }
    }
  }

  private checkWhileLoop(node: IWhileLoop, table: Table) {
    this.checkExpression(node.condition, table);
    this.checkCodeBlock(node.body, table);
  }

  private checkIfStatement(node: IIfStatement, table: Table) {
    this.checkExpression(node.condition, table);
    this.checkCodeBlock(node.consequent, table);
    if (node.alternate) {
      this.checkCodeBlock(node.alternate, table);
    }
  }

  private checkForLoop(node: IForLoop, table: Table) {
    if (table.parent) {
      if (this.checkExpression(node.iterable, table.parent) === 'List') {
        this.checkCodeBlock(node.body, table);
      }
    }
  }

  private checkExpression(node: Expression, table: Table) {
    if (node instanceof NotExpression) {
      return this.checkNotExpression(node, table);
    } else if (node instanceof BinaryOperation) {
      return this.checkBinaryOperation(node, table);
    } else {
      return this.checkUnaryExpression(node, table);
    }
  }

  private checkNotExpression(node: NotExpression, table: Table) {
    const notExpressionType = this.checkBinaryOperation(node.value, table);
    if (notExpressionType && notExpressionType !== 'Boolean') {
      this.errors.add(
        node.start.line,
        node.start.col,
        `expression must be a "boolean" but got "${notExpressionType}"`
      );
    }
    return 'Boolean';
  }

  private checkBinaryOperation(node: IBinaryOperation, table: Table) {
    let left = undefined;
    let right = undefined;
    if ('left' in node) {
      left = this.checkBinaryOperation(node.left, table);
    }
    if ('right' in node) {
      right = this.checkBinaryOperation(node.right, table);
    }

    if (left && right) {
      if ('operator' in node) {
        if (['==', '>=', '<=', '>', '<'].includes(node.operator.value)) {
          if (left === right) {
            return 'Boolean';
          } else {
            this.errors.add(
              node.start.line,
              node.start.col,
              `"You can not compare "${left}" with ${right}`
            );
            return undefined;
          }
        } else if (['+', '-', '*', '/', '%'].includes(node.operator.value)) {
          if (left !== 'Number') {
            this.errors.add(
              node.start.line,
              node.start.col,
              `expected "Number" but got "${left}"`
            );
            return undefined;
          } else if (right !== 'Number') {
            this.errors.add(
              node.start.line,
              node.start.col,
              `expected "Number" but got "${right}"`
            );
            return undefined;
          } else {
            return 'Number';
          }
        }
      }
    }

    return this.checkUnaryExpression(node, table);
  }

  private checkUnaryExpression(
    node: Expression | UnaryExpression,
    table: Table
  ) {
    if (node instanceof NumberSymbol) {
      return 'Number';
    } else if (node instanceof VariableReference) {
      return this.checkVariableReference(node, table);
    } else if (node instanceof CallExpression) {
      return this.checkCallExpression(node, table);
    } else if (node instanceof ListLiteral) {
      return 'List';
    } else if (node instanceof IndexedAccess) {
      return this.checkIndexedAccess(node, table);
    }
  }

  private checkVariableReference(node: IVariableReference, table: Table) {
    if (this.symbolTable.hasAccess(node.name.value, table)) {
      return this.symbolTable.get(node.name.value)?.type;
    } else {
      this.errors.add(
        node.start.line,
        node.start.col,
        `"${node.name.value}" is not defined`
      );
      return undefined;
    }
  }

  private checkIndexedAccess(node: IIndexedAccess, table: Table) {
    let subjectType = undefined;
    if (node.subject instanceof VariableReference) {
      subjectType = this.checkVariableReference(node.subject, table);
    } else if (node.subject instanceof CallExpression) {
      subjectType = this.checkCallExpression(node.subject, table);
    }
    if (subjectType) {
      if (subjectType === 'List') {
        return 'Number';
      } else {
        this.errors.add(
          node.subject.start.line,
          node.subject.start.col,
          `"${node.subject.name.value}" expected to ba an iterable but got "${subjectType}"`
        );
      }
    }
    return undefined;
  }

  private checkCallExpression(node: ICallExpression, table: Table) {
    if (this.symbolTable.hasAccess(node.name.value, table)) {
      const functionNode = this.symbolTable.get(node.name.value);
      if (
        functionNode?.type !== 'Function' &&
        functionNode?.type !== 'BuiltInFunction'
      ) {
        this.errors.add(
          node.start.line,
          node.start.col,
          `"${node.name.value}" expected to be a "Function" but got ${functionNode?.type} instead`
        );
        return undefined;
      }
      if (functionNode?.parameters?.length !== node.arguments.length) {
        this.errors.add(
          node.arguments[0].start.line,
          node.arguments[0].start.col,
          `function "${node.name.value}" expected ${functionNode?.parameters?.length} arguments but got ${node.arguments.length} instead`
        );
        return undefined;
      } else {
        let invalid = false;
        for (let i = 0; i < node.arguments.length; i++) {
          const argumentType = this.checkExpression(node.arguments[i], table);
          let parameterType = functionNode.parameters[i].type;
          if (parameterType.value) {
            parameterType = parameterType.value;
          }
          if (argumentType && argumentType !== parameterType) {
            this.errors.add(
              node.arguments[i].start.line,
              node.arguments[i].start.col,
              `function "${node.name.value}" expected argument ${
                i + 1
              } to be "${parameterType}" but got "${argumentType}" instead`
            );
            invalid = true;
          }
        }
        if (invalid) {
          return undefined;
        }
        return functionNode.returnType;
      }
    } else {
      this.errors.add(
        node.start.line,
        node.start.col,
        `function "${node.name.value}" is not defined`
      );
      return undefined;
    }
  }
}
