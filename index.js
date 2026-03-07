import express from "express"
import dotenv from "dotenv"
import rootRouter from "./routes/index.js";
import cors from "cors"
dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send("Application started")
}) 

app.use('/api', rootRouter)

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})