import User from "../models/User.js";  // assuming User.js is ESM

const MONTHLY_LIMIT = 100;

const quota = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const now = new Date();
    const resetDate = new Date(user.usageResetDate);

    const nextResetDate = new Date(resetDate);
    nextResetDate.setMonth(nextResetDate.getMonth() + 1);

    if (now > nextResetDate) {
      user.usageCount = 0;
      user.usageResetDate = now;
      await user.save();
    }

    if (user.usageCount >= MONTHLY_LIMIT) {
      return res.status(403).json({ message: "Monthly quota exceeded" });
    }

    next();

  } catch (error) {
    res.status(500).json({ message: "Quota check failed" });
  }
};

export default quota;