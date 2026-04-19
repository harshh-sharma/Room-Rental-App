import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
   logger.error({
    message: err.message,
    stack: err.stack,
  });

  let message = err.message || "Internal Server Error";

  // if message is JSON string (from validation)
  try {
    const parsed = JSON.parse(message);
    return res.status(err.code || 500).json({
      success: false,
      errors: parsed,
    });
  } catch {
    return res.status(err.code || 500).json({
      success: false,
      message,
    });
  }
};

export default errorMiddleware;