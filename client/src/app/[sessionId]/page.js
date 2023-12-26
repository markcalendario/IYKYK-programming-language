"use client";

import CodeEditor from "@/components/CodeEditor/CodeEditor.js";
import LexerPopup, {
  useLexerPopup
} from "@/components/LexerPopup/LexerPopup.js";
import { Fragment } from "react";
import styles from "./page.module.scss";

export default function Editor() {
  const { isVisible, setIsLexerVisibile } = useLexerPopup(false);

  const runLexer = () => {
    setIsLexerVisibile(true);
  };

  const stopLexer = () => {
    setIsLexerVisibile(false);
  };

  return (
    <Fragment>
      <EditorOptionBar runLexer={runLexer} />
      <CodeEditor />
      {isVisible ? <LexerPopup stopLexer={stopLexer} /> : null}
    </Fragment>
  );
}

function EditorOptionBar({ runLexer }) {
  return (
    <nav className={styles.editorOptionBar}>
      <div className={styles.left}>
        <a href="/">IYKYK</a>
      </div>
      <div className={styles.right}>
        <i onClick={runLexer} title="Run" className="fas fa-play fa-fw"></i>
        <i title="Share Link" className="fas fa-link fa-fw"></i>
        <i title="Delete Session" className="fas fa-trash fa-fw"></i>
      </div>
    </nav>
  );
}
