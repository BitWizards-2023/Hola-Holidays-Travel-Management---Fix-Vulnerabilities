const asyncHandler = require("express-async-handler");
const busSchema = require("../models/transportModel");

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

// Add new bus entry
const addNewTransport = asyncHandler(async (req, res) => {
	// Get bus details and sanitize them
	let {
		licensePlate,
		startingStation,
		destinationStation,
		totalTravelTime,
		totalNumberOfSeats,
		ticketPrice,
		facilities,
		cityStops,
		mobileNo,
		leavingTime,
	} = req.body;

	// Sanitize all input fields
	licensePlate = sanitizeInput(licensePlate);
	startingStation = sanitizeInput(startingStation);
	destinationStation = sanitizeInput(destinationStation);
	totalTravelTime = sanitizeInput(totalTravelTime);
	totalNumberOfSeats = sanitizeInput(totalNumberOfSeats);
	ticketPrice = sanitizeInput(ticketPrice);
	facilities = sanitizeInput(facilities);
	cityStops = sanitizeInput(cityStops);
	mobileNo = sanitizeInput(mobileNo);
	leavingTime = sanitizeInput(leavingTime);

	// Create new bus entry
	const newTransport = new busSchema({
		licensePlate,
		startingStation,
		destinationStation,
		totalTravelTime,
		totalNumberOfSeats,
		ticketPrice,
		facilities,
		cityStops,
		mobileNo,
		leavingTime,
	});

	// Save new bus entry
	await newTransport.save();

	if (newTransport) {
		res.status(201).json(newTransport);
	} else {
		res.status(400);
		throw new Error("Failed to add a new bus entry!");
	}
});

// Get all bus entries
const getTransport = asyncHandler(async (req, res) => {
	const bus = await busSchema.find();
	res.json(bus);
});

// Get a bus entry by ID
const getOneTransport = asyncHandler(async (req, res) => {
	// Get and sanitize bus ID
	const bus_id = sanitizeInput(req.params.id);

	const bus = await busSchema.findById(bus_id);

	if (bus) {
		res.json(bus);
	} else {
		res.status(400);
		throw new Error("Bus entry not found!");
	}
});

// Delete a bus entry
const deleteTransport = asyncHandler(async (req, res) => {
	// Get and sanitize bus ID
	const bus_id = sanitizeInput(req.params.id);

	const bus = await busSchema.findById(bus_id);

	if (bus) {
		await bus.deleteOne();
		res.json({ message: "Bus entry is deleted!" });
	} else {
		res.status(404);
		throw new Error("Bus entry not found!");
	}
});

// Update a bus entry
const updateTransport = asyncHandler(async (req, res) => {
	// Get and sanitize bus ID
	const bus_id = sanitizeInput(req.params.id);

	const bus = await busSchema.findById(bus_id);

	if (bus) {
		// Sanitize and update input fields
		bus.licensePlate = sanitizeInput(req.body.licensePlate) || bus.licensePlate;
		bus.startingStation = sanitizeInput(req.body.startingStation) || bus.startingStation;
		bus.destinationStation = sanitizeInput(req.body.destinationStation) || bus.destinationStation;
		bus.totalTravelTime = sanitizeInput(req.body.totalTravelTime) || bus.totalTravelTime;
		bus.totalNumberOfSeats = sanitizeInput(req.body.totalNumberOfSeats) || bus.totalNumberOfSeats;
		bus.ticketPrice = sanitizeInput(req.body.ticketPrice) || bus.ticketPrice;
		bus.facilities = sanitizeInput(req.body.facilities) || bus.facilities;
		bus.cityStops = sanitizeInput(req.body.cityStops) || bus.cityStops;
		bus.mobileNo = sanitizeInput(req.body.mobileNo) || bus.mobileNo;
		bus.leavingTime = sanitizeInput(req.body.leavingTime) || bus.leavingTime;

		const updatedBus = await bus.save();

		res.json(updatedBus);
	} else {
		res.status(404);
		throw new Error("Bus entry not found!");
	}
});

module.exports = {
	addNewTransport,
	getTransport,
	getOneTransport,
	deleteTransport,
	updateTransport,
};
