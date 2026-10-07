import db from "../database/db.js";

export function createTask(req, res) {
    const {title, description} = req.body;

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            message: "A task title is required."
        });
    }

    const userId = Number(req.user.userId);
    
    const stmt = db.prepare(`
        INSERT INTO tasks(title, description, user_id)
        VALUES(?, ?, ?)
        `)
    stmt.run(title.trim(), description || "", userId);
    
    return res.json({
        message: "Task added successfully"
    });

}

export function getTasks(req, res) {
    const id = req.user.userId;

    const tasks = db.prepare(`
        SELECT * FROM tasks
        WHERE user_id = ?
        `).all(id);
    return res.status(200).json({
        tasks
    })
}

export function deleteTask(req, res) {
    const taskId = req.params.id;
    const userId = req.user.userId;

    const stmt = db.prepare(`
        DELETE FROM tasks
        WHERE id = ? AND user_id = ?
    `);
    const result = stmt.run(taskId, userId);

    if (result.changes === 0) {
        return res.status(404).json({
            message: "Task not found or you do not have permission to delete it."
        });
    }
    
    return res.json({
        message: "Task deleted successfully"
    });
}

export function updateTask(req, res) {
    const taskId = req.params.id;
    const userId = req.user.userId;
    const { title, description } = req.body;

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            message: "A task title is required."
        });
    }

    const stmt = db.prepare(`
        UPDATE tasks
        SET title = ?, description = ?
        WHERE id = ? AND user_id = ?
    `);
    const result = stmt.run(title.trim(), description || "", taskId, userId);

    if (result.changes === 0) {
        return res.status(404).json({
            message: "Task not found or you do not have permission to update it."
        });
    }

    return res.json({
        message: "Task updated successfully"
    });
}