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

export class Function {
  constructor(identifier, parameters, statements) {
    this.node = "FunctionDefinition";
    this.identifier = identifier;
    this.parameters = parameters;
    this.statements = statements;
  }
}

export class FunctionCall {
  constructor(functionName, parameters) {
    this.node = "FunctionCall";
    this.functionName = functionName;
    this.parameters = parameters;
  }
}

export class YeetConditional {
  constructor(condition, statements, subCondition) {
    this.node = "YeetConditional";
    this.condition = condition;
    this.statements = statements;
    this.subCondition = subCondition;
  }
}

export class YikesConditional {
  constructor(condition, statements, subCondition) {
    this.node = "YikesConditional";
    this.condition = condition;
    this.statements = statements;
    this.subCondition = subCondition;
  }
}

export class YasConditional {
  constructor(statements) {
    this.node = "YasConditional";
    this.statements = statements;
  }
}

export class Sus {
  constructor(statements) {
    this.node = "Sus";
    this.statements = statements;
  }
}

export class Dead {
  constructor(statements) {
    this.node = "Dead";
    this.statements = statements;
  }
}

export class Gotcha {
  constructor(statements) {
    this.node = "Gotcha";
    this.statements = statements;
  }
}

export class Slay {
  constructor(messageType, value) {
    this.node = "Slay";
    this.messageType = messageType;
    this.value = value;
  }
}

export class Relapse {
  constructor(as, worse, recover, statements) {
    this.node = "Relapse";

    this.as = {
      type: as.type,
      value: as.value
    };

    this.worse = {
      type: worse.type,
      value: worse.value
    };

    this.recover = {
      type: recover.type,
      value: recover.value
    };

    this.statements = statements;
  }
}

export class Flex {
  constructor(args) {
    this.node = "Flex";
    this.arguments = args;
  }
}

export class Spill {
  constructor(variable) {
    this.node = "Spill";
    this.identifier = variable;
  }
}

export class Htmlize {
  constructor(tags) {
    this.node = "HTMLize";
    this.tags = tags;
  }
}

export class Bounce {
  constructor(expression) {
    this.node = "Bounce";
    this.expression = expression;
  }
}

export class Bet {
  constructor(value, valueType, expression) {
    this.node = "Bet";
    this.value = {
      value,
      valueType
    };

    this.expression = expression;
  }
}

export class SingleComment {
  constructor(content) {
    this.node = "SingleComment";
    this.content = content;
  }
}

export class MultiComment {
  constructor(content) {
    this.node = "MultiComment";
    this.content = content;
  }
}

export class Swerve {
  constructor() {
    this.node = "Swerve";
  }
}

export class Periodt {
  constructor() {
    this.node = "Swerve";
  }
}
