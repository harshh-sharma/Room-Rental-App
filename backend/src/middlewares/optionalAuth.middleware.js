import jwt from "jsonwebtoken";

export const optionalProtect = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "SECRET"
      );

      req.user = decoded; // attach user if token valid
    }

    next(); // always continue
  } catch (error) {
    next(); // ignore error, don't block
  }
};