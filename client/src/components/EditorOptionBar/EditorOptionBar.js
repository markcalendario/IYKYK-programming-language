"use client";

import { useParams } from "next/navigation.js";
import { Fragment, useEffect, useState } from "react";
import styles from "./EditorOptionBar.module.scss";

export default function EditorOptionBar({ toggleLexer }) {
  const [isCopied, setIsCopied] = useState(false);
  const { sessionId } = useParams();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionId);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied === false) return;

    const copyTimer = setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => {
      clearTimeout(copyTimer);
    };
  }, [isCopied]);

  return (
    <Fragment>
      <nav className={styles.editorOptionBar}>
        <div className={styles.left}>
          <a href="/">IYKYK</a>
        </div>
        <div className={styles.right}>
          <i onClick={toggleLexer} title="Run" className="fas fa-play fa-fw" />
          <i
            onClick={handleCopyLink}
            title="Share Link"
            className={`fas fa-${isCopied ? "check" : "link"} fa-fw`}
          />
          <i title="Delete Session" className="fas fa-trash fa-fw" />
          <i title="Upload file" className="fas fa-upload" />
          <i title="Save file" className="fas fa-save" />
        </div>
      </nav>
    </Fragment>
  );
}
