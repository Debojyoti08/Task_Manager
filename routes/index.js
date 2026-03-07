import express from "express"
import authRouter from "./authRoutes.js";
import { PrismaClient } from "@prisma/client";
import taskRouter from "./taskRoutes.js";

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter)
rootRouter.use('/task', taskRouter)

export const prismaClient = new PrismaClient({
    log: ["query"]
})

export default rootRouter;