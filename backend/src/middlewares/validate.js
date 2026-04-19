import AppError from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = (result.error?.issues || []).map((err) => ({
      field: err.path?.[0] || "unknown",
      message: err.message,
    }));

    return next(new AppError(JSON.stringify(errors), 400));
  }

  req.body = result.data;
  next();
};