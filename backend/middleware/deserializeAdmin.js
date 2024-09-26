// Import necessary modules
const { omit } = require("lodash");
const { excludedFields, findUniqueUser } = require("../api/auth/user.service");
const AppError = require("../utils/appError");
const redisClient = require("../utils/connectRedis");
const { verifyJwt } = require("../utils/jwt");
const logger = require("../utils/logger"); // Assuming a logger utility

// Middleware function
const deserializeAdmin = async (req, res, next) => {
	try {
		let access_token;

		if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
			access_token = req.headers.authorization.split(" ")[1];
		} else if (req.cookies.access_token) {
			access_token = req.cookies.access_token;
		}

		if (!access_token) {
			return next(new AppError(401, "You are not logged in"));
		}

		// Validate the access token
		const decoded = verifyJwt(access_token, "accessTokenPublicKey");
		if (!decoded) {
			return next(new AppError(401, "Invalid token or user doesn't exist"));
		}

		// Check if the user has a valid session
		const session = await redisClient.get(decoded.sub);
		if (!session) {
			return next(new AppError(401, "Invalid token or session has expired"));
		}

		// Check if the user still exists
		const user = await findUniqueUser(
			{ id: JSON.parse(session).id },
			{
				fname: true,
				lname: true,
				uuid: true,
				status: true,
				verified: true,
				role: true,
				employee: {
					include: {
						designation: true,
						company: {
							include: {
								country: true,
							},
						},
					},
				},
				workspace: true,
			}
		);
		if (!user) {
			return next(new AppError(401, "Invalid token or session has expired"));
		}

		if (user.verified === false) {
			return next(new AppError(401, "You are not verified"));
		}

		if (user.status === false) {
			return next(new AppError(401, "Your account is deactivated"));
		}

		// if (user.role.name !== "admin") {
		//   return next(new AppError(403, "Access denied. Admins only."));
		// }

		// Constructing user attributes
		const userAttr = {
			fname: user.fname,
			lname: user.lname,
			role: user.role,
		};

		res.locals.user = userAttr;
		next();
	} catch (err) {
		logger.error(`Error in deserializeAdmin middleware: ${err.message}`);
		next(err);
	}
};

module.exports = deserializeAdmin;
