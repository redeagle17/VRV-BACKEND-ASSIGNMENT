import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express()

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(express.static("public"))

import authRoutes from "./routes/auth.route.js";
import roleRoutes from "./routes/role.route.js";

app.use("/api/v1", authRoutes)
app.use("/api/v1", roleRoutes)

app.use(errorMiddleware);

export default app;
