import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.config.js";
import { blogRouter } from "./routers/blog.router.js";
import { authRouter } from "./routers/auth.router.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use("/blog", blogRouter);
app.use("/auth", authRouter);


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
