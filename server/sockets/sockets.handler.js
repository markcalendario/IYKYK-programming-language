import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { currentDir, doesSessionFileExist, getName } from "./sockets.utils.js";

export async function handleCreateSession(socket) {
  const session = uuidv4();

  const sessionsFolder = path.join(currentDir(import.meta.url), "../sessions/");

  try {
    await fs.appendFile(`${sessionsFolder}/${session}.yk`, "");
    socket.emit("createSession", {
      success: true,
      message: "Session created successfully.",
      session: session
    });
  } catch (error) {
    socket.emit("createSession", {
      success: false,
      message: error.message
    });
  }
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

export function handleValidateSession(socket, sessionId) {
  if (!uuidValidate(sessionId)) {
    return socket.emit("validateSession", {
      success: false,
      message: "Invalid session ID format.",
      isSessionValid: false
    });
  }

  if (!doesSessionFileExist(sessionId)) {
    return socket.emit("validateSession", {
      success: false,
      message: "Session does not exist.",
      isSessionValid: false
    });
  }

  return socket.emit("validateSession", {
    success: true,
    message: "Joining. Please wait.",
    isSessionValid: true
  });
}
