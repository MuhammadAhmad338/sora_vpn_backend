import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const fixSubscription = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const userId = "6921715655ff66f6effb9fe8"; // Ahmad
    const validPlanId = "69216b4bf51bb5fbd2f782f5"; // Month Plan

    const user = await User.findById(userId);
    if (user) {
      console.log(`Current plan ID: ${user.subscribedPlan}`);
      user.subscribedPlan = validPlanId;
      await user.save();
      console.log(`Updated user ${user.username} to valid plan ID: ${validPlanId}`);
    } else {
      console.log("User not found");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
};

fixSubscription();
