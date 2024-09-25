/**
 * Admin Model
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const adminSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
			minlength: [3, "Name must be at least 3 characters long"],
		},
		isAdmin: {
			type: Boolean,
			default: true, // By default, this value is true for admin users
		},
		telephone: {
			type: String,
			required: [true, "Telephone is required"],
			validate: {
				validator: function (v) {
					return /^[0-9]{10,15}$/.test(v); // Ensures only valid phone numbers (adjust regex as needed)
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
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true, // Ensures no duplicate emails
			validate: [isEmail, "Invalid email format"],
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [8, "Password must be at least 8 characters long"],
			select: false, // Prevents the password from being returned in queries
		},
		pic: {
			type: String,
			required: true,
			default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
		},
	},
	{
		timestamps: true,
	}
);

/**
 * Hash the password before saving
 */
adminSchema.pre("save", async function (next) {
	// Only hash the password if it's new or modified
	if (!this.isModified("password")) return next();

	// Hash the password with a salt factor of 10
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

/**
 * Method to compare passwords for authentication
 */
adminSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
