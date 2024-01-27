import { TokensList } from "../lexer/tokens.js";

export default class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.parsedTokens = [];
    this.tokens.push({ line: "EOF", token: "END_OF_FILE", lexeme: "EOF" });
  }

  peekCurrentToken() {
    const token = [...this.tokens];
    return token.shift()?.token;
  }

  peekCurrentLexeme() {
    const token = [...this.tokens];
    return token.shift()?.lexeme;
  }

  peekCurrentLine() {
    const token = [...this.tokens];
    return token.shift()?.line;
  }

  nextToken() {
    this.parsedTokens.push(this.tokens.shift());
  }

  matchToken(expectedToken) {
    return this.peekCurrentToken() === expectedToken;
  }

  raiseExpectation(expectedToken) {
    throw new Error(
      `Syntax error occured. Expecting a ${expectedToken} but found ${this.peekCurrentToken()} at line ${this.peekCurrentLine()}`
    );
  }

  parseExpression() {
    return this.parseAddition();
  }

  parseAddition() {
    let leftOperand = this.parseSubtraction();

    while (
      this.matchToken(TokensList["+"]) ||
      this.matchToken(TokensList["-"])
    ) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const rightOperand = this.parseSubtraction();
      leftOperand = {
        node: "BinaryExpression",
        operator,
        left: leftOperand,
        right: rightOperand
      };
    }

    return leftOperand;
  }

  parseSubtraction() {
    let leftOperand = this.parseExponentiation();

    while (this.matchToken(TokensList["-"])) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const rightOperand = this.parseExponentiation();
      leftOperand = {
        node: "BinaryExpression",
        operator,
        left: leftOperand,
        right: rightOperand
      };
    }

    return leftOperand;
  }

  parseExponentiation() {
    let leftOperand = this.parseMultiplication();

    while (this.matchToken(TokensList["^"])) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const rightOperand = this.parseMultiplication();
      leftOperand = {
        node: "BinaryExpression",
        operator,
        left: leftOperand,
        right: rightOperand
      };
    }

    return leftOperand;
  }

  parseMultiplication() {
    let leftOperand = this.parseDivision();

    while (
      this.matchToken(TokensList["*"]) ||
      this.matchToken(TokensList["/"]) ||
      this.matchToken(TokensList["%"])
    ) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const rightOperand = this.parseDivision();
      leftOperand = {
        node: "BinaryExpression",
        operator,
        left: leftOperand,
        right: rightOperand
      };
    }

    return leftOperand;
  }

  parseDivision() {
    let leftOperand = this.parseParenthesis();

    while (
      this.matchToken(TokensList["/"]) ||
      this.matchToken(TokensList["%"])
    ) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const rightOperand = this.parseParenthesis();
      leftOperand = {
        node: "BinaryExpression",
        operator,
        left: leftOperand,
        right: rightOperand
      };
    }

    return leftOperand;
  }

  parseParenthesis() {
    if (this.matchToken(TokensList["("])) {
      this.nextToken();
      const expressionInsideParenthesis = this.parseExpression();
      if (!this.matchToken(TokensList[")"])) {
        this.raiseExpectation(TokensList[")"]);
      }
      this.nextToken();
      return expressionInsideParenthesis;
    }

    return this.parseIncrementDecrement();
  }

  parseIncrementDecrement() {
    let operand = this.parsePrimary();

    while (
      this.matchToken(TokensList["++"]) ||
      this.matchToken(TokensList["--"])
    ) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      operand = {
        node: "UnaryExpression",
        operator,
        operand
      };
    }

    return operand;
  }

  parsePrimary() {
    if (this.matchToken(TokensList.Identifier)) {
      const identifier = this.peekCurrentLexeme();
      this.nextToken();
      return { node: "Identifier", name: identifier };
    } else if (this.matchToken(TokensList.Number)) {
      const number = this.peekCurrentLexeme();
      this.nextToken();
      return { node: "Literal", value: parseFloat(number) };
    } else {
      this.raiseExpectation("Identifier or Number");
    }
  }

  parseVariableAssignment() {
    this.nextToken();

    let identifier, value;

    if (!this.matchToken(TokensList.Identifier)) {
      this.raiseExpectation(TokensList.Identifier);
    }

    identifier = this.peekCurrentLexeme();
    this.nextToken();

    if (this.matchToken(TokensList[";"])) {
      this.nextToken();
      return {
        node: "VariableDeclaration",
        identifier,
        value: null
      };
    }

    if (!this.matchToken(TokensList["="])) {
      this.raiseExpectation(TokensList["="]);
    }

    this.nextToken();

    value = this.parseExpression();

    if (this.peekCurrentToken() !== TokensList[";"]) {
      this.raiseExpectation(TokensList[";"]);
    }

    this.nextToken();

    return {
      node: "VariableAssignment",
      identifier,
      value
    };
  }

  parseConstantAssignment() {
    this.nextToken();

    let identifier, value;

    if (!this.matchToken(TokensList.Identifier)) {
      this.raiseExpectation(TokensList.Identifier);
    }

    identifier = this.peekCurrentLexeme();
    this.nextToken();

    if (!this.matchToken(TokensList["="])) {
      this.raiseExpectation(TokensList["="]);
    }

    this.nextToken();

    value = this.parseExpression();

    if (this.peekCurrentToken() !== TokensList[";"]) {
      this.raiseExpectation(TokensList[";"]);
    }

    this.nextToken();

    return {
      node: "ConstantAssignment",
      identifier,
      value
    };
  }

  analyzeSyntax() {
    const statements = [];

    while (this.peekCurrentToken() !== "END_OF_FILE") {
      console.log(this.peekCurrentToken());
      if (this.peekCurrentToken() === TokensList.lit) {
        statements.push(this.parseVariableAssignment());
      } else if (this.peekCurrentToken() === TokensList.fire) {
        statements.push(this.parseVariableAssignment());
      }
    }

    console.log(JSON.stringify(statements, null, 1));
    return statements;
  }
}
