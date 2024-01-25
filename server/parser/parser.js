import { TokensList } from "../lexer/tokens.js";

export default class Parser {
  variableValues = [
    TokensList.Number,
    TokensList.String,
    TokensList.Float,
    TokensList.cap,
    TokensList.real,
    TokensList.Identifier
  ];

  constructor(tokens) {
    this.tokens = tokens;
    this.tokens.push({ token: "END_OF_FILE", lexeme: "EOF" });

    this.dequeuedTokens = [];
  }

  nextToken() {
    this.dequeuedTokens.push(this.tokens.shift());
    console.log(this.dequeuedTokens[this.dequeuedTokens.length - 1]);
  }

  peekCurrentToken() {
    const tokens = [...this.tokens];
    return tokens.shift().token;
  }

  peekCurrentLexeme() {
    const tokens = [...this.tokens];
    return tokens.shift().lexeme;
  }

  peekPrevToken() {
    const dequeuedTokens = [...this.dequeuedTokens];
    return dequeuedTokens.pop().token;
  }

  peekPrevLexeme() {
    const dequeuedTokens = [...this.dequeuedTokens];
    console.log(dequeuedTokens);
    return dequeuedTokens.pop().lexeme;
  }

  throwExpectation(expectedToken) {
    throw new Error(
      `Expected token "${expectedToken}" after "${this.peekPrevLexeme()}" (${this.peekPrevToken()}) but encountered "${this.peekCurrentLexeme()}" (${this.peekCurrentToken()}).`
    );
  }

  parseVariableAssignment() {
    while (true) {
      if (this.peekCurrentToken() !== TokensList.Identifier) {
        this.throwExpectation(TokensList.Identifier);
      }

      this.nextToken();

      if (this.peekCurrentToken() === TokensList[","]) {
        this.nextToken();
        continue;
      }

      if (this.peekCurrentToken() === TokensList[";"]) break;

      if (this.peekCurrentToken() !== TokensList["="]) {
        this.throwExpectation(TokensList["="]);
      }

      this.nextToken();

      if (!this.variableValues.includes(this.peekCurrentToken())) {
        this.throwExpectation(this.variableValues.join(" | "));
      }

      this.nextToken();

      if (this.peekCurrentToken() === TokensList[","]) {
        this.nextToken();
        continue;
      }

      if (this.peekCurrentToken() !== TokensList[";"]) {
        this.throwExpectation(TokensList[";"]);
      } else {
        break;
      }
    }
  }

  parseConstantAssignment() {
    while (true) {
      if (this.peekCurrentToken() !== TokensList.Identifier) {
        this.throwExpectation(TokensList.Identifier);
      }

      this.nextToken();

      if (this.peekCurrentToken() !== TokensList["="]) {
        this.throwExpectation(TokensList["="]);
      }

      this.nextToken();

      if (!this.variableValues.includes(this.peekCurrentToken())) {
        this.throwExpectation(this.variableValues.join(" | "));
      }

      this.nextToken();

      if (this.peekCurrentToken() === TokensList[","]) {
        this.nextToken();
        continue;
      }

      if (this.peekCurrentToken() === TokensList[";"]) break;
    }
  }

  analyzeSyntax() {
    while (this.tokens.length > 0) {
      const currentToken = this.peekCurrentToken();

      // Assignment
      if (currentToken === TokensList.lit) {
        this.nextToken();
        this.parseVariableAssignment();
        this.nextToken();
        continue;
      }

      if (currentToken === TokensList.fire) {
        this.nextToken();
        this.parseConstantAssignment();
        this.nextToken();
      }

      if (this.peekCurrentToken() === "END_OF_FILE") {
        this.nextToken();
        break;
      }
    }

    return 1;
  }
}
