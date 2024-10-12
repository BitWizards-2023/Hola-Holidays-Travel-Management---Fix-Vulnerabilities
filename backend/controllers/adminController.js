const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const argon2 = require("argon2"); // Import Argon2 for password hashing
const crypto = require("crypto");
const SESSIONS = new Map();

// Utility function to sanitize input and prevent NoSQL injection
const sanitizeInput = (input) => {
	return input.replace(/[$.]/g, ""); // Removes `$` and `.` to prevent injection attempts
};

// Register user as an admin
const registerAdmin = asyncHandler(async (req, res) => {
	let { name, telephone, address, email, password, pic } = req.body;

	// Sanitize inputs to prevent NoSQL injection
	name = sanitizeInput(name);
	telephone = sanitizeInput(telephone);
	address = sanitizeInput(address);
	email = sanitizeInput(email);

	// Check if admin already exists
	const adminExists = await Admin.findOne({ email: sanitizeInput(email) });
	if (adminExists) {
		return res.status(400).json({ message: "Admin Profile Exists!" });
	}

	// Hash the password before saving
	const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

	// Create new admin instance
	const admin = new Admin({
		name,
		telephone,
		address,
		email,
		password: hashedPassword, // Save the hashed password
		pic,
	});

	const addedAdmin = await admin.save();

	if (addedAdmin) {
		res.status(201).json({
			_id: addedAdmin._id,
			name: addedAdmin.name,
			telephone: addedAdmin.telephone,
			address: addedAdmin.address,
			email: addedAdmin.email,
			pic: addedAdmin.pic,
		});
	} else {
		res.status(400).json({ message: "Admin Registration Failed!" });
	}
});

// Authenticate the admin
const authAdmin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Sanitize email input
	const sanitizedEmail = sanitizeInput(email);

	// Find admin by email
	const admin = await Admin.findOne({ email: sanitizedEmail }).select("+password");

	if (!admin) {
		return res.status(400).json({ message: "Invalid Email or Password" });
	}

	// Verify the provided password with the stored hash
	const isPasswordMatch = await argon2.verify(admin.password, password);

	if (!isPasswordMatch) {
		res.status(400);
		throw new Error("Invalid Email or Password");
	} else {
		const sessionId = crypto.randomUUID();
		SESSIONS.set(sessionId, admin._id);
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 2);

		// Set the cookie
		res.cookie("sessionId", sessionId, {
			httpOnly: false,
			withCredentials: true,
			expires: expirationDate,
		});
		res.status(201).json({
			_id: admin._id,
			name: admin.name,
			telephone: admin.telephone,
			address: admin.address,
			email: admin.email,
			pic: admin.pic,
			token: generateToken(admin._id),
		});
	}
});

// View admin profile
const getAdminProfile = asyncHandler(async (req, res) => {
	const admin = await Admin.findById(req.admin._id).select("-password");

	if (admin) {
		res.status(200).json(admin);
	} else {
		res.status(404).json({ message: "Admin Not Found!" });
	}
});

// Update admin profile
const updateAdminProfile = asyncHandler(async (req, res) => {
	const admin = await Admin.findById(req.admin._id);

	if (admin) {
		admin.name = req.body.name || admin.name;
		admin.telephone = req.body.telephone || admin.telephone;
		admin.address = req.body.address || admin.address;
		admin.email = req.body.email || admin.email;
		admin.pic = req.body.pic || admin.pic;

		// If the password is being updated, hash it
		if (req.body.password) {
			const hashedPassword = await argon2.hash(req.body.password, { type: argon2.argon2id });
			admin.password = hashedPassword;
		}

		const updatedAdmin = await admin.save();

		res.status(200).json({
			_id: updatedAdmin._id,
			name: updatedAdmin.name,
			isAdmin: updatedAdmin.isAdmin,
			telephone: updatedAdmin.telephone,
			address: updatedAdmin.address,
			email: updatedAdmin.email,
			pic: updatedAdmin.pic,
			token: generateToken(updatedAdmin._id),
		});
	} else {
		res.status(404).json({ message: "Admin Not Found!" });
	}
});

module.exports = {
	registerAdmin,
	authAdmin,
	getAdminProfile,
	updateAdminProfile,
};
