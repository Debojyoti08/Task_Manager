import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createtaskController, deletetaskController, getallTasks, updatetaskController } from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.post('/create', authMiddleware, createtaskController)
taskRouter.put('/update/:id', authMiddleware, updatetaskController)
taskRouter.delete('/delete/:id', authMiddleware, deletetaskController)
taskRouter.get('/getall', authMiddleware, getallTasks)

export default taskRouter;