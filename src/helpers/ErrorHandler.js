const ResponseHelper = require('./ResponseHelper');

class HttpError extends Error {
  constructor(message, code = 500) {
    super();
    this.message = message;
    this.statusCode = code;
  }

  static throwErrorIfNullOrEmpty(data, message, code = 404) {
    if (!data || data.length < 1) {
      // throw new HttpError(message, code);
      const error = {
        message,
        code
      }
      throw error;
    }
  }

  static sendErrorResponse(error, res) {
    // if (error instanceof HttpError) {
    //   const { statusCode, message } = error;
    //   return ResponseHelper.sendResponse(res, statusCode, false, message);
    // }

    const code = error.statusCode || 500;
    const { message } = error;
    return res.status(code).json({
      success: false,
      message,
    });
    // return next(error);
  }
}

module.exports = HttpError;
