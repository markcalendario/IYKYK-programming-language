"use client";

import { useState } from "react";
import Table from "../Table/Table.js";
import styles from "./LexerPopup.module.scss";

export default function LexerPopup({ stopLexer }) {
  return (
    <div className={styles.lexerPopup}>
      <div className={styles.top}>
        <h1>Lexer Result</h1>
        <i onClick={stopLexer} className="fas fa-pause fa-fw" />
      </div>
      <Table>
        <thead>
          <tr>
            <th>Lexemes</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-head="Lexemes">if</td>
            <td data-head="Description">IF_STATEMENT</td>
          </tr>
          <tr>
            <td data-head="Lexemes">(</td>
            <td data-head="Description">OPEN_PARENTHESIS</td>
          </tr>
          <tr>
            <td data-head="Lexemes">(</td>
            <td data-head="Description">OPEN_PARENTHESIS</td>
          </tr>
          <tr>
            <td data-head="Lexemes">(</td>
            <td data-head="Description">OPEN_PARENTHESIS</td>
          </tr>
        </tbody>
      </Table>
      <div className={styles.error}>
        <p>An error occured.</p>
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
