"use client";

import { useParams } from "next/navigation.js";
import { Fragment, useEffect, useState } from "react";
import { download } from "../DownloadFile/DownloadFile.js";
import IconButton from "../IconButtons/IconButtons.js";
import LexerPopup, { useLexerPopup } from "../LexerPopup/LexerPopup.js";
import ParserPopup, { useParserPopup } from "../ParserPopup/ParserPopup.js";
import Popup, { usePopup } from "../Popup/Popup.js";
import { readFile } from "../ReadFile/ReadFile.js";
import socket from "../Socket/Socket.js";
import styles from "./EditorOptionBar.module.scss";

export default function EditorOptionBar({ onUpload }) {
  const { sessionId } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const { isLexerVisible, toggleLexerVisibility } = useLexerPopup(false);
  const { isParserVisible, toggleParserVisibility } = useParserPopup(false);
  const { isPopupVisible, setIsPopupVisible, message, setMessage } =
    usePopup(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionId);
    setIsCopied(true);
  };

  const handleDownloadFile = () => {
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

  const handleDeleteSession = () => {
    socket.emit("deleteSession", sessionId);
  };

  const handleReceiveDeleteSession = ({ success, message }) => {
    setMessage(message);
    setIsPopupVisible(true);

    if (success) {
      window.location.reload();
    }
  };

  const toggleLexer = () => {
    toggleLexerVisibility((prev) => !prev);
  };

  const toggleParser = () => {
    toggleParserVisibility((prev) => !prev);
  };

  useEffect(() => {
    socket.on("deleteSession", handleReceiveDeleteSession);

    return () => {
      socket.off("deleteSession", handleReceiveDeleteSession);
    };
  }, [socket]);

  useEffect(() => {
    if (isCopied === false) return;

    const copyTimer = setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => clearTimeout(copyTimer);
  }, [isCopied]);

  return (
    <Fragment>
      <LexerPopup
        isVisible={isLexerVisible}
        toggleLexer={toggleLexer}
        sessionId={sessionId}
      />
      <ParserPopup
        isVisible={isParserVisible}
        toggleParser={toggleParser}
        sessionId={sessionId}
      />
      <Popup isVisible={isPopupVisible} message={message} />
      <nav className={styles.editorOptionBar}>
        <div className={styles.left}>
          <a href="/">IYKYK</a>
        </div>
        <div className={styles.right}>
          <IconButton
            onClick={toggleParser}
            title="Analyze Syntax"
            icon="fa-code"
          />
          <IconButton
            onClick={toggleLexer}
            title="Analyze Lexemes"
            icon="fas fa-play fa-fw"
          />
          <IconButton
            onClick={handleCopyLink}
            title="Share Link"
            icon={`fas fa-${isCopied ? "check" : "link"} fa-fw`}
          />
          <IconButton
            onClick={handleDeleteSession}
            title="Delete Session"
            icon="fas fa-trash fa-fw"
          />
          <IconButton
            onClick={handleUploadFile}
            title="Upload file"
            icon="fas fa-upload"
          />
          <IconButton
            onClick={handleDownloadFile}
            title="Save file"
            icon="fas fa-download"
          />
        </div>
      </nav>
    </Fragment>
  );
}
