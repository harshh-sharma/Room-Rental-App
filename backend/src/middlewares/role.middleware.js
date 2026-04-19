import AppError from "../utils/AppError.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("Access denied", 403);
    }
    next();
  };
};