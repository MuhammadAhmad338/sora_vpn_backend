export const getUser = (req, res) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        // Fetch user details from the database using userId
        const user
            = await
        User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};