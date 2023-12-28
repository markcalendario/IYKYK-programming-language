import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { io } from "../index.js";
import Lexer from "../lexer/lexer.js";
import {
  createSessionFile,
  deleteSessionFile,
  doesSessionFileExist,
  getName,
  getSessionCode,
  writeCode
} from "./sockets.utils.js";

export async function handleCreateSession(socket) {
  const session = uuidv4();

  try {
    createSessionFile(session);
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

export async function handleValidateSession(socket, sessionId) {
  if (!uuidValidate(sessionId)) {
    return socket.emit("validateSession", {
      success: false,
      message: "Invalid session ID format.",
      isSessionValid: false
    });
  }

  if (!(await doesSessionFileExist(sessionId))) {
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

export async function handleGetCode(socket, sessionId) {
  try {
    socket.emit("getCode", {
      success: true,
      message: "Code fetched successfully.",
      code: await getSessionCode(sessionId)
    });
  } catch (error) {
    socket.emit("getCode", { success: false, message: error.message });
  }
}

export async function handleWriteCode(socket, sessionId, code) {
  try {
    await writeCode(sessionId, code);

    socket.to(sessionId).emit("getCode", {
      success: true,
      message: "Code written successfully.",
      code: await getSessionCode(sessionId)
    });
  } catch (error) {
    socket.emit("getCode", {
      success: false,
      message: error.message
    });
  }
}

export async function handleDeleteSession(socket, sessionId) {
  try {
    await deleteSessionFile(sessionId);
    io.in(sessionId).emit("deleteSession", {
      success: true,
      message: "This session has been deleted."
    });
  } catch (error) {
    socket.emit("deleteSession", { success: false, message: error.message });
  }
}

export async function handleLex(socket, sessionId) {
  try {
    const content = await getSessionCode(sessionId);
    const lexer = new Lexer(content);
    const result = lexer.generateToken();
    socket.emit("lex", {
      success: true,
      message: "Token has been generated successfully.",
      tokens: result
    });
  } catch (error) {
    socket.emit("lex", {
      success: false,
      message: error.message
    });
  }
}
