import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const user = jwt.verify(token, process.env.JWT_SECRET);

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};