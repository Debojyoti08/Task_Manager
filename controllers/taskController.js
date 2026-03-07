import { prismaClient } from "../routes/index.js";


export const createtaskController = async(req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "All fields required"
            })
        }

        const tasks = await prismaClient.task.create({
            data: {
                title,
                description,
                userId: req.user.id
            }
        })

        return res.status(201).json({
            message: "Task added successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const updatetaskController = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "All fields required"
            })
        }

        const taskId = await prismaClient.task.findUnique({
            where: {id: Number(id)}
        })

        if (!taskId) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        const updateTask = await prismaClient.task.update({
            where: { id: Number(id) },
            data: {
                title,
                description
            }
        })

        return res.status(200).json({
            message: "Task updated",
            updateTask
        })
    } catch (error) {
        return res.status(500).json({
            message: "Some error occured in update"
        })
    }
}

export const deletetaskController = async(req, res) => {
    try {
        const { id } = req.params;

        const taskId = await prismaClient.task.findUnique({
            where: { id: Number(id) }
        })

        if (!taskId) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        const deletedTask = await prismaClient.task.delete({
            where: { id: Number(id) }
        })

        return res.status(200).json({
            message: "Task deleted",
            deletedTask
        })
    } catch (error) {
        return res.status(500).json({
            message: "Some error occured in delete"
        })
    }
}

export const getallTasks = async(req, res) => {
    try {
        const tasks = await prismaClient.task.findMany({
            where: {userId: req.user.id}
        })

        return res.status(200).json({
            message: "All tasks fetched",
            tasks
        })
    } catch (error) {
        return res.status(500).json({
            message: "Some error occured in delete"
        })
    }
}