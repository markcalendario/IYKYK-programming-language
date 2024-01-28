import { TokensList } from "../lexer/tokens.js";

export class BinaryExpression {
  constructor(operator, left, right) {
    this.node = "BinaryExpression";
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class UnaryExpression {
  constructor(operator, operand) {
    this.node = "UnaryExpression";
    this.operator = operator;
    this.operand = operand;
  }
}

export class Number {
  constructor(value) {
    this.node = TokensList.Number;
    this.value = value;
  }
}

export class NegativeNumber {
  constructor(value) {
    this.node = "NegativeNumber";
    this.value = value;
  }
}

export class NegativeFloat {
  constructor(value) {
    this.node = "NegativeFloat";
    this.value = value;
  }
}

export class NegativeIdentifier {
  constructor(value) {
    this.node = "NegativeIdentifier";
    this.value = value;
  }
}

export class String {
  constructor(value) {
    this.node = TokensList.String;
    this.value = value;
  }
}

export class Float {
  constructor(value) {
    this.node = TokensList.Float;
    this.value = value;
  }
}

export class Bool {
  constructor(value) {
    this.node = TokensList.Boolean;
    this.value = value;
  }
}

export class Identifier {
  constructor(name) {
    this.node = TokensList.Identifier;
    this.name = name;
  }
}

export class VariableDeclaration {
  constructor(identifier, value) {
    this.node = "VariableDeclaration";
    this.identifier = identifier;
    this.value = value;
  }
}

export class ConstantAssignment {
  constructor(identifier, value) {
    this.node = "ConstantDeclaration";
    this.identifier = identifier;
    this.value = value;
  }
}

export class Assignment {
  constructor(identifier, operator, value) {
    this.node = "Assignment";
    this.operator = operator;
    this.identifier = identifier;
    this.value = value;
  }
}
