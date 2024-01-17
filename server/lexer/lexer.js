import { TokensList, reservedWords } from "./tokens.js";

export default class Lexer {
  constructor(code) {
    this.code = code.trimEnd();
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

  peekNextChar() {
    let t = 5;
    return this.code[this.pos + 1];
  }

  skipWhitespace() {
    while (/^\s*$/.test(this.char)) {
      this.nextChar();
    }
  }

  isValidIdentifierStart(char) {
    const regex = /^[a-zA-Z_]+$/;
    return typeof char === "string" && regex.test(char);
  }

  isValidIdentifier(char) {
    const regex = /^[a-zA-Z0-9_]+$/;
    return typeof char === "string" && regex.test(char);
  }

  getIdentifier() {
    let identifier = "";

    while (this.isValidIdentifier(this.char)) {
      identifier += this.char;
      this.nextChar();
    }

    return identifier;
  }

  getString() {
    let string = "";

    while (this.char !== '"' && typeof this.char !== "undefined") {
      string += this.char;
      this.nextChar();
    }

    if (this.char !== '"') this.invalidToken(string);

    return string;
  }

  isNumber(char) {
    const regex = /^[0-9]+$/;
    return typeof char === "string" && regex.test(char);
  }

  getNumber() {
    let number = "";

    while (this.isNumber(this.char)) {
      number += this.char;
      this.nextChar();
    }

    if (this.char !== ".") return number;
    number += ".";
    this.nextChar();

    if (!this.isNumber(this.char)) this.invalidToken(this.char);

    while (this.isNumber(this.char)) {
      number += this.char;
      this.nextChar();
    }

    return number;
  }

  isSymbol(char) {
    const regex = /^[+\-*/%=<>&|^~!.,;:{}\[\]()?'":`#\\$@]$/;
    return typeof char === "string" && regex.test(char);
  }

  tokenizeSymbol() {
    const char = this.char;

    const multiCharSymbols = Object.keys(TokensList).filter(
      (key) => key.length === 2
    );

    const doubleChar = char + this.peekNextChar();

    if (multiCharSymbols.includes(doubleChar)) {
      this.nextChar();
      return [TokensList[doubleChar], doubleChar];
    } else if (TokensList[char]) {
      return [TokensList[char], char];
    }

    this.invalidToken(char);
  }

  invalidToken(lexeme) {
    let prevToken = this.token;
    prevToken = JSON.stringify(prevToken.pop());

    if (!prevToken) {
      prevToken = "FILE_START";
    }

    throw new Error("Invalid token: " + prevToken);
  }

  getSingleLineCommentContent() {
    let commentContent = "";

    while (this.char !== "\n" && typeof this.char === "string") {
      commentContent += this.char;
      this.nextChar();
    }

    return commentContent;
  }

  getMultiLineCommentContent() {
    let commentContent = "";

    while (
      this.char + this.peekNextChar() !== "*/" &&
      typeof this.char === "string"
    ) {
      commentContent += this.char;
      this.nextChar();
    }

    if (this.char + this.peekNextChar() !== "*/") {
      return this.invalidToken(this.char);
    }

    return commentContent;
  }

  generateToken() {
    while (typeof this.char === "string") {
      this.skipWhitespace();

      // Identifiers, Reserved Words, Keywords
      if (this.isValidIdentifierStart(this.char)) {
        const identifier = this.getIdentifier();

        if (reservedWords.includes(identifier) || !TokensList[identifier]) {
          this.pushToken(TokensList.Identifier, identifier);
        } else {
          this.pushToken(TokensList[identifier], identifier);
        }
      }

      // String
      else if (this.char === '"') {
        this.pushToken(TokensList['"'], this.char);
        this.nextChar();

        const string = this.getString();
        this.pushToken(TokensList.String, string);
        this.pushToken(TokensList['"'], this.char);
        this.nextChar();
      }

      // Numbers
      else if (this.isNumber(this.char)) {
        const number = this.getNumber();

        if (number.includes(".")) this.pushToken(TokensList.Float, number);
        else this.pushToken(TokensList.Number, number);
      }

      // Comments
      else if (this.char === "/" && this.peekNextChar() === "/") {
        this.nextChar();
        this.nextChar();
        this.pushToken(TokensList["//"], "//");
        const commentContent = this.getSingleLineCommentContent();
        this.pushToken(TokensList.Comment_Single_Content, commentContent);
      }

      // Multi-Line Comments
      else if (this.char === "/" && this.peekNextChar() === "*") {
        this.nextChar();
        this.nextChar();
        this.pushToken(TokensList["/*"], "/*");
        const commentContent = this.getMultiLineCommentContent();
        this.pushToken(TokensList.Comment_Multi_Content, commentContent);
        this.pushToken(TokensList["*/"], "*/");
        this.nextChar();
        this.nextChar();
      }

      // Symbols
      else if (this.isSymbol(this.char)) {
        const [lexeme, token] = this.tokenizeSymbol();
        this.pushToken(lexeme, token);
        this.nextChar();
      }

      // End
      else {
        this.invalidToken(this.char);
      }
    }
    return this.token;
  }
}
