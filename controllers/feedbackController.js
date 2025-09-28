import Feedback from "../models/feedback.js";

export const feedbackController = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        // Here you can handle the feedback, e.g., save it to a database or send an email
        // please add the data in the mongodb database with mongoose
        const newFeedback = new Feedback({ name, email, message });
        await newFeedback.save();

        console.log("Feedback received:", { name, email, message });
        res.status(200).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit feedback", error: error.message });
    }
}