import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Username already taken" });
    }

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
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Generate reset token
      const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
  
      // Reset link (frontend route where user will reset password)
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
      // Send email
      await transporter.sendMail({
        from: `"VPN Support" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Password Reset Request",
        html: `
          <p>Hello <b>${user.username}</b>,</p>
          <p>You requested to reset your password.</p>
          <p>Click here to reset: <a href="${resetLink}">${resetLink}</a></p>
          <p>This link will expire in 15 minutes.</p>
        `,
      });
  
      res.json({ message: "Password reset email sent" });
    } catch (err) {
      res.status(500).json({ message: "Error sending reset email", error: err.message });
    }
  };