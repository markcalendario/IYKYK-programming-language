import {
  TokensList,
  assignmentTokens,
  htmlTagAttributes,
  htmlTags
} from "../lexer/tokens.js";
import {
  Assignment,
  Bet,
  BinaryExpression,
  Bool,
  Bounce,
  Conditional,
  ConstantAssignment,
  Dead,
  Flex,
  Float,
  Function,
  FunctionCall,
  Gotcha,
  Htmlize,
  Identifier,
  MultiComment,
  NegativeFloat,
  NegativeIdentifier,
  NegativeNumber,
  Number,
  Periodt,
  Relapse,
  SingleComment,
  Slay,
  Spill,
  String,
  Sus,
  Swerve,
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

  prevToken() {
    this.tokens.unshift(this.parsedTokens.pop());
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

    this.raiseExpectations([
      TokensList.Identifier,
      TokensList.Number,
      TokensList["++"],
      TokensList["--"],
      TokensList.String,
      TokensList.Float,
      TokensList.Boolean
    ]);
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

  parseSpill(identifier = undefined) {
    this.nextToken();

    if (!this.matchToken(TokensList["("])) {
      this.raiseExpectation(TokensList["("]);
    }
    this.nextToken();

    if (!this.matchToken(TokensList[")"])) {
      this.raiseExpectation(TokensList[")"]);
    }
    this.nextToken();

    if (!this.matchToken(TokensList[";"])) {
      this.raiseExpectation(TokensList[";"]);
    }
    this.nextToken();

    return new Spill(identifier);
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

    if (this.matchToken(TokensList.spill)) {
      return this.parseSpill(identifier);
    }

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

    if (this.matchToken(TokensList.spill)) {
      return this.parseSpill(identifier);
    }

    const value = this.parseExpressions();

    return new ConstantAssignment(identifier, value);
  }

  parseAssignment(identifier) {
    const operator = this.peekCurrentLexeme();
    this.nextToken();

    if (this.matchToken(TokensList.spill)) {
      return this.parseSpill(identifier);
    }

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

    if (
      !assignmentTokens.includes(this.peekCurrentToken()) &&
      !this.matchToken(TokensList["("])
    ) {
      this.prevToken();
      return this.parseExpressions();
    }

    // For assignment statements

    if (assignmentTokens.includes(this.peekCurrentToken())) {
      return this.parseAssignment(identifier);
    }

    // Function call

    if (this.matchToken(TokensList["("])) {
      return this.parseFunctionCall(identifier);
    }
  }

  parseRoutine() {
    this.nextToken();
    const identifier = this.peekCurrentLexeme();

    if (!this.matchToken(TokensList.Identifier)) {
      this.raiseExpectation(TokensList.Identifier);
    }

    this.nextToken();

    if (!this.matchToken(TokensList["("])) {
      this.raiseExpectation(TokensList["("]);
    }

    this.nextToken();

    const parameters = this.parseFunctionDefinitionParameters();

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
      TokensList['"']
    ];

    while (validTypes.includes(this.peekCurrentToken())) {
      // Boolean
      if (
        this.matchToken(TokensList["cap"]) ||
        this.matchToken(TokensList["real"])
      ) {
        params.push(new Bool(this.peekCurrentLexeme()));
      }
      // Identifier
      else if (this.matchToken(TokensList.Identifier)) {
        params.push(new Identifier(this.peekCurrentLexeme()));
      }
      // Number
      else if (this.matchToken(TokensList.Number)) {
        params.push(new Number(this.peekCurrentLexeme()));
      }
      // Float
      else if (this.matchToken(TokensList.Float)) {
        params.push(new Float(this.peekCurrentLexeme()));
      }
      // String
      else if (this.matchToken(TokensList['"'])) {
        this.nextToken();
        params.push(new String(this.peekCurrentLexeme()));
        this.nextToken();
      }

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

  parseConditionalYas() {
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

  parseSus() {
    this.nextToken();

    if (!this.matchToken(TokensList["{"])) {
      this.raiseExpectation(TokensList["{"]);
    }

    this.nextToken();

    const statements = this.parseBlock();

    if (!this.matchToken(TokensList["}"])) {
      this.raiseExpectation(TokensList["}"]);
    }

    this.nextToken();
    return new Sus(statements);
  }

  parseDead() {
    this.nextToken();

    if (!this.matchToken(TokensList.Identifier)) {
      this.raiseExpectation(TokensList.Identifier);
    }

    this.nextToken();

    if (!this.matchToken(TokensList["{"])) {
      this.raiseExpectation(TokensList["{"]);
    }

    this.nextToken();

    const statements = this.parseBlock();

    if (!this.matchToken(TokensList["}"])) {
      this.raiseExpectation(TokensList["}"]);
    }

    this.nextToken();
    return new Dead(statements);
  }

  parseGotcha() {
    this.nextToken();

    if (!this.matchToken(TokensList["{"])) {
      this.raiseExpectation(TokensList["{"]);
    }

    this.nextToken();

    const statements = this.parseBlock();

    if (!this.matchToken(TokensList["}"])) {
      this.raiseExpectation(TokensList["}"]);
    }

    this.nextToken();
    return new Gotcha(statements);
  }

  parseSlayMessageIdentifier() {
    const identifier = this.peekCurrentLexeme();
    this.nextToken();

    if (!this.matchToken(TokensList[";"])) {
      this.raiseExpectation(TokensList[";"]);
    }

    this.nextToken();

    return new Slay(TokensList.Identifier, identifier);
  }

  parseSlayMessageString() {
    if (!this.matchToken(TokensList.String)) {
      this.raiseExpectation(TokensList.String);
    }

    const message = this.peekCurrentLexeme();

    this.nextToken();

    if (!this.matchToken(TokensList['"'])) {
      this.raiseExpectation(TokensList['"']);
    }

    this.nextToken();

    if (!this.matchToken(TokensList[";"])) {
      this.raiseExpectation(TokensList[";"]);
    }

    this.nextToken();

    return new Slay(TokensList.String, message);
  }

  parseSlay() {
    this.nextToken();

    if (
      !this.matchToken(TokensList['"']) &&
      !this.matchToken(TokensList.Identifier)
    ) {
      this.raiseExpectations([TokensList.String, TokensList.Identifier]);
    }

    if (this.matchToken(TokensList.Identifier)) {
      return this.parseSlayMessageIdentifier();
    }

    // Advance after first colon
    this.nextToken();

    return this.parseSlayMessageString();
  }

  parseRelapse() {
    this.nextToken();

    if (!this.matchToken(TokensList["("])) {
      this.raiseExpectation(TokensList["("]);
    }
    this.nextToken();

    // as : optional
    let asType = null;
    let asValue = null;

    if (this.matchToken(TokensList.as)) {
      this.nextToken();

      if (!this.matchToken(TokensList[":"])) {
        this.raiseExpectation(TokensList[":"]);
      }
      this.nextToken();

      if (!this.matchToken(TokensList.Identifier)) {
        this.raiseExpectation(TokensList.Identifier);
      }

      asType = this.peekCurrentToken();
      asValue = this.peekCurrentLexeme();

      this.nextToken();

      if (!this.matchToken(TokensList[";"])) {
        this.raiseExpectation(TokensList[";"]);
      }
      this.nextToken();
    }

    // worse
    if (!this.matchToken(TokensList.worse)) {
      this.raiseExpectation(TokensList.worse);
    }
    this.nextToken();

    if (!this.matchToken(TokensList[":"])) {
      this.raiseExpectation(TokensList[":"]);
    }
    this.nextToken();

    if (
      !this.matchToken(TokensList.Identifier) &&
      !this.matchToken(TokensList.Number)
    ) {
      this.raiseExpectations([TokensList.Identifier, TokensList.Number]);
    }

    const worseType = this.peekCurrentToken();
    const worseValue = this.peekCurrentLexeme();

    this.nextToken();

    if (!this.matchToken(TokensList[";"])) {
      this.raiseExpectation(TokensList[";"]);
    }
    this.nextToken();

    // recover
    if (!this.matchToken(TokensList.recover)) {
      this.raiseExpectation(TokensList.recover);
    }
    this.nextToken();

    if (!this.matchToken(TokensList[":"])) {
      this.raiseExpectation(TokensList[":"]);
    }
    this.nextToken();

    if (
      !this.matchToken(TokensList.Identifier) &&
      !this.matchToken(TokensList.Number)
    ) {
      this.raiseExpectations([TokensList.Identifier, TokensList.Number]);
    }

    const recoverType = this.peekCurrentToken();
    const recoverValue = this.peekCurrentLexeme();

    this.nextToken();

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

    return new Relapse(
      { type: asType, value: asValue },
      { type: worseType, value: worseValue },
      { type: recoverType, value: recoverValue },
      statements
    );
  }

  parseFlexArgs() {
    const args = [];

    const validArgs = [
      TokensList.Identifier,
      TokensList.String,
      TokensList.Number,
      TokensList.Float,
      TokensList.cap,
      TokensList.real
    ];

    while (
      validArgs.includes(this.peekCurrentToken()) ||
      this.matchToken(TokensList['"'])
    ) {
      if (this.matchToken(TokensList['"'])) {
        this.nextToken();
      }

      args.push(this.peekCurrentLexeme());
      this.nextToken();

      if (this.matchToken(TokensList['"'])) {
        this.nextToken();
      }

      if (!this.matchToken(TokensList["+"])) break;
      this.nextToken();

      if (this.matchToken(TokensList[")"])) {
        this.raiseExpectations(validArgs);
      }
    }

    return args;
  }

  parseFlex() {
    this.nextToken();

    if (!this.matchToken(TokensList["("])) {
      this.raiseExpectation(TokensList["("]);
    }

    this.nextToken();

    const args = this.parseFlexArgs();

    if (!this.matchToken(TokensList[")"])) {
      this.raiseExpectation(TokensList[")"]);
    }
    this.nextToken();

    if (!this.matchToken(TokensList[";"])) {
      this.raiseExpectation(TokensList[";"]);
    }
    this.nextToken();

    return new Flex(args);
  }

  parseHTMLize() {
    this.nextToken();
    const tags = [];

    if (!this.matchToken(TokensList["{"])) {
      this.raiseExpectation(TokensList["{"]);
    }
    this.nextToken();

    while (htmlTags.includes(this.peekCurrentToken())) {
      const tag = { tag: this.peekCurrentLexeme() };
      const attributes = [];

      this.nextToken();

      if (!this.matchToken(TokensList["{"])) {
        this.raiseExpectation(TokensList["{"]);
      }
      this.nextToken();

      while (htmlTagAttributes.includes(this.peekCurrentToken())) {
        const key = this.peekCurrentLexeme();
        this.nextToken();

        if (!this.matchToken(TokensList[":"])) {
          this.raiseExpectation(TokensList[":"]);
        }
        this.nextToken();

        if (this.matchToken(TokensList.Identifier)) {
          const identifier = this.peekCurrentLexeme();
          this.nextToken();
          attributes.push({ key, value: identifier });
          continue;
        } else if (this.matchToken(TokensList['"'])) {
          this.nextToken();
          const string = this.peekCurrentLexeme();
          this.nextToken();
          this.nextToken();
          attributes.push({ key, value: string });
          continue;
        }

        this.raiseExpectations([TokensList.Identifier, TokensList.String]);
      }

      if (!this.matchToken(TokensList["}"])) {
        this.raiseExpectation(TokensList["}"]);
      }
      this.nextToken();

      tags.push({ tag, ...attributes });
    }

    if (!this.matchToken(TokensList["}"])) {
      this.raiseExpectation(TokensList["}"]);
    }
    this.nextToken();

    return new Htmlize(tags);
  }

  parseAnonStatement() {
    this.nextToken();
    const statements = this.parseBlock();

    if (!this.matchToken(TokensList["}"])) {
      this.raiseExpectation(TokensList["}"]);
    }
    this.nextToken();

    return statements;
  }

  parseBounce() {
    this.nextToken();
    return new Bounce(this.parseExpressions());
  }

  parseBet() {
    this.nextToken();

    if (!this.matchToken(TokensList["("])) {
      this.raiseExpectation(TokensList["("]);
    }
    this.nextToken();

    const expression = this.beginParsingExpressions();

    if (!this.matchToken(TokensList[","])) {
      this.raiseExpectation(TokensList[","]);
    }
    this.nextToken();

    if (
      !this.matchToken(TokensList.Identifier) &&
      !this.matchToken(TokensList['"'])
    ) {
      this.raiseExpectations([TokensList.Identifier, TokensList.String]);
    }

    let valueType, value;

    if (this.matchToken(TokensList['"'])) {
      this.nextToken();
      valueType = this.peekCurrentToken();
      value = this.peekCurrentLexeme();
      this.nextToken();
    } else {
      valueType = this.peekCurrentToken();
      value = this.peekCurrentLexeme();
    }

    this.nextToken();

    if (!this.matchToken(TokensList[")"])) {
      this.raiseExpectation(TokensList[")"]);
    }
    this.nextToken();

    if (!this.matchToken(TokensList[";"])) {
      this.raiseExpectation(TokensList[";"]);
    }
    this.nextToken();

    return new Bet(value, valueType, expression);
  }

  parseSingleLineComment() {
    this.nextToken();

    if (!this.matchToken(TokensList.Comment_Single_Content)) {
      return this.raiseExpectation(TokensList.Comment_Single_Content);
    }
    const content = this.peekCurrentLexeme();
    this.nextToken();
    return new SingleComment(content);
  }

  parseMultiLineComment() {
    this.nextToken();

    if (!this.matchToken(TokensList.Comment_Multi_Content)) {
      return this.raiseExpectation(TokensList.Comment_Multi_Content);
    }

    const content = this.peekCurrentLexeme();
    this.nextToken();

    if (!this.matchToken(TokensList["*/"])) {
      return this.raiseExpectation(TokensList["*/"]);
    }
    this.nextToken();

    return new MultiComment(content);
  }

  parseSwerve() {
    this.nextToken();

    if (!this.matchToken(TokensList[";"])) {
      this.raiseExpectation(TokensList[";"]);
    }
    this.nextToken();

    return new Swerve();
  }

  parsePeriodt() {
    this.nextToken();

    if (!this.matchToken(TokensList[";"])) {
      this.raiseExpectation(TokensList[";"]);
    }
    this.nextToken();

    return new Periodt();
  }

  parseStatements() {
    // Variable assignment
    if (this.matchToken(TokensList.lit)) {
      return this.parseVariableAssignment();
    }
    // Constant declaration
    else if (this.matchToken(TokensList.fire)) {
      return this.parseConstantAssignment();
    }
    // Function
    else if (this.matchToken(TokensList.routine)) {
      return this.parseRoutine();
    }
    // Delay Function
    else if (this.matchToken(TokensList.delay)) {
      return this.parseDelayFunction();
    }
    // Chill Routine
    else if (this.matchToken(TokensList.chill)) {
      return this.parseChillRoutineCall();
    }
    // Identifier start
    else if (this.matchToken(TokensList.Identifier)) {
      return this.parseIdentifierStart();
    }
    // Yeet or Yas
    else if (
      this.matchToken(TokensList.yeet) ||
      this.matchToken(TokensList.yikes)
    ) {
      return this.parseConditionals();
    }
    // Yas
    else if (this.matchToken(TokensList.yas)) {
      return this.parseConditionalYas();
    }
    // Sus
    else if (this.matchToken(TokensList.sus)) {
      return this.parseSus();
    }
    // Dead
    else if (this.matchToken(TokensList.dead)) {
      return this.parseDead();
    }
    // Gotcha
    else if (this.matchToken(TokensList.gotcha)) {
      return this.parseGotcha();
    }
    // Slay
    else if (this.matchToken(TokensList.slay)) {
      return this.parseSlay();
    }
    // Relapse
    else if (this.matchToken(TokensList.relapse)) {
      return this.parseRelapse();
    }
    // Swerve
    else if (this.matchToken(TokensList.swerve)) {
      return this.parseSwerve();
    }
    // Periodt
    else if (this.matchToken(TokensList.periodt)) {
      return this.parseSwerve();
    }
    // Flex
    else if (this.matchToken(TokensList.flex)) {
      return this.parseFlex();
    }
    // Spill
    else if (this.matchToken(TokensList.spill)) {
      return this.parseSpill();
    }
    // HTMLize
    else if (this.matchToken(TokensList.htmlize)) {
      return this.parseHTMLize();
    }
    // Anonymous Statement
    else if (this.matchToken(TokensList["{"])) {
      return this.parseAnonStatement();
    }
    // Return
    else if (this.matchToken(TokensList.bounce)) {
      return this.parseBounce();
    }
    // Bet
    else if (this.matchToken(TokensList.bet)) {
      return this.parseBet();
    }
    // Single Comment
    else if (this.matchToken(TokensList["//"])) {
      return this.parseSingleLineComment();
    }
    // Multi Comment
    else if (this.matchToken(TokensList["/*"])) {
      return this.parseMultiLineComment();
    }
    // Expression
    else {
      return this.parseExpressions();
    }
  }

  analyzeSyntax() {
    const statements = [];

    while (!this.matchToken(TokensList.END_OF_FILE)) {
      console.log(this.peekCurrentToken());
      statements.push(this.parseStatements());
    }

    return statements;
  }
}
