const { createClient } = require("redis");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Get the Redis URL from environment variables
const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
	url: redisUrl,
	socket: {
		connectTimeout: 500000,
	},
});

const connectRedis = async () => {
	try {
		await redisClient.connect();
		console.log("Redis client connected successfully");
		redisClient.set("try", "Hello, Welcome to Express ");
	} catch (error) {
		console.error("Error connecting to Redis:", error);
		setTimeout(connectRedis, 50000);
		redisClient.quit();
	}
};

connectRedis();

module.exports = redisClient;
