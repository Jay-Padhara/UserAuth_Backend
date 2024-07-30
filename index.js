require("dotenv").config();
const express = require("express");
const http = require("http");
const port = process.env.PORT || 3000;
const connectDB = require("./Src/Config/connectDB");
const authRouter = require("./Src/Router/UserRouter");
const path = require("path");
const { Server } = require("socket.io");
const errorHandler = require("./Src/Helper/ErrorHandler");
const os = require("os");
const cluster = require("cluster");
const totalCpus = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Prmiary process ${process.pid} is running.`);

  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();

    cluster.on("exit", (worker, code, signal) => {
      if (signal) {
        console.log(`worker ${worker} was killed by signal: ${signal}`);
      } else if (code !== 0) {
        console.log(`worker ${worker} exited with error code: ${code}`);
      } else {
        console.log(`worker ${worker} success!`);
      }
    });

    cluster.on("online", (worker) => {
      console.log(`Worker ${worker.process.pid} is online.`);
    });
  }
} else {
  console.log(`Worker ${process.pid} started`);

  const app = express();
  const server = http.createServer();
  const io = new Server(server);

  connectDB();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  io.on("connection", (socket) => {
    console.log("New user connected:: ", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:: ", socket.id);
    });

    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/api/auth", authRouter);

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}🏡🏡🏡`);
  });
}

// {
//   "version": 2,
//   "framework": null,
//   "buildCommand": "",
//   "installCommand": null,
//   "outputDirectory": "public",
//   "builds": [{ "src": "./index.js", "use": "@vercel/node" }],
//   "routes": [{ "source": "/(.*)", "destination": "/" }]
// }
