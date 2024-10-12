const asyncHandler = require("express-async-handler");
const Customer = require("../models/customerModel");
const generateToken = require("../utils/generateToken");
const argon2 = require("argon2");
const crypto = require("crypto");
const SESSIONS = new Map();

// register  customer profile
const registerCustomer = asyncHandler(async (req, res) => {
	const { firstName, lastName, telephone, address, gender, country, email, password, pic } = req.body;

	const customerExists = await Customer.findOne({ email });
	if (customerExists) {
		res.status(400);
		throw new Error("Customer Profile Exists !");
	}

	// Hash the password using Argon2
	const hashedPassword = await argon2.hash(password, {
		type: argon2.argon2id,
	});

	const customer = new Customer({
		firstName,
		lastName,
		telephone,
		address,
		gender,
		country,
		email,
		password: hashedPassword, // Store the hashed password
		pic,
	});

	await customer.save();

	if (customer) {
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
			token: generateToken(customer._id),
		});
	} else {
		res.status(400);
		throw new Error("Customer Registration Failed !");
	}
});

//authenticate customer profile
const authCustomer = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const customer = await Customer.findOne({ email });

	if (!customer) {
		res.status(400);
		throw new Error("Invalid Email or Password");
	}

	// Verify the password using Argon2
	const isPasswordMatch = await argon2.verify(customer.password, password);

	if (!isPasswordMatch) {
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
});

//get all of customers list
const getCustomers = asyncHandler(async (req, res) => {
	const customers = await Customer.find();
	res.json(customers);
});

// view customer profile by customer
const getCustomerProfile = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.customer._id);

	if (customer) {
		res.json(customer);
	} else {
		res.status(400);
		throw new Error("Customer not found !");
	}
});

// view customer profile by admin
const getCustomerProfileById = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.params._id);

	if (customer) {
		res.json(customer);
	} else {
		res.status(400);
		throw new Error("Customer not found !");
	}
});

//update customer profile by customer
const updateCustomerProfile = asyncHandler(async (req, res) => {
	const { _id, firstName, lastName, telephone, address, gender, country, email, password, pic } = req.body;
	const customer = await Customer.findById(_id);

	if (customer) {
		// Check if the user is a Google or Facebook user (password is 'google-oauth' or 'facebook-oauth')
		const isGoogleUser = customer.password === 'google-oauth';
		const isFacebookUser = customer.password === 'facebook-oauth';

		// Allow updates only to fields that are allowed to be updated
		customer.firstName = req.body.firstName || customer.firstName;
		customer.lastName = req.body.lastName || customer.lastName;
		customer.telephone = req.body.telephone || customer.telephone;
		customer.address = req.body.address || customer.address;
		customer.gender = req.body.gender || customer.gender;
		customer.country = req.body.country || customer.country;

		// Prevent updates to email and password if the user is a Google or Facebook user
		if (!isGoogleUser && !isFacebookUser) {
			customer.email = email || customer.email; // Allow email change only if not a Google or Facebook user

			// If a new password is provided, hash the new password
			if (password) {
				customer.password = await argon2.hash(password, { type: argon2.argon2id });
			}
		}

		customer.pic = req.body.pic || customer.pic;
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
		res.status(404);
		throw new Error("Customer Not Found !");
	}
});

//update customer profile by admin
const updateCustomerProfileById = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.params._id);

	if (customer) {
		customer.firstName = req.body.firstName || customer.firstName;
		customer.lastName = req.body.lastName || customer.lastName;
		customer.telephone = req.body.telephone || customer.telephone;
		customer.address = req.body.address || customer.address;
		customer.gender = req.body.gender || customer.gender;
		customer.country = req.body.country || customer.country;
		customer.email = req.body.email || customer.email;
		customer.pic = req.body.pic || customer.pic;
		// Prevent updates to email and password if the user is a Google or Facebook user
		if (!isGoogleUser && !isFacebookUser) {
			customer.email = email || customer.email; // Allow email change only if not a Google or Facebook user

			// If a new password is provided, hash the new password
			if (password) {
				customer.password = await argon2.hash(password, { type: argon2.argon2id });
			}
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
		res.status(404);
		throw new Error("Customer Not Found !");
	}
});

// delete customer profile by  customer
const deleteCustomerProfile = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.customer._id);

	if (customer) {
		await customer.deleteOne();
		res.json({ message: "Customer Removed !" });
	} else {
		res.status(404);
		throw new Error("Customer not Found !");
	}
});

// delete customer profile by admin
const deleteCustomerProfileById = asyncHandler(async (req, res) => {
	const customer = await Customer.findById(req.params._id);

	if (customer) {
		await customer.deleteOne();
		res.json({ message: "Customer Removed !" });
	} else {
		res.status(404);
		throw new Error("Customer not Found !");
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