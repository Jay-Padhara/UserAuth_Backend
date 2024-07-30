const multer = require("multer");
const statusCode = require("./StatusCode");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(statusCode.BAD_REQUEST).json({
      error: true,
      statusCode: statusCode.BAD_REQUEST,
      message: `Multer error: ${err.message}`,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(statusCode.BAD_REQUEST).json({
      error: true,
      statusCode: statusCode.BAD_REQUEST,
      message: `Validation error: ${err.message}`,
    });
  }

  if (err.name === "MongoError") {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      error: true,
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: `Database error: ${err.message}`,
    });
  }

  if (err.statusCode && err.message) {
    return res.status(err.statusCode).json({
      error: true,
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
    error: true,
    statusCode: statusCode.INTERNAL_SERVER_ERROR,
    message: `Internal Server Error: ${
      err.message || "An unexpected error occurred"
    }`,
  });
};

module.exports = errorHandler;
