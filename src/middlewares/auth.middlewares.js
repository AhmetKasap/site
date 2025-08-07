import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    try {
        // Token'ı header'dan veya query'den al
        const token = req.headers.authorization?.split(" ")[1] || req.query.token;
        
        if (!token) {
            return res.status(401).json({ message: "Auth failed - No token" });
        }

        try {
            const decodedData = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedData.id;
            next();
        } catch (error) {
            console.log("Token verification error:", error);
            return res.status(401).json({ message: "Auth failed - Invalid token" });
        }
    } catch (error) {
        console.log("Auth middleware error:", error);
        res.status(401).json({ message: "Auth failed - Server error" });
    }
};