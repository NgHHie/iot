import { Server as SocketIOServer } from "socket.io";
let io; // Khai báo biến io

export const initSocketIO = async (server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);
    socket.on("sendDataClient", function (data) {
      io.emit("sendDataServer", { data });
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export const getSocketIO = () => io;
