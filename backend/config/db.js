const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(
			"mongodb+srv://senulananayakkara88:axOsqiIF7HH4wJkR@cluster0.c3j9t.mongodb.net/",
			{
				useUnifiedTopology: true,
				useNewUrlParser: true,
			}
		);

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit();
	}
};

module.exports = connectDB;
