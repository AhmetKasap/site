import express from "express";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "../controllers/blog.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
export const blogRouter = express.Router();


blogRouter.get("/", getBlogs);
blogRouter.post("/", authMiddleware, createBlog);
blogRouter.get("/:id", getBlogById);
blogRouter.put("/:id", authMiddleware, updateBlog);
blogRouter.delete("/:id", authMiddleware, deleteBlog);