const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");

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

	// Create new admin instance
	const admin = new Admin({
		name,
		telephone,
		address,
		email,
		password,
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

	// Compare the provided password with the hashed password
	const isMatch = await bcrypt.compare(password, admin.password);
	if (!isMatch) {
		return res.status(400).json({ message: "Invalid Email or Password" });
	}

	// Successful authentication, return admin details
	res.status(200).json({
		_id: admin._id,
		name: admin.name,
		telephone: admin.telephone,
		address: admin.address,
		email: admin.email,
		pic: admin.pic,
		isAdmin: admin.isAdmin,
	});
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
		// Sanitize the inputs to avoid potential injection attacks
		admin.name = sanitizeInput(req.body.name) || admin.name;
		admin.telephone = sanitizeInput(req.body.telephone) || admin.telephone;
		admin.address = sanitizeInput(req.body.address) || admin.address;
		admin.email = sanitizeInput(req.body.email) || admin.email;
		admin.pic = sanitizeInput(req.body.pic) || admin.pic;

		// Update password if provided
		if (req.body.password) {
			admin.password = await bcrypt.hash(req.body.password, 10);
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
		});
	} else {
		res.status(404).json({ message: "Admin Not Found!" });
	}
});

module.exports = { registerAdmin, authAdmin, getAdminProfile, updateAdminProfile };
