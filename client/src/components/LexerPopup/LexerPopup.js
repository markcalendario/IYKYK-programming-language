"use client";

import { useCallback, useEffect, useState } from "react";
import socket from "../Socket/Socket.js";
import Table from "../Table/Table.js";
import styles from "./LexerPopup.module.scss";

export default function LexerPopup({ isVisible, toggleLexer, sessionId }) {
  const [lexResult, setLexResult] = useState(null);

  const handleLex = () => {
    socket.emit("lex", sessionId);
  };

  const handleReceiveLex = useCallback(({ success, message, tokens }) => {
    setLexResult({ success, message, tokens });
  });

  useEffect(() => {
    if (!isVisible) return;

    handleLex();

    socket.on("lex", handleReceiveLex);
    return () => socket.off("lex", handleReceiveLex);
  }, [isVisible, sessionId]);

  if (!isVisible || !lexResult) return null;

  const { success, message, tokens } = lexResult;

  return (
    <div className={styles.lexerPopup}>
      <div className={styles.top}>
        <h1>Lexer Result</h1>
        <i onClick={toggleLexer} className="fas fa-pause fa-fw" />
      </div>
      <div className={styles[success ? "success" : "error"]}>
        <p>{message}</p>
      </div>
      <TokensTable tokens={tokens} />
    </div>
  );
}

export function TokensTable({ tokens }) {
  const displayTokens = () => {
    return tokens.map(({ token, lexeme }, index) => (
      <tr key={index}>
        <td data-head="Lexeme">{lexeme}</td>
        <td data-head="Token">{token}</td>
      </tr>
    ));
  };

  if (!tokens) return;

  return (
    <Table>
      <thead>
        <tr>
          <th>Lexemes</th>
          <th>Tokens</th>
        </tr>
      </thead>
      <tbody>{displayTokens()}</tbody>
    </Table>
  );
}

export function useLexerPopup(visibility) {
  const [isLexerVisible, setIsLexerVisible] = useState(visibility);

  const toggleLexerVisibility = () => {
    setIsLexerVisible((prev) => !prev);
  };

  return { isLexerVisible, toggleLexerVisibility };
}
