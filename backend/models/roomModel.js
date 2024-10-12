const mongoose = require("mongoose");

// Utility function to sanitize input by removing unwanted characters ($ and .)
const sanitizeInput = (input) => {
	if (typeof input === "string") {
		return input.replace(/[$.]/g, "").trim(); // Remove $ and . from strings and trim whitespace
	}
	return input;
};

const roomSchema = new mongoose.Schema(
	{
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Admin",
		},
		hotel: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Hotel",
		},
		roomType: {
			type: String,
			required: [true, "Room type is required"],
			trim: true, // Trim whitespace
			minlength: [3, "Room type must be at least 3 characters long"],
			maxlength: [100, "Room type cannot exceed 100 characters"],
		},
		availability: {
			type: Number,
			required: [true, "Availability is required"],
			min: [0, "Availability cannot be negative"],
		},
		beds: {
			type: String,
			required: [true, "Number of beds is required"],
			trim: true, // Trim whitespace
			minlength: [1, "Beds description must be at least 1 character long"],
			maxlength: [50, "Beds description cannot exceed 50 characters"],
		},
		roomSize: {
			type: String,
			required: [true, "Room size is required"],
			trim: true, // Trim whitespace
			minlength: [1, "Room size must be at least 1 character long"],
			maxlength: [50, "Room size cannot exceed 50 characters"],
		},
		roomFacilities: {
			type: String,
			required: [true, "Room facilities are required"],
			trim: true, // Trim whitespace
			minlength: [3, "Room facilities must be at least 3 characters long"],
			maxlength: [200, "Room facilities cannot exceed 200 characters"],
		},
		bathRoomFacilities: {
			type: String,
			required: [true, "Bathroom facilities are required"],
			trim: true, // Trim whitespace
			minlength: [3, "Bathroom facilities must be at least 3 characters long"],
			maxlength: [200, "Bathroom facilities cannot exceed 200 characters"],
		},
		price: {
			type: Number,
			required: [true, "Price is required"],
			min: [0, "Price cannot be negative"],
		},
		pic: {
			type: String,
			required: true,
			validate: {
				validator: function (v) {
					// Basic URL validation
					return /^(http|https):\/\/[^ "]+$/.test(v);
				},
				message: (props) => `${props.value} is not a valid URL!`,
			},
		},
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

// Define the Room model
const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
