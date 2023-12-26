import CodeEditor from "@/components/CodeEditor/CodeEditor.js";
import { Fragment } from "react";
import styles from "./page.module.scss";

export default function Editor() {
  return (
    <Fragment>
      <EditorOptionBar />
      <CodeEditor />
    </Fragment>
  );
}

function EditorOptionBar() {
  return (
    <nav className={styles.editorOptionBar}>
      <div className={styles.left}>
        <a href="/">IYKYK</a>
      </div>
      <div className={styles.right}>
        <i title="Run" className="fas fa-play fa-fw"></i>
        <i title="Share Link" className="fas fa-link fa-fw"></i>
        <i title="Delete Session" className="fas fa-trash fa-fw"></i>
      </div>
    </nav>
  );
}
