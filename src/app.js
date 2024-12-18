import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

/*
    Allowed CORS to make frontend access backend system
*/
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(express.static("public"))
app.use(cookieParser())

import authRoutes from "./routes/auth.route.js";
import roleRoutes from "./routes/role.route.js";

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/role", roleRoutes)

app.use(errorMiddleware);

export default app;
