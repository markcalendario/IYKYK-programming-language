"use client";

import CodeEditor from "@/components/CodeEditor/CodeEditor.js";
import EditorOptionBar from "@/components/EditorOptionBar/EditorOptionBar.js";
import Popup, { usePopup } from "@/components/Popup/Popup.js";
import SessionProtectedPage from "@/components/RouteProtections/SessionProtectedPage.js";
import socket from "@/components/Socket/Socket.js";
import { useParams } from "next/navigation.js";
import { Fragment, useEffect, useState } from "react";

export default function EditorCompiled() {
  return (
    <SessionProtectedPage>
      <Editor />
    </SessionProtectedPage>
  );
}

function Editor() {
  const { sessionId } = useParams();
  const [code, setCode] = useState(null);

  const { isPopupVisible, setIsPopupVisible, message, setMessage } =
    usePopup(false);

  const handleReceiveConnectSession = ({ success, message, name }) => {
    setMessage(`${name} has joined the coding session.`);
    setIsPopupVisible(true);
  };

  const handleAnnounceLeaving = () => {
    setMessage("Someone has left the session.");
    setIsPopupVisible(true);
  };

  const handleReceiveGetCode = ({ success, message, code }) => {
    if (success) setCode(code);
  };

  const handleCodeChange = (text) => {
    setCode(text);
    socket.emit("writeCode", { sessionId: sessionId, code: text });
    socket.emit("lex", sessionId);
    socket.emit("parse", sessionId);
  };

  const handleReceiveWriteCode = ({ success, message, code }) => {
    if (success) setCode(code);
  };

  useEffect(() => {
    socket.emit("connectSession", sessionId);
    socket.emit("getCode", sessionId);

    socket.on("getCode", handleReceiveGetCode);
    socket.on("connectSession", handleReceiveConnectSession);
    socket.on("announceLeaving", handleAnnounceLeaving);
    socket.on("writeCode", handleReceiveWriteCode);

    return () => {
      socket.off("getCode", handleReceiveGetCode);
      socket.off("connectSession", handleReceiveConnectSession);
      socket.off("announceLeaving", handleAnnounceLeaving);
      socket.off("writeCode", handleReceiveWriteCode);
    };
  }, []);

  return (
    <Fragment>
      <Popup isVisible={isPopupVisible} message={message} />
      <EditorOptionBar onUpload={handleCodeChange} />
      <CodeEditor code={code} onChange={handleCodeChange} />
    </Fragment>
  );
}
