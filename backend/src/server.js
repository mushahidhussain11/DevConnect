import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectToDB from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import postsRoutes from "./routes/posts.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", postsRoutes);



app.listen(PORT, () => {
    connectToDB();
    console.log(`Server started on port ${PORT}`);
});



