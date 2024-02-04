"use client";

import { useParams } from "next/navigation.js";
import { useEffect, useState } from "react";
import FullPageLoader from "../FullPageLoader/FullPageLoader.js";
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

  if (doesSessionExist === null) {
    return <FullPageLoader />;
  }

  if (doesSessionExist === false) {
    return (window.location.href = "/");
  }

  return children;
}
