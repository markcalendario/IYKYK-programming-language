import { v4 as uuidv4 } from "uuid";
import { getName } from "./sockets.utils.js";

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
    name: getName()
  });
}

export function handleAnnounceLeaving(socket) {
  for (const room of socket.rooms) {
    socket.to(room).emit("announceLeaving");
    socket.leave(room);
  }
}
