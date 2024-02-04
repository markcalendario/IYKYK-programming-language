"use client";

import { useParams } from "next/navigation.js";
import { useEffect, useState } from "react";
import socket from "../Socket/Socket.js";

export default function SessionProtectedPage({ children }) {
  const { sessionId } = useParams();
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

  if (doesSessionExist === null || true) {
    return <p>Loading...</p>;
  }

  if (doesSessionExist === false) {
    return (window.location.href = "/");
  }

  return children;
}
