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

  const toggleLexer = () => {
    setIsLexerVisible((prev) => !prev);
  };

  const handleReceiveConnectSession = ({ success, message, name }) => {
    setMessage(`${name} has joined the coding session.`);
    setIsPopupVisible(true);
  };

  const handleAnnounceLeaving = () => {
    setMessage("Someone has left the session.");
    setIsPopupVisible(true);
  };

  useEffect(() => {
    socket.emit("connectSession", sessionId);
    socket.on("connectSession", handleReceiveConnectSession);
    socket.on("announceLeaving", handleAnnounceLeaving);
  }, []);

  return (
    <Fragment>
      <Popup isVisible={isPopupVisible} message={message} />
      <EditorOptionBar toggleLexer={toggleLexer} />
      <CodeEditor />
      {isLexerVisible ? <LexerPopup toggleLexer={toggleLexer} /> : null}
    </Fragment>
  );
}

function EditorOptionBar({ toggleLexer }) {
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
          <i
            onClick={toggleLexer}
            title="Run"
            className="fas fa-play fa-fw"></i>
          <i
            onClick={handleCopyLink}
            title="Share Link"
            className="fas fa-link fa-fw"></i>
          <i title="Delete Session" className="fas fa-trash fa-fw"></i>
          <i title="Upload file" className="fas fa-upload"></i>
          <i title="Save file" className="fas fa-save"></i>
        </div>
      </nav>
    </Fragment>
  );
}
