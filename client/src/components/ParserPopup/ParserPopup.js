"use state";

import { useState } from "react";
import Highlight from "../Highlight/Highlight.js";
import IconButton from "../IconButtons/IconButtons.js";
import styles from "./ParserPopup.module.scss";

export default function ParserPopup({ isVisible, toggleParser, sessionId }) {
  if (!isVisible) {
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
                message="There were no syntactical format errors found."
                type="success"
              />
            </div>
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
