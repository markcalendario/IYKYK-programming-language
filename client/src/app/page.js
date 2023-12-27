"use client";

import Button from "@/components/Buttons/Buttons.js";
import Input from "@/components/Inputs/Inputs.js";
import socket from "@/components/Socket/Socket.js";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Home() {
  const [sessionId, setSessionId] = useState("");

  const handleCreateSession = () => {
    socket.emit("createSession");
  };

  const handleReceiveCreateSession = ({ success, message, session }) => {
    window.location.href = "/" + session;
  };

  const handleConnectSession = () => {
    window.location.href = "/" + sessionId;
  };

  const handleSessionIdChange = (evt) => {
    setSessionId(evt.target.value);
  };

  useEffect(() => {
    socket.on("createSession", handleReceiveCreateSession);
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>IYKYK</h1>
          <p className={styles.description}>
            Welcome to IYKYK Lexical Analyzer
          </p>
          <Input
            placeholder="Session ID"
            value={sessionId}
            onChange={handleSessionIdChange}
          />
          <Button className={styles.join} onClick={handleConnectSession}>
            Join Session
          </Button>
          <hr />
          <Button className={styles.createNew} onClick={handleCreateSession}>
            Create Session
          </Button>
        </div>
      </div>
    </div>
  );
}
