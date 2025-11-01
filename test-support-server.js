import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import Support from "./models/support.js";

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.post("/api/support/create", async (req, res) => {
  try {
    console.log("Request received:", req.body);
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const supportFeedback = new Support({ name, email, message });
    await supportFeedback.save();

    console.log("✅ Support saved:", { name, email, message });
    res.status(200).json({
      success: true,
      message: "Support Feedback submitted successfully",
      data: supportFeedback
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save support feedback",
      error: error.message,
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`✅ Test server running on port ${PORT}`));
