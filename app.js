import express from "express";
import db from "./database/db.js";
import registrationRouter from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";
import dotenv from "dotenv/config";

const app = express();
app.use(express.json());
app.use(express.static("public"));


// Health-check endpoint used to confirm that the API is running
app.get("/api/health", (req, res) => {
    res.json({
        message: "Task Manager API is running"
    });
})
app.use("/api/auth", registrationRouter);
app.use("/api/tasks", tasksRouter);


app.listen(5000, () => {
    console.log("server running port: http://localhost:5000");
})