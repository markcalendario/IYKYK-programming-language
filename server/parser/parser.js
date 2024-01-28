import { TokensList } from "../lexer/tokens.js";
import {
  BinaryExpression,
  Bool,
  ConstantAssignment,
  Float,
  Identifier,
  NegativeFloat,
  NegativeIdentifier,
  NegativeNumber,
  Number,
  String,
  UnaryExpression,
  VariableDeclaration
} from "./ast.js";

export default class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.parsedTokens = [];
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

  peekPrevToken() {
    const parsedTokens = [...this.parsedTokens];
    return parsedTokens.pop()?.token || "BEGINNING_OF_FILE";
  }

  peekPrevLexeme() {
    const parsedTokens = [...this.parsedTokens];
    return parsedTokens.pop()?.lexeme || "BEGINNING_OF_FILE";
  }

  nextToken() {
    this.parsedTokens.push(this.tokens.shift());
  }

  matchToken(expectedToken) {
    return this.peekCurrentToken() === expectedToken;
  }

  raiseExpectation(expectedToken) {
    const message = `Syntax error occured. Expecting ${expectedToken} after ${this.peekPrevToken()} "${this.peekPrevLexeme()}" but found ${this.peekCurrentToken()} at line ${this.peekCurrentLine()}.`;
    throw new Error(message);
  }

  raiseExpectations(expectedTokensArray) {
    const message = `Syntax error occured. Expecting ${expectedTokensArray.join(
      " | "
    )} after ${this.peekPrevToken()} "${this.peekPrevLexeme()}" but found ${this.peekCurrentToken()} at line ${this.peekCurrentLine()}.`;
    throw new Error(message);
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
      leftOperand = new BinaryExpression(operator, leftOperand, rightOperand);
    }

    return leftOperand;
  }

  parseSubtraction() {
    let leftOperand = this.parseExponentiation();

    while (this.matchToken(TokensList["-"])) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();

      const rightOperand = this.parseExponentiation();
      leftOperand = new BinaryExpression(operator, leftOperand, rightOperand);
    }

    return leftOperand;
  }

  parseExponentiation() {
    let leftOperand = this.parseMultiplication();

    while (this.matchToken(TokensList["^"])) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();

      const rightOperand = this.parseMultiplication();
      leftOperand = new BinaryExpression(operator, leftOperand, rightOperand);
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
      leftOperand = new BinaryExpression(operator, leftOperand, rightOperand);
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
      leftOperand = new BinaryExpression(operator, leftOperand, rightOperand);
    }

    return leftOperand;
  }

  parseParenthesis() {
    if (!this.matchToken(TokensList["("])) {
      return this.parseIncrementDecrement();
    }

    this.nextToken();
    const expressionInsideParenthesis = this.parseExpression();

    if (!this.matchToken(TokensList[")"])) {
      this.raiseExpectation(TokensList[")"]);
    }

    this.nextToken();
    return expressionInsideParenthesis;
  }

  parseIncrementDecrement() {
    let operand = this.parsePrimary();

    while (
      this.matchToken(TokensList["++"]) ||
      this.matchToken(TokensList["--"])
    ) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      operand = new UnaryExpression(operator, operand);
    }

    return operand;
  }

  parsePrimary() {
    if (
      this.matchToken(TokensList["++"]) ||
      this.matchToken(TokensList["--"])
    ) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const operand = this.peekCurrentLexeme();
      this.nextToken();
      return new UnaryExpression(operator, operand);
    }

    if (this.matchToken(TokensList.Identifier)) {
      const identifier = this.peekCurrentLexeme();
      this.nextToken();
      return new Identifier(identifier);
    }

    if (this.matchToken(TokensList.Number)) {
      const number = this.peekCurrentLexeme();
      this.nextToken();
      return new Number(number);
    }

    if (this.matchToken(TokensList['"'])) {
      this.nextToken();
      const string = this.peekCurrentLexeme();
      this.nextToken();
      this.nextToken();
      return new String(string);
    }

    if (this.matchToken(TokensList.Float)) {
      const float = this.peekCurrentLexeme();
      this.nextToken();
      return new Float(float);
    }

    if (this.matchToken(TokensList.cap) || this.matchToken(TokensList.real)) {
      const bool = this.peekCurrentLexeme();
      this.nextToken();
      return new Bool(bool);
    }

    if (this.matchToken(TokensList["-"])) {
      this.nextToken();
      return this.parseNegativeExpression();
    }

    this.raiseExpectation([TokensList.Identifier, TokensList.Number]);
  }

  parseNegativeExpression() {
    let value = "-" + this.peekCurrentLexeme();

    if (this.matchToken(TokensList.Number)) {
      this.nextToken();
      return new NegativeNumber(value);
    }

    if (this.matchToken(TokensList.Float)) {
      this.nextToken();
      return new NegativeFloat(value);
    }

    if (this.matchToken(TokensList.Identifier)) {
      this.nextToken();
      return new NegativeIdentifier(value);
    }

    this.raiseExpectations([
      TokensList.Number,
      TokensList.Float,
      TokensList.Identifier
    ]);
  }

  parseVariableAssignment() {
    this.nextToken();

    if (!this.matchToken(TokensList.Identifier)) {
      this.raiseExpectation(TokensList.Identifier);
    }

    const identifier = this.peekCurrentLexeme();
    this.nextToken();

    if (this.matchToken(TokensList[";"])) {
      this.nextToken();

      return new VariableDeclaration(identifier, null);
    }

    if (!this.matchToken(TokensList["="])) {
      this.raiseExpectation(TokensList["="]);
    }

    this.nextToken();

    const value = this.parseExpression();

    if (this.peekCurrentToken() !== TokensList[";"]) {
      this.raiseExpectation(TokensList[";"]);
    }
    this.nextToken();

    return new VariableDeclaration(identifier, value);
  }

  parseConstantAssignment() {
    this.nextToken();

    if (!this.matchToken(TokensList.Identifier)) {
      this.raiseExpectation(TokensList.Identifier);
    }

    const identifier = this.peekCurrentLexeme();
    this.nextToken();

    if (!this.matchToken(TokensList["="])) {
      this.raiseExpectation(TokensList["="]);
    }

    this.nextToken();

    const value = this.parseExpression();

    if (this.peekCurrentToken() !== TokensList[";"]) {
      this.raiseExpectation(TokensList[";"]);
    }

    this.nextToken();

    return new ConstantAssignment(identifier, value);
  }

  analyzeSyntax() {
    const statements = [];

    while (this.peekCurrentToken() !== TokensList.END_OF_FILE) {
      console.log(this.peekCurrentToken());

      // Variable assignment
      if (this.peekCurrentToken() === TokensList.lit) {
        statements.push(this.parseVariableAssignment());
      }

      //
      else if (this.peekCurrentToken() === TokensList.fire) {
        statements.push(this.parseConstantAssignment());
      } else if (this.peekCurrentToken() === TokensList.Identifier) {
        statements.push(this.parseExpression());
      } else if (this.peekCurrentToken() === TokensList.Number) {
        statements.push(this.parseExpression());
      } else if (this.peekCurrentToken() === TokensList.Float) {
        statements.push(this.parseExpression());
      } else {
        this.raiseExpectation("Grammar");
      }
    }

    console.log(JSON.stringify(statements, null, 2));
    return statements;
  }
}
