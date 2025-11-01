import Support from "../models/support.js";

export const postSupport = async (req, res) => {
    try {
        console.log("✅ Support request received");
        // console.log("Request body:", req.body);
        
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false,
                message: "All fields (name, email, message) are required" 
            });
        }
        
        const supportFeedback = new Support({ name, email, message });
        await supportFeedback.save();

        console.log("Support saved:", { name, email, message });
        res.status(200).json({ 
            success: true,
            message: "Support submitted successfully",
            data: supportFeedback
        });
    } catch (error) {
        console.error("❌ Error in postSupport:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to save support", 
            error: error.message 
        });
    }
}