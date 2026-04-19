import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("token not found", 400);
    }

    const decodedToken =  jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET",
    );

    req.user = decodedToken;
    next();
  } catch (error) {
    next(error)
  }
};
