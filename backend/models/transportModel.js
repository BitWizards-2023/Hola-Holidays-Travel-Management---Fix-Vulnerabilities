const mongoose = require("mongoose");
const moment = require("moment");

const busSchema = new mongoose.Schema(
	{
		licensePlate: {
			type: String,
			required: [true, "License plate is required"],
			trim: true, // Trim whitespace
			minlength: [3, "License plate must be at least 3 characters long"],
			maxlength: [15, "License plate cannot exceed 15 characters"],
		},
		startingStation: {
			type: String,
			required: [true, "Starting station is required"],
			trim: true,
			minlength: [3, "Starting station must be at least 3 characters long"],
			maxlength: [100, "Starting station cannot exceed 100 characters"],
		},
		destinationStation: {
			type: String,
			required: [true, "Destination station is required"],
			trim: true,
			minlength: [3, "Destination station must be at least 3 characters long"],
			maxlength: [100, "Destination station cannot exceed 100 characters"],
		},
		totalTravelTime: {
			type: String,
			required: [true, "Total travel time is required"],
			validate: {
				validator: function (v) {
					return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Ensures HH:mm format
				},
				message: (props) => `${props.value} is not a valid time string in the format HH:mm!`,
			},
		},
		totalNumberOfSeats: {
			type: Number,
			required: [true, "Total number of seats is required"],
			min: [1, "There must be at least 1 seat"],
		},
		ticketPrice: {
			type: Number,
			required: [true, "Ticket price is required"],
			min: [0, "Ticket price must be a positive number"],
		},
		facilities: {
			type: [String],
			default: [],
			validate: {
				validator: function (v) {
					return v.every((facility) => typeof facility === "string" && facility.trim().length > 0);
				},
				message: "Facilities must be an array of non-empty strings",
			},
		},
		cityStops: {
			type: [String],
			required: [true, "City stops are required"],
			validate: {
				validator: function (v) {
					return v.length > 0 && v.every((stop) => typeof stop === "string" && stop.trim().length > 0);
				},
				message: "City stops must be a non-empty array of non-empty strings",
			},
		},
		mobileNo: {
			type: String,
			required: [true, "Mobile number is required"],
			trim: true,
			validate: {
				validator: function (v) {
					return /^[0-9]{7,15}$/.test(v); // Ensures the mobile number is 7 to 15 digits
				},
				message: (props) => `${props.value} is not a valid mobile number!`,
			},
		},
		leavingTime: {
			type: String,
			required: [true, "Leaving time is required"],
			validate: {
				validator: function (v) {
					return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Ensures HH:mm format
				},
				message: (props) => `${props.value} is not a valid leaving time in the format HH:mm!`,
			},
		},
	},
	{ timestamps: true }
);

busSchema.pre("validate", function (next) {
	const { totalTravelTime } = this;
	if (typeof totalTravelTime === "number") {
		this.totalTravelTime = moment.duration(totalTravelTime, "minutes").format("HH:mm");
	}
	next();
});

module.exports = new mongoose.model("Bus", busSchema);
