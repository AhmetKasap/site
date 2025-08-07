import express from "express";
import { login } from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/login-avukat-halil-koroglu", login);