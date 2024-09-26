// Import necessary modules
const AppError = require("../utils/appError");
const logger = require("../utils/logger"); // Assume logger is a utility for logging

// Middleware function
const requireUser = (req, res, next) => {
	try {
		const user = res.locals.user;

		// Check if user exists in the request
		if (!user) {
			// Log the incident for monitoring purposes
			logger.warn(`Unauthorized access attempt to a protected route: ${req.path}`);

			// Return a generic error message
			return next(new AppError(401, "Access denied. Authentication required."));
		}

		// Proceed with the next middleware if the user exists
		next();
	} catch (err) {
		// Log the error for debugging purposes
		logger.error(`Error in requireUser middleware: ${err.message}`);

		// Pass the error to the next middleware
		next(err);
	}
};

module.exports = requireUser;
