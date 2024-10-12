// Import necessary modules
const logger = require("../utils/logger"); // Assume logger is a utility for logging

// Middleware function
const requireUser = (req, res, next) => {
	try {
		const user = res.locals.user;

		// Check if the user exists in res.locals
		if (!user) {
			// Log the unauthorized access attempt
			logger.warn(`Unauthorized access attempt to a protected route: ${req.path}`);

			// Create a new error with a 401 status code and pass it to the next middleware
			const error = new Error("Access denied. Authentication required.");
			res.status(401);
			return next(error);
		}

		// Proceed with the next middleware if the user exists
		next();
	} catch (err) {
		// Log any errors that occur during the execution of the middleware
		logger.error(`Error in requireUser middleware: ${err.message}`);

		// Pass the error to the next middleware (which is the global error handler)
		next(err);
	}
};

module.exports = requireUser;
