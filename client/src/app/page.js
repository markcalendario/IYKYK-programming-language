"use client";

import Button from "@/components/Buttons/Buttons.js";
import Input from "@/components/Inputs/Inputs.js";
import Popup, { usePopup } from "@/components/Popup/Popup.js";
import socket from "@/components/Socket/Socket.js";
import Image from "next/image.js";
import { Fragment, useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Home() {
  const [sessionId, setSessionId] = useState("");
  const { isPopupVisible, setIsPopupVisible, message, setMessage } =
    usePopup(false);

  const handleCreateSession = () => {
    socket.emit("createSession");
  };

  const handleReceiveCreateSession = ({ success, message, session }) => {
    setIsPopupVisible(true);
    setMessage(message);

    if (success) {
      window.location.href = "/" + session;
    }
  };

  const handleConnectSession = () => {
    socket.emit("validateSession", sessionId);
  };

  const handleSessionIdChange = (evt) => {
    setSessionId(evt.target.value);
  };

  const handleReceiveValidateSession = ({
    success,
    message,
    isSessionValid
  }) => {
    setMessage(message);
    setIsPopupVisible(true);

    if (isSessionValid) {
      window.location.href = "/" + sessionId;
    }
  };

  useEffect(() => {
    socket.on("createSession", handleReceiveCreateSession);
    socket.on("validateSession", handleReceiveValidateSession);
  }, [sessionId]);

  return (
    <Fragment>
      <Popup isVisible={isPopupVisible} message={message} />
      <div className={styles.home}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.imageContainer}>
              <Image
                className={styles.logo}
                src="/assets/images/logo.png"
                fill
              />
            </div>
            <div styles={styles.texts}>
              <h1 className={styles.title}>IYKYK</h1>
              <p className={styles.description}>If You Know You Know</p>
            </div>
            <Input
              placeholder="Session ID"
              value={sessionId}
              onChange={handleSessionIdChange}
            />
            <Button className={styles.join} onClick={handleConnectSession}>
              Join Room
            </Button>
            <hr />
            <Button className={styles.createNew} onClick={handleCreateSession}>
              Create Room
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
