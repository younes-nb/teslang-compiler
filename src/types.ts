import {Node} from 'ts-tree-structure';

export type ExecutableStatement =
  | IReturn
  | IVariableDefine
  | IVariableAssignment
  | ICallExpression
  | IIndexedAssignment
  | IWhileLoop
  | IIfStatement
  | IForLoop;

export type Expression = INotExpression | IBinaryOperation;
export type UnaryExpression =
  | INumber
  | IVariableReference
  | ICallExpression
  | IListLiteral
  | IIndexedAccess;
export type Table = Node<Map<string, ISymbolNode>>;
export type AST = (IFunctionExpression | IComment)[];
export type Iterable = IVariableReference | ICallExpression;

export interface ICoordinates {
  line: number;
  col: number;
}

export interface IFunctionExpression {
  name: IIdentifier;
  type: any;
  parameters: IParameter[];
  body: ICodeBlock;
  start: ICoordinates;
}

export interface IParameter {
  name: IIdentifier;
  type: any;
  start: ICoordinates;
}

export interface ICodeBlock {
  statements: ExecutableStatement[];
  start: ICoordinates;
}

export interface IReturn {
  value: Expression;
  start: ICoordinates;
}

export interface IVariableDefine {
  name: IIdentifier;
  type: any;
  start: ICoordinates;
  value?: Expression;
}

export interface IVariableAssignment {
  name: IIdentifier;
  value: Expression;
  start: ICoordinates;
}

export interface ICallExpression {
  name: IIdentifier;
  arguments: Expression[];
  start: ICoordinates;
}

export interface IIndexedAccess {
  subject: Iterable;
  index: Expression;
  start: ICoordinates;
}

export interface IIndexedAssignment {
  subject: Iterable;
  index: Expression;
  value: Expression;
  start: ICoordinates;
}

export interface IWhileLoop {
  condition: Expression;
  body: ICodeBlock;
  start: ICoordinates;
}

export interface IIfStatement {
  condition: Expression;
  consequent: ICodeBlock;
  start: ICoordinates;
  alternate?: ICodeBlock;
}

export interface IForLoop {
  index: IIdentifier;
  variable: IIdentifier;
  iterable: Expression;
  body: ICodeBlock;
  start: ICoordinates;
}

export interface INotExpression {
  value: IBinaryOperation;
  start: ICoordinates;
}

export interface IBinaryOperation {
  operator: any;
  left: any;
  right: any;
  start: ICoordinates;
}

export interface IVariableReference {
  name: IIdentifier;
  start: ICoordinates;
}

export interface IListLiteral {
  items: Expression[];
  start: ICoordinates;
}

export interface IIdentifier {
  value: string;
  start: ICoordinates;
}

export interface INumber {
  value: number;
  start: ICoordinates;
}

export interface IComment {
  value: string;
  start: ICoordinates;
}

export interface ISymbolNode {
  name: string;
  type: any;
  start: ICoordinates;
  parameters?: IParameter[];
  returnType?: any;
}
