const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const response = {
      statusCode: err.statusCode,
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
    };
  
    res.status(statusCode).json(response);
  };
  
  export { errorMiddleware };
  