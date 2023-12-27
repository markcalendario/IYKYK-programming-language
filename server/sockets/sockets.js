import {
  handleAnnounceLeaving,
  handleConnectSession,
  handleCreateSession
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
}
