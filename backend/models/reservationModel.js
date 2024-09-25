const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
	{
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Customer",
		},
		customerName: {
			type: String,
			required: [true, "Customer name is required"],
			trim: true, // Trim whitespace
			minlength: [3, "Customer name must be at least 3 characters long"],
			maxlength: [100, "Customer name cannot exceed 100 characters"],
		},
		customerEmail: {
			type: String,
			required: [true, "Customer email is required"],
			trim: true, // Trim whitespace
			lowercase: true, // Convert to lowercase
			validate: {
				validator: function (v) {
					// Basic email validation
					return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
				},
				message: (props) => `${props.value} is not a valid email!`,
			},
		},
		hotel: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Hotel",
		},
		hotelName: {
			type: String,
			required: [true, "Hotel name is required"],
			trim: true, // Trim whitespace
			minlength: [3, "Hotel name must be at least 3 characters long"],
			maxlength: [100, "Hotel name cannot exceed 100 characters"],
		},
		room: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Room",
		},
		roomName: {
			type: String,
			required: [true, "Room name is required"],
			trim: true, // Trim whitespace
			minlength: [1, "Room name must be at least 1 character long"],
			maxlength: [100, "Room name cannot exceed 100 characters"],
		},
		checkInDate: {
			type: Date, // Using Date type for accurate date handling
			required: [true, "Check-in date is required"],
		},
		checkOutDate: {
			type: Date, // Using Date type for accurate date handling
			required: [true, "Check-out date is required"],
		},
		noOfDates: {
			type: Number,
			required: [true, "Number of dates is required"],
			min: [1, "Number of dates must be at least 1"],
		},
		noOfRooms: {
			type: Number,
			required: [true, "Number of rooms is required"],
			min: [1, "Number of rooms must be at least 1"],
		},
		price: {
			type: Number,
			required: [true, "Price is required"],
			min: [0, "Price must be a positive number"],
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt timestamps
	}
);

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
