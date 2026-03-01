import rateLimit from "express-rate-limit";

export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip;
  },
  message: {
    error: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});