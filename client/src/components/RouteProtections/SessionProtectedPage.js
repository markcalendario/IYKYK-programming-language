"use client";

import { useEffect, useState } from "react";
import socket from "../Socket/Socket.js";

export default function SessionProtectedPage({ children, sessionId }) {
  const [doesSessionExist, setDoesSessionExist] = useState(null);

  const handleReceiveValidateSession = ({
    success,
    message,
    isSessionValid
  }) => {
    setDoesSessionExist(isSessionValid);
  };

  useEffect(() => {
    socket.emit("validateSession", sessionId);
    socket.on("validateSession", handleReceiveValidateSession);
  }, []);

  if (doesSessionExist === null) {
    return <p>Loading...</p>;
  }

  if (doesSessionExist === false) {
    return (window.location.href = "/");
  }

  return children;
}
