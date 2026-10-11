import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export function authenticationToken(req, res, next) {
    const authHeaders = req.headers.authorization;

    if(!authHeaders) {
        return res.status(401).json({
            message: "Access token required"
        });
    }
    
    const token = authHeaders.split(" ")[1];
    

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({message: "Invalid or expired access token"});
    }
}