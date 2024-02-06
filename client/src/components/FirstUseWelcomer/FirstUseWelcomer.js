import { Fragment, useEffect, useState } from "react";
import Button from "../Buttons/Buttons.js";
import styles from "./FirstUseWelcomer.module.scss";

// Simulate loading
export default function FirstUseWelcomer() {
  const [currentTextIdx, setCurrentTextIdx] = useState(0);
  const text = [
    "Welcome to IYKYK Portal.",
    "Initializing for first use...",
    "Setting up the lexer...",
    "Setting up the parser...",
    <Fragment key={Math.random()}>
      Components loaded! Feel free to reach{" "}
      <a target="_blank" href="https://github.com/markcalendario">
        Calendario, Mark Kenneth
      </a>{" "}
      for more info.
    </Fragment>
  ];

  const handleStartPortal = () => {
    localStorage.setItem("NOT_FIRST_USE", "1");
    window.location.reload();
  };

  useEffect(() => {
    // Preload the background image
    const img = new Image();
    img.src = "/assets/images/background.svg";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIdx((prev) => (prev + 1) % text.length);
    }, 2000);

    if (currentTextIdx >= text.length - 1) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [currentTextIdx, text.length]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <svg>
          <text x="50%" y="50%" dy=".35em" textAnchor="middle">
            IYKYK
          </text>
        </svg>
        <p>{text[currentTextIdx]}</p>
        {<Button onClick={handleStartPortal}>Start the Portal</Button>}
      </div>
    </div>
  );
}
