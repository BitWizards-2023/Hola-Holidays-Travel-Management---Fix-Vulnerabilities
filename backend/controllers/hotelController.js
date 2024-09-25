const Hotel = require("../models/hotelModel");
//const asyncHandler = require("express-async-handler");

// Utility function to sanitize input by removing unwanted characters ($ and .)
const sanitizeInput = (input) => {
	if (typeof input === "string") {
		return input.replace(/[$.]/g, "").trim(); // Removes `$` and `.` characters and trims the input
	}
	if (Array.isArray(input)) {
		return input.map((item) => sanitizeInput(item)); // Recursively sanitize each item if input is an array
	}
	return input;
};

// Get hotels for a specific admin
const gethotels = asyncHandler(async (req, res) => {
	const sanitizedAdminId = sanitizeInput(req.params.id); // Sanitize input
	const items = await Hotel.find({ admin: sanitizedAdminId });
	res.json(items);
});

// Get all hotels for customers
const gethotelsByCustomer = asyncHandler(async (req, res) => {
	const items = await Hotel.find();
	res.json(items);
});

// Add a new hotel
const addHotel = asyncHandler(async (req, res) => {
	let { admin, hotelName, address, location, description, facilities, rules, pic } = req.body;

	// Sanitize all inputs
	admin = sanitizeInput(admin);
	hotelName = sanitizeInput(hotelName);
	address = sanitizeInput(address);
	location = sanitizeInput(location);
	description = sanitizeInput(description);
	facilities = sanitizeInput(facilities);
	rules = sanitizeInput(rules);
	pic = sanitizeInput(pic);

	if (!admin || !hotelName || !address || !location || !description || !facilities || !rules || !pic) {
		res.status(400);
		throw new Error("Failed to add hotel - missing fields");
	} else {
		const hotel = new Hotel({
			admin,
			hotelName,
			address,
			location,
			description,
			facilities,
			rules,
			pic,
		});

		const createdHotel = await hotel.save();

		res.status(201).json(createdHotel);
	}
});

// Update hotel details
const updateHotel = asyncHandler(async (req, res) => {
	let { hotelName, address, location, description, facilities, rules, pic } = req.body;

	// Sanitize all inputs
	hotelName = sanitizeInput(hotelName);
	address = sanitizeInput(address);
	location = sanitizeInput(location);
	description = sanitizeInput(description);
	facilities = sanitizeInput(facilities);
	rules = sanitizeInput(rules);
	pic = sanitizeInput(pic);

	const sanitizedHotelId = sanitizeInput(req.params.id);
	const hotel = await Hotel.findById(sanitizedHotelId);

	if (hotel) {
		hotel.hotelName = hotelName;
		hotel.address = address;
		hotel.location = location;
		hotel.description = description;
		hotel.facilities = facilities;
		hotel.rules = rules;
		hotel.pic = pic;

		const updatedHotel = await hotel.save();
		res.json(updatedHotel);
	} else {
		res.status(404);
		throw new Error("Hotel not found");
	}
});

// Get a hotel by ID
const getHotelById = asyncHandler(async (req, res) => {
	const sanitizedHotelId = sanitizeInput(req.params.id); // Sanitize input
	const hotel = await Hotel.findById(sanitizedHotelId);

	if (hotel) {
		res.json(hotel);
	} else {
		res.status(404).json({ message: "Hotel not found" });
	}
});

// Delete a hotel
const deleteHotel = asyncHandler(async (req, res) => {
	const sanitizedHotelId = sanitizeInput(req.params._id); // Sanitize input
	const hotel = await Hotel.findById(sanitizedHotelId);

	if (hotel) {
		await hotel.deleteOne();
		res.json({ message: "Item Removed" });
	} else {
		res.status(404);
		throw new Error("Item not Found");
	}
});

module.exports = {
	gethotels,
	addHotel,
	updateHotel,
	getHotelById,
	deleteHotel,
	gethotelsByCustomer,
};
