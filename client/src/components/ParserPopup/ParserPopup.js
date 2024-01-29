"use state";

import { useCallback, useEffect, useState } from "react";
import ReactJson from "react-json-view";

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
    <div className={styles.parserPopup}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.heading}>
            <h1>Parser Result</h1>
            <IconButton icon="fa-times" onClick={toggleParser} />
          </div>
          <div className={styles.body}>
            <Highlight
              message={parserResult.message}
              type={parserResult.success ? "success" : "error"}
            />

            {parserResult.tree && (
              <ReactJson
                src={parserResult.tree}
                style={{ overflow: "auto" }}
                theme="grayscale"
                displayArrayKey={false}
                indentWidth={3}
                displayObjectSize={false}
                displayDataTypes={false}
                enableClipboard={false}
                collapsed={false}
              />
            )}
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
