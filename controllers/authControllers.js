import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/user.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Nodemailer transporter setup for Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // or 465 for SSL
  secure: false, // true for 465, false for other ports (like 587)
  auth: {
    user: process.env.SMTP_USER, // Your full Gmail address (e.g., "youremail@gmail.com")
    pass: process.env.SMTP_PASS, // Your Google App Password
  },
});

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: "Email or Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Forgot Password (Send Email)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `https://datascape.site/resetpassword/${resetToken}`;

    await transporter.sendMail({
      from: `"VPN Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello <b>${user.username}</b>,</p>
        <p>You requested to reset your password.</p>
        <p>Click below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.json({ message: "Password reset email sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sending reset email", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {

    const { token, newPassword } = req.body;
    //print it
    console.log("Reset token:", token);
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {

    res.status(500).json({ message: "Password reset failed", error: err.message });
  }
};
