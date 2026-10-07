import express from "express";
import { createTask, getTasks, deleteTask, updateTask } from "../controllers/taskController.js";
import { authenticationToken } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", authenticationToken, createTask);
router.get("/", authenticationToken, getTasks);
router.delete("/:id", authenticationToken, deleteTask);
router.put("/:id", authenticationToken, updateTask);

export default router;