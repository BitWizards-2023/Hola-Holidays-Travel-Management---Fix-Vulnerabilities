const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
	{
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Admin",
		},
		hotelName: {
			type: String,
			required: [true, "Hotel name is required"],
			trim: true,
			minlength: [3, "Hotel name must be at least 3 characters long"],
			maxlength: [100, "Hotel name cannot exceed 100 characters"],
		},
		address: {
			type: String,
			required: [true, "Address is required"],
			trim: true,
			maxlength: [200, "Address cannot exceed 200 characters"],
		},
		location: {
			type: String,
			required: [true, "Location is required"],
			trim: true,
			maxlength: [100, "Location cannot exceed 100 characters"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			trim: true,
			maxlength: [1000, "Description cannot exceed 1000 characters"],
		},
		facilities: {
			type: [String], // Use an array of strings for better structure
			required: [true, "Facilities are required"],
			validate: {
				validator: function (v) {
					return v.length > 0;
				},
				message: "There must be at least one facility listed",
			},
		},
		rules: {
			type: [String], // Use an array of strings for better structure
			required: [true, "Rules are required"],
			validate: {
				validator: function (v) {
					return v.length > 0;
				},
				message: "There must be at least one rule listed",
			},
		},
		pic: {
			type: String,
			required: true,
			validate: {
				validator: function (v) {
					// Basic validation for URL format
					return /^(http|https):\/\/[^ "]+$/.test(v);
				},
				message: (props) => `${props.value} is not a valid URL!`,
			},
		},
	},
	{
		timestamps: true, // Adds createdAt and updatedAt timestamps
	}
);

// Sanitize input to prevent NoSQL injection
hotelSchema.pre("save", function (next) {
	this.hotelName = this.hotelName.replace(/[$.]/g, "");
	this.address = this.address.replace(/[$.]/g, "");
	this.location = this.location.replace(/[$.]/g, "");
	this.description = this.description.replace(/[$.]/g, "");
	this.facilities = this.facilities.map((facility) => facility.replace(/[$.]/g, ""));
	this.rules = this.rules.map((rule) => rule.replace(/[$.]/g, ""));
	next();
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
