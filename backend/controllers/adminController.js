const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const generateToken = require("../utils/generateToken");
const argon2 = require("argon2");  // Import Argon2 for password hashing
const crypto = require("crypto");
const ADMIN_SESSIONS = new Map();

// Register user as an admin
const registerAdmin = asyncHandler(async (req, res) => {
	const { name, telephone, address, email, password, pic } = req.body;

	const adminExists = await Admin.findOne({ email });
	if (adminExists) {
		res.status(400);
		throw new Error("Admin Profile Exists !");
	}
	const user = ADMIN_SESSIONS.get(req.cookies.sessionId); // Using ADMIN_SESSIONS to validate session IDs before allowing admin action
	if (user == null) {
		res.sendStatus(401);  //This ensures that only authenticated sessions can access or perform admin actions, protecting sensitive operations
		return;
	}


	// Hash the password with Argon2
	const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

	const admin = new Admin({
		name,
		telephone,
		address,
		email,
		password: hashedPassword,  // Save the hashed password
		pic,
	});

	await admin.save();

	if (admin) {
		res.status(201).json({
			_id: admin._id,
			name: admin.name,
			isAdmin: admin.isAdmin,
			telephone: admin.telephone,
			address: admin.address,
			email: admin.email,
			pic: admin.pic,
			token: generateToken(admin._id),
		});
	} else {
		res.status(400);
		throw new Error("Admin Registration Failed !");
	}
});

// Authenticate the admin
const authAdmin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const admin = await Admin.findOne({ email });

	if (!admin) {
		res.status(400);
		throw new Error("Invalid Email or Password");
	}

	// Verify the provided password with the stored hash
	const isPasswordMatch = await argon2.verify(admin.password, password);

	if (!isPasswordMatch) {
		res.status(400);
		throw new Error("Invalid Email or Password");
	} else {
		const sessionId = crypto.randomUUID();
		ADMIN_SESSIONS.set(sessionId, admin._id);
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
	const admin = await Admin.findById(req.admin._id);

	if (admin) {
		res.status(201).json(admin);
	} else {
		res.status(400);
		throw new Error("Admin Not Found !");
	}
});

// Update admin profile
const updateAdminProfile = asyncHandler(async (req, res) => {
	const admin = await Admin.findById(req.admin._id);

	const user = ADMIN_SESSIONS.get(req.cookies.sessionId);
	if (user == null) {
		res.sendStatus(401);
		return;
	}


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

		res.json({
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
		res.status(404);
		throw new Error("Admin Not Found !");
	}
});

module.exports = { ADMIN_SESSIONS, registerAdmin, authAdmin, getAdminProfile, updateAdminProfile };
