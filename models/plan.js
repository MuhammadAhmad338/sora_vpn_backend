import mongoose  from "mongoose";

const planSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,

        },
        features: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);
export default Plan;