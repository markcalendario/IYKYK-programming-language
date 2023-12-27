import {
  handleAnnounceLeaving,
  handleConnectSession,
  handleCreateSession,
  handleValidateSession
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
}
