const Admin = require("../models/adminModel"); // Assuming this is the Mongoose model for admin users
const redisClient = require("../utils/connetctRedis");
const { verifyJwt } = require("../utils/jwt");
const logger = require("../utils/logger"); // Assuming a logger utility

// Middleware function
const deserializeAdmin = async (req, res, next) => {
	try {
		let access_token;

		// Extract access token from headers or cookies
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

		// Validate the access token using the shared secret from the .env file
		const decoded = verifyJwt(access_token, "JWT_SECRET"); // Using shared secret key for JWT verification
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

		// Check if the user still exists in the database using Mongoose
		const admin = await Admin.findById(JSON.parse(session).id).select("-password");
		if (!admin) {
			const error = new Error("Invalid token or session has expired");
			res.status(401);
			return next(error);
		}

		// Additional checks for verified and active status
		if (!admin.verified) {
			const error = new Error("You are not verified");
			res.status(401);
			return next(error);
		}

		if (!admin.status) {
			const error = new Error("Your account is deactivated");
			res.status(401);
			return next(error);
		}

		// Constructing user attributes to attach to the response
		const userAttr = {
			fname: admin.fname,
			lname: admin.lname,
			role: admin.role,
		};

		res.locals.user = userAttr;
		next();
	} catch (err) {
		logger.error(`Error in deserializeAdmin middleware: ${err.message}`);
		next(err); // Pass the error to the global error handler
	}
};

module.exports = deserializeAdmin;
