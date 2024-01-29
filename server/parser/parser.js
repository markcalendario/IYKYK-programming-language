import { TokensList } from "../lexer/tokens.js";
import {
  Assignment,
  BinaryExpression,
  Bool,
  Conditional,
  ConstantAssignment,
  Float,
  Function,
  FunctionCall,
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

  beginParsingExpressions() {
    return this.parseLogicalOr(); // Start with logical OR expressions
  }

  parseExpressions() {
    const expression = this.beginParsingExpressions();

    // Check for the presence of a semicolon
    if (this.matchToken(TokensList[";"])) {
      this.nextToken();
    } else {
      this.raiseExpectation(TokensList[";"]);
    }

    return expression;
  }

  parseLogicalOr() {
    let leftOperand = this.parseLogicalAnd();

    while (this.matchToken(TokensList["||"])) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const rightOperand = this.parseLogicalAnd();
      leftOperand = new BinaryExpression(operator, leftOperand, rightOperand);
    }

    return leftOperand;
  }

  parseLogicalAnd() {
    let leftOperand = this.parseLogicalNot();

    while (this.matchToken(TokensList["&&"])) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const rightOperand = this.parseLogicalNot();
      leftOperand = new BinaryExpression(operator, leftOperand, rightOperand);
    }

    return leftOperand;
  }

  parseLogicalNot() {
    if (this.matchToken(TokensList["!"])) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const operand = this.parseLogicalNot();
      return new UnaryExpression(operator, operand);
    }

    return this.parseEquality();
  }

  parseEquality() {
    let leftOperand = this.parseComparison();

    while (
      this.matchToken(TokensList["=="]) ||
      this.matchToken(TokensList["!="])
    ) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const rightOperand = this.parseComparison();
      leftOperand = new BinaryExpression(operator, leftOperand, rightOperand);
    }

    return leftOperand;
  }

  parseComparison() {
    let leftOperand = this.parseAddition(); // Assuming your existing parseAddition handles arithmetic expressions

    while (
      this.matchToken(TokensList["<"]) ||
      this.matchToken(TokensList[">"]) ||
      this.matchToken(TokensList["<="]) ||
      this.matchToken(TokensList[">="])
    ) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();
      const rightOperand = this.parseAddition();
      leftOperand = new BinaryExpression(operator, leftOperand, rightOperand);
    }

    return leftOperand;
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
    let leftOperand = this.parseStepwiseIncrementDecrement();

    while (this.matchToken(TokensList["-"])) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();

      const rightOperand = this.parseStepwiseIncrementDecrement();
      leftOperand = new BinaryExpression(operator, leftOperand, rightOperand);
    }

    return leftOperand;
  }

  parseStepwiseIncrementDecrement() {
    let leftOperand = this.parseExponentiation();

    while (
      this.matchToken(TokensList[">>"]) ||
      this.matchToken(TokensList["<<"])
    ) {
      const operator = this.peekCurrentLexeme();
      this.nextToken();

      const allowedOperand = [TokensList.Number, TokensList.Identifier];

      if (!allowedOperand.includes(this.peekCurrentToken())) {
        this.raiseExpectations(allowedOperand);
      }

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
    const expressionInsideParenthesis = this.beginParsingExpressions();

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
      let identifier = this.peekCurrentLexeme();
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

    this.raiseExpectations([TokensList.Identifier, TokensList.Number]);
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
      // Allow declaration, no value.
      this.nextToken();

      return new VariableDeclaration(identifier, undefined);
    }

    if (!this.matchToken(TokensList["="])) {
      this.raiseExpectation(TokensList["="]);
    }

    this.nextToken();

    const value = this.parseExpressions();

    return new VariableDeclaration(identifier, value);
  }

  parseConstantAssignment() {
    this.nextToken();

    if (!this.matchToken(TokensList.Identifier)) {
      this.raiseExpectation(TokensList.Identifier);
    }

    const identifier = this.peekCurrentLexeme();
    this.nextToken();

    // Require value upon declaration
    if (!this.matchToken(TokensList["="])) {
      this.raiseExpectation(TokensList["="]);
    }

    this.nextToken();

    const value = this.parseExpressions();

    return new ConstantAssignment(identifier, value);
  }

  parseAssignment(identifier) {
    const operator = this.peekCurrentLexeme();
    this.nextToken();
    const value = this.parseExpressions();
    return new Assignment(identifier, operator, value);
  }

  parseFunctionCall(identifier) {
    if (!this.matchToken(TokensList["("])) {
      this.raiseExpectation(TokensList["("]);
    }

    this.nextToken();

    // For function call
    const parameters = this.parseFunctionCallParameters();

    if (!this.matchToken(TokensList[")"])) {
      this.raiseExpectation(TokensList[")"]);
    }

    this.nextToken();

    if (!this.matchToken(TokensList[";"])) {
      this.raiseExpectation(TokensList[";"]);
    }

    this.nextToken();
    return new FunctionCall(identifier, parameters);
  }

  parseIdentifierStart() {
    const identifier = this.peekCurrentLexeme();

    this.nextToken();

    const assignmentTokens = [
      TokensList["="],
      TokensList["+="],
      TokensList["-="],
      TokensList["*="],
      TokensList["/="],
      TokensList["%="],
      TokensList["^="]
    ];

    // For assignment statements

    if (assignmentTokens.includes(this.peekCurrentToken())) {
      return this.parseAssignment(identifier);
    }

    if (!this.matchToken(TokensList["("])) {
      this.raiseExpectations([...assignmentTokens, TokensList["("]]);
    }

    return this.parseFunctionCall(identifier);
  }

  parseRoutine() {
    this.nextToken();
    const identifier = this.peekCurrentLexeme();

    if (!this.matchToken(TokensList.Identifier)) {
      this.raiseExpectation(TokensList.Identifier);
    }

    this.nextToken();

    if (this.peekCurrentToken() !== TokensList["("]) {
      this.raiseExpectation(TokensList["("]);
    }

    this.nextToken();

    const parameters = this.parseFunctionDefinitionParameters();

    if (this.peekCurrentToken() !== TokensList[")"]) {
      this.raiseExpectation(TokensList[")"]);
    }

    this.nextToken();

    if (this.peekCurrentToken() !== TokensList["{"]) {
      this.raiseExpectation(TokensList["{"]);
    }

    this.nextToken();

    const statements = this.parseBlock();
    this.nextToken();

    return new Function(identifier, parameters, statements);
  }

  parseFunctionDefinitionParameters() {
    const params = [];

    while (this.matchToken(TokensList.Identifier)) {
      params.push(new Identifier(this.peekCurrentLexeme()));
      this.nextToken();

      if (!this.matchToken(TokensList[","])) {
        break;
      }

      this.nextToken();

      if (!this.matchToken(TokensList.Identifier)) {
        this.raiseExpectation(TokensList.Identifier);
      }
    }

    return params;
  }

  parseFunctionCallParameters() {
    const params = [];

    const validTypes = [
      TokensList["cap"],
      TokensList["real"],
      TokensList.Identifier,
      TokensList.Number,
      TokensList.Float,
      TokensList.String
    ];

    while (validTypes.includes(this.peekCurrentToken())) {
      params.push(new Identifier(this.peekCurrentLexeme()));
      this.nextToken();

      if (!this.matchToken(TokensList[","])) {
        break;
      }

      this.nextToken();

      if (!validTypes.includes(this.peekCurrentToken())) {
        this.raiseExpectations(validTypes);
      }
    }

    return params;
  }

  parseBlock() {
    const statements = [];

    while (!this.matchToken(TokensList["}"])) {
      statements.push(this.parseStatements());
    }

    return statements;
  }

  parseConditions() {
    return this.beginParsingExpressions();
  }

  parseConditionals() {
    this.nextToken();

    if (!this.matchToken(TokensList["("])) {
      this.raiseExpectation(TokensList["("]);
    }

    this.nextToken();

    const conditions = this.parseConditions();

    if (!this.matchToken(TokensList[")"])) {
      this.raiseExpectation(TokensList[")"]);
    }

    this.nextToken();

    if (!this.matchToken(TokensList["{"])) {
      this.raiseExpectation(TokensList["{"]);
    }

    this.nextToken();

    const statements = this.parseBlock();
    this.nextToken();

    return new Conditional(conditions, statements);
  }

  parseConditionalYikes() {
    this.nextToken();

    if (!this.matchToken(TokensList["{"])) {
      this.raiseExpectation(TokensList["{"]);
    }

    this.nextToken();

    const statements = this.parseBlock();
    this.nextToken();

    return new Conditional(null, statements);
  }

  parseDelayFunction() {
    this.nextToken();

    if (!this.matchToken(TokensList.routine)) {
      this.raiseExpectation(TokensList.routine);
    }

    return this.parseRoutine();
  }

  parseChillRoutineCall() {
    this.nextToken();

    const identifier = this.peekCurrentLexeme();

    if (!this.matchToken(TokensList.Identifier)) {
      this.raiseExpectation(TokensList.Identifier);
    }

    this.nextToken();

    return this.parseFunctionCall(identifier);
  }

  parseStatements() {
    // Variable assignment
    if (this.peekCurrentToken() === TokensList.lit) {
      return this.parseVariableAssignment();
    }
    // Constant declaration
    else if (this.peekCurrentToken() === TokensList.fire) {
      return this.parseConstantAssignment();
    }
    // Function
    else if (this.peekCurrentToken() === TokensList.routine) {
      return this.parseRoutine();
    }
    // Delay Function
    else if (this.peekCurrentToken() === TokensList.delay) {
      return this.parseDelayFunction();
    }
    // Chill Routine
    else if (this.peekCurrentToken() === TokensList.chill) {
      return this.parseChillRoutineCall();
    }
    // Identifier start
    else if (this.peekCurrentToken() === TokensList.Identifier) {
      return this.parseIdentifierStart();
    }
    // Yeet
    else if (this.peekCurrentToken() === TokensList.yeet) {
      return this.parseConditionals();
    }
    // Yas
    else if (this.peekCurrentToken() === TokensList.yas) {
      return this.parseConditionals();
    }
    // Yikes
    else if (this.peekCurrentToken() === TokensList.yikes) {
      return this.parseConditionalYikes();
    }
    // Expression
    else {
      return this.parseExpressions();
    }
  }

  analyzeSyntax() {
    const statements = [];

    while (this.peekCurrentToken() !== TokensList.END_OF_FILE) {
      console.log(this.peekCurrentToken());
      statements.push(this.parseStatements());
    }

    return statements;
  }
}
