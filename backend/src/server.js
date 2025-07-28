import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

import cors from "cors";
import http from "http";
import { initializeSocket } from "./socket/socket.js";

import connectToDB from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import commentsRoutes from "./routes/comments.routes.js"
import projectsRoutes from "./routes/projects.routes.js"
import conversationRoutes from "./routes/conversation.routes.js"
import messageRoutes from "./routes/message.routes.js"


const app = express();
const server = http.createServer(app);

server.keepAliveTimeout = 15000;
server.headersTimeout = 16000;

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  preflightContinue: false, // ✅ handles OPTIONS internally
  optionsSuccessStatus: 200 // ✅ avoids 204 default
}));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});



app.use((req, res, next) => {
  res.setTimeout(20000, () => {
    console.warn("❗ Request timed out:", req.originalUrl);
    res.status(504).json({ message: "Timeout: Request took too long" });
  });
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments",commentsRoutes)
app.use("/api/projects", projectsRoutes);
app.use("/api/conversations",conversationRoutes)
app.use("/api/messages", messageRoutes);





initializeSocket(server);

server.listen(PORT, () => {
    connectToDB();
    console.log(`Server started on port ${PORT}`);
});



