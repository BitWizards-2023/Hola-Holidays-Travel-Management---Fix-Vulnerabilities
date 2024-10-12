class AppError extends Error {
	constructor(statusCode, message, isOperational = true, stack = "") {
		super(message);

		this.statusCode = statusCode;
		this.isOperational = isOperational; // Identify operational errors (e.g., user mistakes)
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

module.exports = AppError;
