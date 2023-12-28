import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import codes from "./api/codes/codes.js";
import handleSocket from "./sockets/sockets.js";

const app = express();

// ENV Configuration
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

// Socket IO
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT,
    allowedHeaders: ["Access-Control-Allow-Origin"]
  }
});

io.on("connection", handleSocket);

// APIs

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": process.env.CLIENT,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials": true
  });
  next();
});

app.use("/codes", codes);

httpServer.listen(process.env.PORT, () => {
  console.log("IYKYK is running on port", process.env.PORT);
});
