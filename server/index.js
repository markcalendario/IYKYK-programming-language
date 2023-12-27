import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import handleSocket from "./sockets/sockets.js";

// ENV Configuration
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const httpServer = createServer();
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT,
    allowedHeaders: ["Access-Control-Allow-Origin"]
  }
});

io.on("connection", handleSocket);

httpServer.listen(process.env.PORT, () => {
  console.log("IYKYK is running on port", process.env.PORT);
});
