const User = require("../models/User");

const MONTHLY_LIMIT = 100;

const quota = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const now = new Date();
    const resetDate = new Date(user.usageResetDate);

    // Add one month to resetDate
    const nextResetDate = new Date(resetDate);
    nextResetDate.setMonth(nextResetDate.getMonth() + 1);

    // If current date is past next reset date
    if (now > nextResetDate) {
      user.usageCount = 0;
      user.usageResetDate = now;
      await user.save();
    }

    if (user.usageCount >= MONTHLY_LIMIT) {
      return res.status(403).json({
        message: "Monthly quota exceeded"
      });
    }

    next();

  } catch (error) {
    res.status(500).json({ message: "Quota check failed" });
  }
};

module.exports = quota;