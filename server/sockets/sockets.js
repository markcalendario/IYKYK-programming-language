import {
  handleAnnounceLeaving,
  handleConnectSession,
  handleCreateSession,
  handleDeleteSession,
  handleGetCode,
  handleValidateSession,
  handleWriteCode
} from "./sockets.handler.js";

export default function handleSocket(socket) {
  socket.on("createSession", () => {
    handleCreateSession(socket);
  });

  socket.on("connectSession", (sessionId) => {
    handleConnectSession(socket, sessionId);
  });

  socket.on("disconnecting", () => {
    handleAnnounceLeaving(socket);
  });

  socket.on("validateSession", (sessionId) => {
    handleValidateSession(socket, sessionId);
  });

  socket.on("getCode", (sessionId) => {
    handleGetCode(socket, sessionId);
  });

  socket.on("writeCode", ({ sessionId, code }) => {
    handleWriteCode(socket, sessionId, code);
  });

  socket.on("deleteSession", (sessionId) => {
    handleDeleteSession(socket, sessionId);
  });
}
