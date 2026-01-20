import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err);

  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ApiError(404, message);
  }

  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ApiError(400, message);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, message);
  }

  if (err.name === "JsonWebTokenError") {
    const message = "Invalid Json Web Token";
    error = new ApiError(401, message);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token is expired";
    error = new ApiError(401, message);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      data: err.data,
      message: err.message,
      success: err.success,
      stack: err.stack,
    });
  }

  res.status(error.statusCode || 500).json({
    statusCode: error.statusCode || 500,
    data: null,
    message: error.message || "Internal Server Error",
    success: false,
    errors: [],
  });
};

export { errorHandler };
