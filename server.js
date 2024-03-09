import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import connectDB from "./db/index.js";
import authenticateUser from "./middleware/auth.js";
import User from "./models/user.js";
import { upload } from "./middleware/multer.js";
import products from "./utils/products.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 3000;
connectDB();
dotenv.config({
    path: "./env"
});

// Authentication

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(409).json({ error: "User is not Registered!" });
        }
        const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ error: "Incorrect Password" });
        }
        const token = existingUser.generateAccessToken();
        return res.json({ token });
    }
    catch (err) {
        console.log("Error:", err);
    }
});

app.post("/api/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ error: "User Already Exists" });
        }
        const newUser = new User({ email, password });
        await newUser.save();
        const token = newUser.generateAccessToken();
        return res.json({ token });
    }
    catch (err) {
        console.log("Error:", err);
    }
});

app.get("/api/profile", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        return res.json({ user });
    }
    catch (err) {
        console.log("Error:", err);
    }
});

app.get("/api/products", async (req, res) => {
    try {
        return res.json({ products });
    }
    catch (err) {
        console.log("Error:", err);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});