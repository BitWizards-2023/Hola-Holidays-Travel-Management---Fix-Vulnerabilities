const asyncHandler = require("express-async-handler");
const TourGuide = require("../models/TourGuideModel");

// Utility function to sanitize input by removing unwanted characters ($ and .)
const sanitizeInput = (input) => {
	if (typeof input === "string") {
		return input.replace(/[$.]/g, "").trim(); // Removes `$` and `.` characters and trims whitespace
	}
	if (Array.isArray(input)) {
		return input.map((item) => sanitizeInput(item)); // Recursively sanitize each item if input is an array
	}
	return input;
};

// Add a new tour guide
const addGuide = asyncHandler(async (req, res) => {
	let { name, gender, language, location, description, fee, phoneNumber } = req.body;

	// Sanitize all inputs
	name = sanitizeInput(name);
	gender = sanitizeInput(gender);
	language = sanitizeInput(language);
	location = sanitizeInput(location);
	description = sanitizeInput(description);
	fee = sanitizeInput(fee);
	phoneNumber = sanitizeInput(phoneNumber);

	if (!name || !gender || !language || !location || !description || !fee || !phoneNumber) {
		res.status(400);
		throw new Error("Please fill all the fields");
	} else {
		const tourGuide = new TourGuide({
			name,
			gender,
			language,
			location,
			description,
			fee,
			phoneNumber,
		});

		const addedGuide = await tourGuide.save();

		res.status(201).json(addedGuide);
		console.log(req.body);
	}
});

// Get all tour guides
const getGuides = asyncHandler(async (req, res) => {
	const tourGuides = await TourGuide.find();
	res.json(tourGuides);
});

// Get a tour guide by ID
const getGuidesById = asyncHandler(async (req, res) => {
	const sanitizedGuideId = sanitizeInput(req.params.id);
	const tourGuide = await TourGuide.findById(sanitizedGuideId);

	if (tourGuide) {
		res.json(tourGuide);
	} else {
		res.status(404).json({ message: "Tour guide not found" });
	}
});

// Update a tour guide
const updateGuide = asyncHandler(async (req, res) => {
	let { name, gender, language, location, description, fee, phoneNumber } = req.body;

	// Sanitize all inputs
	name = sanitizeInput(name);
	gender = sanitizeInput(gender);
	language = sanitizeInput(language);
	location = sanitizeInput(location);
	description = sanitizeInput(description);
	fee = sanitizeInput(fee);
	phoneNumber = sanitizeInput(phoneNumber);

	const sanitizedGuideId = sanitizeInput(req.params.id);
	const guide = await TourGuide.findById(sanitizedGuideId);

	if (guide) {
		guide.name = name;
		guide.gender = gender;
		guide.language = language;
		guide.location = location;
		guide.description = description;
		guide.fee = fee;
		guide.phoneNumber = phoneNumber;

		const updatedGuide = await guide.save();
		res.json(updatedGuide);
	} else {
		res.status(404);
		throw new Error("Guide not found");
	}
});

// Delete a tour guide
const deleteGuide = asyncHandler(async (req, res) => {
	const sanitizedGuideId = sanitizeInput(req.params.id);
	const guide = await TourGuide.findById(sanitizedGuideId);

	if (guide) {
		await guide.deleteOne();
		res.json({ message: "Tour Guide Removed" });
	} else {
		res.status(404);
		throw new Error("Tour guide not Found");
	}
});

module.exports = {
	addGuide,
	getGuides,
	getGuidesById,
	updateGuide,
	deleteGuide,
};
