// Import necessary modules
const { omit } = require("lodash");
const Customer = require("../models/customerModel");
const redisClient = require("../utils/connectRedis");
const { verifyJwt } = require("../utils/jwt");

// Middleware function
const deserializeUser = async (req, res, next) => {
	try {
		let access_token;

		// Get access token from Authorization header or cookies
		if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
			access_token = req.headers.authorization.split(" ")[1];
		} else if (req.cookies.access_token) {
			access_token = req.cookies.access_token;
		}

		// If no access token is provided
		if (!access_token) {
			const error = new Error("You are not logged in");
			res.status(401);
			return next(error);
		}

		// Validate the access token using the shared secret
		const decoded = verifyJwt(access_token, "JWT_SECRET"); // Use shared secret key
		if (!decoded) {
			const error = new Error("Invalid token or user doesn't exist");
			res.status(401);
			return next(error);
		}

		// Check if the session exists in Redis
		const session = await redisClient.get(decoded.sub);
		if (!session) {
			const error = new Error("Invalid token or session has expired");
			res.status(401);
			return next(error);
		}

		// Find the user (customer) in MongoDB using the session ID
		const customer = await Customer.findById(JSON.parse(session).id).select("-password");
		if (!customer) {
			const error = new Error("Invalid token or session has expired");
			res.status(401);
			return next(error);
		}

		// Add the user (customer) to res.locals, omitting excluded fields
		res.locals.user = omit(customer.toObject(), excludedFields);

		// Move on to the next middleware
		next();
	} catch (err) {
		// Pass any errors to the global error handler
		next(err);
	}
};

module.exports = deserializeUser;
