import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from 'crypto';
import adminModel from "../database/admin.model.js";

dotenv.config();

const sha256 = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt:", email);

        const admin = await adminModel.findOne({ email });
        if (!admin) {
            console.log("Admin not found");
            return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
        }

        const hashedPassword = sha256(password);
        const isPasswordCorrect = hashedPassword === admin.password;
        
        if (!isPasswordCorrect) {
            console.log("Invalid password");
            return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        console.log("Login successful");
        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};