// Simple plans list
import Plan from "../models/plan.js";

export const getPlans =  async (req, res) => {
  try {
    //get all the plans from the database mongoose
    const plans = await Plan.find();

    res.status(200).json({ plans });
  } catch (error) {
    res.status(500).json({ message: "Failed to get plans", error: error.message });
  }
}

export const addPlan = async (req, res) => {
  try {
    const { title, subtitle, description, price, features } = req.body;
    // Here you can handle adding a new plan, e.g., save it to a database mongoose
    const plan = new Plan({ title, subtitle, description, price, features });
    await plan.save();

    res.status(201).json({ message: "Plan added successfully", plan: { title, subtitle, description, price, features } });

  } catch (error) {
    res.status(500).json({ message: "Failed to add plan", error: error.message });
  }
}
