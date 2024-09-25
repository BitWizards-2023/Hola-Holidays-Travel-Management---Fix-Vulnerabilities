const asyncHandler = require("express-async-handler");
const Customer = require("../models/customerModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const SESSIONS = new Map();

// Utility function to sanitize input and prevent NoSQL injection
const sanitizeInput = (input) => {
	return input.replace(/[$.]/g, ""); // Removes `$` and `.` to prevent injection attempts
};

// Register customer profile
const registerCustomer = asyncHandler(async (req, res) => {
	let { firstName, lastName, telephone, address, gender, country, email, password, pic } = req.body;

	// Sanitize inputs to prevent NoSQL injection
	firstName = sanitizeInput(firstName);
	lastName = sanitizeInput(lastName);
	telephone = sanitizeInput(telephone);
	address = sanitizeInput(address);
	gender = sanitizeInput(gender);
	country = sanitizeInput(country);
	email = sanitizeInput(email);

	const customerExists = await Customer.findOne({ email });
	if (customerExists) {
		return res.status(400).json({ message: "Customer Profile Exists!" });
	}

	// Hash password before saving
	const hashedPassword = await bcrypt.hash(password, 10);

	const customer = new Customer({
		firstName,
		lastName,
		telephone,
		address,
		gender,
		country,
		email,
		password: hashedPassword, // Save the hashed password
		pic,
	});

	const addedCustomer = await customer.save();

	if (addedCustomer) {
		res.status(201).json({
			_id: addedCustomer._id,
			firstName: addedCustomer.firstName,
			lastName: addedCustomer.lastName,
			telephone: addedCustomer.telephone,
			address: addedCustomer.address,
			gender: addedCustomer.gender,
			country: addedCustomer.country,
			email: addedCustomer.email,
			pic: addedCustomer.pic,
			regDate: addedCustomer.regDate,
		});
	} else {
		res.status(400).json({ message: "Customer Registration Failed!" });
	}
});

// Authenticate customer profile
const authCustomer = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Sanitize email input
	const sanitizedEmail = sanitizeInput(email);

	const customer = await Customer.findOne({ email: sanitizedEmail }).select("+password");

	if (!customer) {
		return res.status(400).json({ message: "Invalid Email or Password" });
	}

	if (!(password === customer.password)) {
		res.status(400);
		throw new Error("Invalid Email or Password");
	} else {
		const sessionId = crypto.randomUUID();
		SESSIONS.set(sessionId, customer._id);
		//Set the cookie
		res.cookie("sessionId", sessionId, {
			httpOnly: false,
			withCredentials: true,
		});
		res.status(201).json({
			_id: customer._id,
			firstName: customer.firstName,
			lastName: customer.lastName,
			telephone: customer.telephone,
			address: customer.address,
			gender: customer.gender,
			country: customer.country,
			email: customer.email,
			pic: customer.pic,
			regDate: customer.regDate,
			token: generateToken(customer._id),
		});
	}

	// Successful authentication
	res.status(200).json({
		_id: customer._id,
		firstName: customer.firstName,
		lastName: customer.lastName,
		telephone: customer.telephone,
		address: customer.address,
		gender: customer.gender,
		country: customer.country,
		email: customer.email,
		pic: customer.pic,
		regDate: customer.regDate,
	});
});

// Get all customers
const getCustomers = asyncHandler(async (req, res) => {
	const customers = await Customer.find().select("-password"); // Exclude passwords from results
	res.json(customers);
});

// View customer profile by customer
const getCustomerProfile = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.customer._id).select("-password");

	if (customer) {
		res.json(customer);
	} else {
		res.status(404).json({ message: "Customer not found!" });
	}
});

// View customer profile by admin
const getCustomerProfileById = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.params._id).select("-password");

	if (customer) {
		res.json(customer);
	} else {
		res.status(404).json({ message: "Customer not found!" });
	}
});

// Update customer profile by customer
const updateCustomerProfile = asyncHandler(async (req, res) => {
	const { _id, firstName, lastName, telephone, address, gender, country, email, password, pic } = req.body;
	const customer = await Customer.findById(_id);

	if (customer) {
		// Sanitize the inputs
		customer.firstName = sanitizeInput(req.body.firstName) || customer.firstName;
		customer.lastName = sanitizeInput(req.body.lastName) || customer.lastName;
		customer.telephone = sanitizeInput(req.body.telephone) || customer.telephone;
		customer.address = sanitizeInput(req.body.address) || customer.address;
		customer.gender = sanitizeInput(req.body.gender) || customer.gender;
		customer.country = sanitizeInput(req.body.country) || customer.country;
		customer.email = sanitizeInput(req.body.email) || customer.email;
		customer.pic = sanitizeInput(req.body.pic) || customer.pic;

		// Update password if provided and hash it
		if (req.body.password) {
			customer.password = await bcrypt.hash(req.body.password, 10);
		}

		const updatedCustomer = await customer.save();

		res.json({
			_id: updatedCustomer._id,
			firstName: updatedCustomer.firstName,
			lastName: updatedCustomer.lastName,
			telephone: updatedCustomer.telephone,
			address: updatedCustomer.address,
			gender: updatedCustomer.gender,
			country: updatedCustomer.country,
			email: updatedCustomer.email,
			pic: updatedCustomer.pic,
			regDate: updatedCustomer.regDate,
			token: generateToken(updatedCustomer._id),
		});
	} else {
		res.status(404).json({ message: "Customer Not Found!" });
	}
});

// Update customer profile by admin
const updateCustomerProfileById = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.params._id);

	if (customer) {
		// Sanitize the inputs
		customer.firstName = sanitizeInput(req.body.firstName) || customer.firstName;
		customer.lastName = sanitizeInput(req.body.lastName) || customer.lastName;
		customer.telephone = sanitizeInput(req.body.telephone) || customer.telephone;
		customer.address = sanitizeInput(req.body.address) || customer.address;
		customer.gender = sanitizeInput(req.body.gender) || customer.gender;
		customer.country = sanitizeInput(req.body.country) || customer.country;
		customer.email = sanitizeInput(req.body.email) || customer.email;
		customer.pic = sanitizeInput(req.body.pic) || customer.pic;

		// Update password if provided and hash it
		if (req.body.password) {
			customer.password = await bcrypt.hash(req.body.password, 10);
		}

		const updatedCustomer = await customer.save();

		res.json({
			_id: updatedCustomer._id,
			firstName: updatedCustomer.firstName,
			lastName: updatedCustomer.lastName,
			telephone: updatedCustomer.telephone,
			address: updatedCustomer.address,
			gender: updatedCustomer.gender,
			country: updatedCustomer.country,
			email: updatedCustomer.email,
			pic: updatedCustomer.pic,
			regDate: updatedCustomer.regDate,
			token: generateToken(updatedCustomer._id),
		});
	} else {
		res.status(404).json({ message: "Customer Not Found!" });
	}
});

// Delete customer profile by customer
const deleteCustomerProfile = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.customer._id);

	if (customer) {
		await customer.deleteOne();
		res.json({ message: "Customer Removed!" });
	} else {
		res.status(404).json({ message: "Customer not Found!" });
	}
});

// Delete customer profile by admin
const deleteCustomerProfileById = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.params._id);

	if (customer) {
		await customer.deleteOne();
		res.json({ message: "Customer Removed!" });
	} else {
		res.status(404).json({ message: "Customer not Found!" });
	}
});

module.exports = {
	registerCustomer,
	authCustomer,
	getCustomers,
	getCustomerProfile,
	getCustomerProfileById,
	updateCustomerProfile,
	updateCustomerProfileById,
	deleteCustomerProfile,
	deleteCustomerProfileById,
};
