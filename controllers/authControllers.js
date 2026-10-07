import db from "../database/db.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const JWT_SECRET = "my-development-secret";

export async function registerUser(req, res) {
    const {username, email, password} = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({message: "Error: Make sure you enter your username, email and password"});
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10); 
        const user = db.prepare(`
            INSERT INTO users(username, email, password)
            VALUES(?, ?, ?)
            `).run(username, email, hashedPassword);
        
        return res.json({
            message: "user registered successfully",
            id: user.lastInsertRowid
        });
    } catch(e) {
        return res.status(409).json({
            message: "Username or email already exists."
        })
    }
}
export async function loginUser(req, res) {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({message: "Error: Make sure you enter your username and password"});
    }
    
    try {
        const user = db.prepare(`
            SELECT * FROM users WHERE username = ?
        `).get(username);
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "You logged in successfully.",
            token
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong. Please try again later."
        });
    }
}