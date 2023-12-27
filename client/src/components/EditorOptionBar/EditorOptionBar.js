"use client";

import { useParams } from "next/navigation.js";
import { Fragment, useEffect, useState } from "react";
import { download } from "../DownloadFile/DownloadFile.js";
import Popup, { usePopup } from "../Popup/Popup.js";
import { readFile } from "../ReadFile/ReadFile.js";
import styles from "./EditorOptionBar.module.scss";

export default function EditorOptionBar({ toggleLexer, onUpload }) {
  const { sessionId } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const { isPopupVisible, setIsPopupVisible, message, setMessage } =
    usePopup(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionId);
    setIsCopied(true);
  };

  const handleDownloadFile = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/codes/download/${sessionId}`;
    download(url);
  };

  const handleUploadFile = async () => {
    try {
      const content = await readFile();
      onUpload(content);
      setMessage("IYKYK File has been uploaded.");
    } catch (error) {
      setMessage(error.message);
    }
    setIsPopupVisible(true);
  };

  useEffect(() => {
    if (isCopied === false) return;

    const copyTimer = setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => clearTimeout(copyTimer);
  }, [isCopied]);

  return (
    <Fragment>
      <Popup isVisible={isPopupVisible} message={message} />
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
          <i
            onClick={handleUploadFile}
            title="Upload file"
            className="fas fa-upload"
          />
          <i
            onClick={handleDownloadFile}
            title="Save file"
            className="fas fa-download"
          />
        </div>
      </nav>
    </Fragment>
  );
}
