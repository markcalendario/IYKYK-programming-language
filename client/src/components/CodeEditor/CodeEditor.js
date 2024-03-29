"use client";

import { githubDark } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import styles from "./CodeEditor.module.scss";

export default function CodeEditor({ code, onChange }) {
  if (code === null) return;

  return (
    <div className={styles.codeEditorWrapper}>
      <CodeMirror
        className={styles.codeEditor}
        theme={githubDark}
        value={code}
        onChange={onChange}
        height="calc(100vh - 60px)"
      />
    </div>
  );
}
