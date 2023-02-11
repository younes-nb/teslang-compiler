import {ICoordinates, IParameter, ISymbolNode, Table} from '../types';
import Tree from 'ts-tree-structure';

export class SymbolNode implements ISymbolNode {
  name: string;
  type: string;
  start: ICoordinates;
  parameters?: IParameter[];
  returnType?: string;

  constructor(
    name: string,
    type: string,
    start: ICoordinates,
    parameters?: IParameter[],
    returnType?: any
  ) {
    this.name = name;
    this.type = type;
    this.start = start;
    this.parameters = parameters;
    this.returnType = returnType;
  }
}

export class SymbolTable {
  private _tables: Tree;
  private readonly _rootTable: Table;

  constructor() {
    this._tables = new Tree();
    this._rootTable = this.createTableNode();
  }

  createTableNode(): Table {
    const table: Map<string, ISymbolNode> = new Map();
    return this._tables.parse(table);
  }

  put(
    table: Table,
    name: string,
    type: any,
    start: ICoordinates,
    parameters?: IParameter[],
    returnType?: any
  ) {
    if (table.model.has(name)) {
      return false;
    } else {
      const node = new SymbolNode(name, type, start, parameters, returnType);
      table.model.set(name, node);
      return true;
    }
  }

  get(name: string): ISymbolNode | undefined {
    return this._rootTable.first(node => node.model.has(name))?.model.get(name);
  }

  hasAccess(name: string, table: Table): boolean {
    if (table.model.has(name)) {
      return true;
    } else if (table.parent) {
      return this.hasAccess(name, table.parent);
    }
    return false;
  }

  containsInTable(name: string, table: Table): boolean {
    return table.model.has(name);
  }

  get rootTable() {
    return this._rootTable;
  }
}
