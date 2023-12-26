import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// ENV Configuration
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL }
});

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(process.env.PORT, () => {
  console.log("IYKYK is running on port", process.env.PORT);
});
