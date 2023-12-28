import { TokensList, operators } from "./tokens.js";

export default class Lexer {
  constructor(code) {
    this.code = code;
    this.pos = 0;
    this.char = code[this.pos];
    this.token = [];
  }

  pushToken(tokenType, value) {
    this.token.push({ token: tokenType, lexeme: value });
  }

  nextChar() {
    this.pos = this.pos + 1;
    this.char = this.code[this.pos];
    return this.char;
  }

  skipWhitespace() {
    while (/^\s*$/.test(this.char)) {
      this.nextChar();
    }
  }

  isValidIdentifierStart(char) {
    return typeof char === "string" && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(char);
  }

  isAlphaNumeric(char) {
    return typeof char === "string" && /^[a-zA-Z0-9]+$/.test(char);
  }

  isNumeric(char) {
    return typeof char === "string" && /^\d+$/.test(char);
  }

  isValidFloatingPointPart(char) {
    return typeof char === "string" && /[0-9.eE+-]/.test(char);
  }

  generateToken() {
    while (typeof this.char === "string") {
      this.skipWhitespace();

      if (this.char === "(") {
        this.pushToken(TokensList.OpenParenthesis, this.char);
        this.nextChar();
      } else if (this.char === ")") {
        this.pushToken(TokensList.OpenParenthesis, this.char);
        this.nextChar();
      } else if (operators.includes(this.char)) {
        this.pushToken(TokensList.Operator, this.char);
        this.nextChar();
      } else if (this.char === "=") {
        this.pushToken(TokensList.Equal, this.char);
        this.nextChar();
      } else if (this.char === ";") {
        this.pushToken(TokensList.Semicolon, this.char);
        this.nextChar();
      } else if (this.char === "{") {
        this.pushToken(TokensList.OpenBrace, this.char);
        this.nextChar();
      } else if (this.char === "}") {
        this.pushToken(TokensList.CloseBrace, this.char);
        this.nextChar();
      } else if (this.char === "[") {
        this.pushToken(TokensList.OpenBracket, this.char);
        this.nextChar();
      } else if (this.char === "]") {
        this.pushToken(TokensList.CloseBracket, this.char);
        this.nextChar();
      } else if (this.char === "!") {
        this.pushToken(TokensList.LogicalNot, this.char);
        this.nextChar();
      } else if (this.char === "&" && this.nextChar() === "&") {
        this.pushToken(TokensList.LogicalAnd, "&&");
        this.nextChar();
      } else if (this.char === "|" && this.nextChar() === "|") {
        this.pushToken(TokensList.LogicalAnd, "||");
        this.nextChar();
      }

      // Multi-character

      // Identifiers, Keywords, Reserved Words
      else if (this.isValidIdentifierStart(this.char)) {
        let identifier = "";

        while (this.isAlphaNumeric(this.char)) {
          identifier += this.char;
          this.nextChar();
        }

        if (identifier === "flex") {
          this.pushToken(TokensList.Flex, identifier);
        } else if (identifier === "lit") {
          this.pushToken(TokensList.Lit, identifier);
        } else if (identifier === "yeet") {
          this.pushToken(TokensList.ConditionalYeet, identifier);
        } else if (identifier === "yikes") {
          this.pushToken(TokensList.ConditionalYeet, identifier);
        } else {
          this.pushToken(TokensList.Identifier, identifier);
        }
      }

      // Numbers
      else if (this.isNumeric(this.char)) {
        let numbers = "";

        while (this.isValidFloatingPointPart(this.char)) {
          numbers += this.char;
          this.nextChar();
        }

        this.pushToken(TokensList.Number, numbers);
      }

      // Strings
      else if (this.char === '"') {
        this.pushToken(TokensList.DoubleQuote, this.char);
        this.nextChar(); // avoid leading quotation mark
        let string = "";

        while (typeof this.char === "string" && this.char !== '"') {
          string += this.char;
          this.nextChar();
        }

        if (this.char === '"') {
          this.pushToken(TokensList.String, string);
          this.pushToken(TokensList.DoubleQuote, this.char);
          this.nextChar(); // move past the closing quotation mark
        } else {
          throw new Error("Unterminated string: " + string);
        }
      } else {
        throw new Error("Unrecognized token: " + this.char);
      }
    }
    return this.token;
  }
}
