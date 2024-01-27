import { TokensList } from "../lexer/tokens.js";

export class Expression {
  constructor(children) {
    this.type = "Expression";
    this.children = children;
  }
}

export class Number {
  constructor(value) {
    this.type = TokensList.Number;
    this.value = value;
  }
}

export class String {
  constructor(value) {
    this.type = TokensList.String;
    this.value = value;
  }
}

export class Boolean {
  constructor(value) {
    this.type = TokensList.Boolean;
    this.value = value;
  }
}

export class Float {
  constructor(value) {
    this.type = TokensList.Float;
    this.value = value;
  }
}

export class Identifier {
  constructor(value) {
    this.type = TokensList.Identifier;
    this.value = value;
  }
}
