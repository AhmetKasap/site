import adminModel from "../database/admin.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from 'crypto';
dotenv.config();


const sha256 = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    const admin = await adminModel.findOne({ email });
    console.log(admin);
    if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
    }
    const isPasswordCorrect = await sha256(password) === admin.password;
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
}

