const mongoose = require("mongoose");

const TourGuideSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true, // Trim whitespace
			minlength: [3, "Name must be at least 3 characters long"],
			maxlength: [100, "Name cannot exceed 100 characters"],
		},
		gender: {
			type: String,
			required: [true, "Gender is required"],
			enum: ["Male", "Female", "Other"], // Restrict values to predefined options
		},
		language: {
			type: String,
			required: [true, "Language is required"],
			trim: true,
			minlength: [2, "Language must be at least 2 characters long"],
			maxlength: [50, "Language cannot exceed 50 characters"],
		},
		location: {
			type: String,
			required: [true, "Location is required"],
			trim: true,
			minlength: [3, "Location must be at least 3 characters long"],
			maxlength: [100, "Location cannot exceed 100 characters"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			trim: true,
			maxlength: [1000, "Description cannot exceed 1000 characters"],
		},
		fee: {
			type: String,
			required: [true, "Fee is required"],
			trim: true,
			validate: {
				validator: function (v) {
					return /^[0-9]+(\.[0-9]{1,2})?$/.test(v); // Validates that the fee is a valid number with up to two decimal places
				},
				message: (props) => `${props.value} is not a valid fee! Fee should be a valid number.`,
			},
		},
		phoneNumber: {
			type: Number,
			required: [true, "Phone number is required"],
			validate: {
				validator: function (v) {
					return /^[0-9]{7,15}$/.test(v); // Validates that the phone number is between 7 to 15 digits
				},
				message: (props) => `${props.value} is not a valid phone number!`,
			},
		},
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const TourGuide = mongoose.model("TourGuide", TourGuideSchema);

module.exports = TourGuide;
