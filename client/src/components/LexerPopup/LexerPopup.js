"use client";

import { useState } from "react";
import styles from "./LexerPopup.module.scss";

export default function LexerPopup({ stopLexer }) {
  return (
    <div className={styles.lexerPopup}>
      <div className={styles.top}>
        <h1>Lexer Result</h1>
        <i onClick={stopLexer} className="fas fa-pause fa-fw" />
      </div>
    </div>
  );
}

export function useLexerPopup(visibility) {
  const [isVisible, setIsVIsible] = useState(visibility);

  const setIsLexerVisibile = (visibility) => {
    setIsVIsible(visibility);
  };

  return { isVisible, setIsLexerVisibile };
}
