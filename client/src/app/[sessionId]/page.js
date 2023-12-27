"use client";

import CodeEditor from "@/components/CodeEditor/CodeEditor.js";
import LexerPopup, {
  useLexerPopup
} from "@/components/LexerPopup/LexerPopup.js";
import Popup, { usePopup } from "@/components/Popup/Popup.js";
import socket from "@/components/Socket/Socket.js";
import { useParams } from "next/navigation.js";
import { Fragment, useEffect } from "react";
import styles from "./page.module.scss";

export default function Editor() {
  const { isLexerVisible, setIsLexerVisible } = useLexerPopup(false);
  const { sessionId } = useParams();
  const { isPopupVisible, setIsPopupVisible, message, setMessage } =
    usePopup(false);

  const runLexer = () => {
    setIsLexerVisible(true);
  };

  const stopLexer = () => {
    setIsLexerVisible(false);
  };

  const handleReceiveConnectSession = ({ success, message, name }) => {
    setMessage(`${name} has joined the coding session.`);
    setIsPopupVisible(true);
  };

  useEffect(() => {
    socket.emit("connectSession", sessionId);
    socket.on("connectSession", handleReceiveConnectSession);
  }, []);

  return (
    <Fragment>
      <Popup isVisible={isPopupVisible} message={message} />
      <EditorOptionBar runLexer={runLexer} />
      <CodeEditor />
      {isLexerVisible ? <LexerPopup stopLexer={stopLexer} /> : null}
    </Fragment>
  );
}

function EditorOptionBar({ runLexer }) {
  const { isPopupVisible, setIsPopupVisible, message, setMessage } =
    usePopup(false);
  const { sessionId } = useParams();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionId);
    setIsPopupVisible(true);
    setMessage("Session ID has been copied.");
  };

  return (
    <Fragment>
      <Popup isVisible={isPopupVisible} message={message} />
      <nav className={styles.editorOptionBar}>
        <div className={styles.left}>
          <a href="/">IYKYK</a>
        </div>
        <div className={styles.right}>
          <i onClick={runLexer} title="Run" className="fas fa-play fa-fw"></i>
          <i
            onClick={handleCopyLink}
            title="Share Link"
            className="fas fa-link fa-fw"></i>
          <i title="Delete Session" className="fas fa-trash fa-fw"></i>
        </div>
      </nav>
    </Fragment>
  );
}
