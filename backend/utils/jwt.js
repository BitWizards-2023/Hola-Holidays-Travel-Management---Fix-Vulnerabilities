const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const signJwt = (payload, keyName, options) => {
	const secretKey = process.env[keyName];
	return jwt.sign(payload, secretKey, {
		...(options && options),
		algorithm: "HS256", // Use HMAC SHA256 algorithm
	});
};

const verifyJwt = (token, keyName) => {
	try {
		const secretKey = process.env[keyName];
		const decoded = jwt.verify(token, secretKey);
		return decoded;
	} catch (error) {
		return null;
	}
};

module.exports = { signJwt, verifyJwt };
