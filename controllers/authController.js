import { prismaClient } from "../routes/index.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export const RegisterController = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields required"
            })
        }

        const userExists = await prismaClient.user.findFirst({
            where: { email: email }
        })

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashPassword = hashSync(password, 10)

        const user = await prismaClient.user.create({
            data: { name, email, password: hashPassword }
        })

        return res.status(201).json({
            message: "User added successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            message: "Some error occured"
        })
    }
}

export const LoginController = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields required"
            })
        }

        const user = await prismaClient.user.findFirst({
            where: { email: email }
        })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isPasswordValid = compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid Password"
            })
            
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'})

        return res.status(200).json({
            message: "Login Successful",
            token,
            user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Some error occuered"
        })
    }
}