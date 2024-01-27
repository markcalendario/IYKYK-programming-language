"use state";

import { useCallback, useEffect, useState } from "react";
import Highlight from "../Highlight/Highlight.js";
import IconButton from "../IconButtons/IconButtons.js";
import socket from "../Socket/Socket.js";
import styles from "./ParserPopup.module.scss";

export default function ParserPopup({ isVisible, toggleParser, sessionId }) {
  const [parserResult, setParserResult] = useState(null);

  const handleParse = useCallback(() => {
    socket.emit("parse", sessionId);
  }, []);

  const handleReceiveParse = useCallback(({ success, message, tree }) => {
    console.log(tree);
    setParserResult({ success, message, tree });
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    handleParse();

    socket.on("parse", handleReceiveParse);
    return () => socket.off("parse", handleReceiveParse);
  }, [handleParse, handleReceiveParse, isVisible, sessionId]);

  if (!isVisible || !parserResult) {
    return;
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.parserPopup}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.heading}>
              <h1>Parser Result</h1>
              <IconButton icon="fa-times" onClick={toggleParser} />
            </div>
            <div className="body">
              <Highlight
                message={parserResult.message}
                type={parserResult.success ? "success" : "error"}
              />
            </div>
            <p>{JSON.stringify(parserResult?.tree, null, 2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useParserPopup(visibility) {
  const [isParserVisible, setIsParserVisible] = useState(visibility);

  const toggleParserVisibility = () => {
    setIsParserVisible((prev) => !prev);
  };

  return { isParserVisible, toggleParserVisibility };
}
