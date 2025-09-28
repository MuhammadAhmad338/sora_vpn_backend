// Simple plans list
export const getPlans = (req, res) => {
  const plans = [
    {
      id: "plan_monthly_001",
      name: "monthly", 
      price: 9.99,
      description: "Monthly plan"
    },
    {
      id: "plan_yearly_001",
      name: "yearly",
      price: 99.99,
      description: "Yearly plan"
    }
  ];

  res.status(200).json({ plans });
};
