import express from "express";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

import authRoutes from "./routes/auth.route.js";

app.use("/api", authRoutes);

export default app;
