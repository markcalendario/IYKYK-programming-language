import { v4 as uuidv4 } from "uuid";

export function handleCreateSession(socket) {
  const session = uuidv4();
  socket.emit("createSession", {
    success: true,
    message: "Success creating session.",
    session
  });
}

export function handleConnectSession(socket, sessionId) {
  socket.join(sessionId);
  socket.to(sessionId).emit("connectSession", {
    success: true,
    message: "Success joining a session.",
    name: "Mark"
  });
}
