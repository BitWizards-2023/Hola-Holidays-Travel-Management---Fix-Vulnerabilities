/**
 * Customer Model
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const customerSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "First name is required"],
			trim: true,
			minlength: [2, "First name must be at least 2 characters long"],
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			trim: true,
			minlength: [2, "Last name must be at least 2 characters long"],
		},
		isAdmin: {
			type: Boolean,
			default: false, // Default value set to false for customers
		},
		telephone: {
			type: String,
			required: [true, "Telephone is required"],
			validate: {
				validator: function (v) {
					return /^[0-9]{10,15}$/.test(v); // Validate telephone number (adjust regex as needed)
				},
				message: (props) => `${props.value} is not a valid telephone number!`,
			},
		},
		address: {
			type: String,
			required: [true, "Address is required"],
			trim: true,
			maxlength: [100, "Address cannot exceed 100 characters"],
		},
		gender: {
			type: String,
			required: [true, "Gender is required"],
			enum: ["Male", "Female", "Other"], // Restrict values to predefined options
		},
		country: {
			type: String,
			required: [true, "Country is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			validate: [isEmail, "Invalid email format"],
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [8, "Password must be at least 8 characters long"],
			select: false, // Prevent password from being returned by default
		},
		pic: {
			type: String,
			required: true,
			default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
		},
		regDate: {
			type: Date, // Use the Date type instead of String for dates
			default: Date.now, // Automatically set the registration date
		},
		facebookId: { type: String },
	},
	{
		timestamps: true,
	}
);

/**
 * Hash the password before saving
 */
customerSchema.pre("save", async function (next) {
	// Only hash the password if it's new or modified
	if (!this.isModified("password")) return next();

	// Hash the password with a salt factor of 10
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

/**
 * Method to compare passwords for authentication
 */
customerSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
