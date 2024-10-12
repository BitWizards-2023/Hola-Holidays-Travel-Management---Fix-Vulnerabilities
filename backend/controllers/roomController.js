const Room = require("../models/roomModel");
const asyncHandler = require("express-async-handler");
const Customer = require("../models/customerModel");

// Utility function to sanitize input by removing unwanted characters ($ and .)
const sanitizeInput = (input) => {
	if (typeof input === "string") {
		return input.replace(/[$.]/g, "").trim(); // Remove $ and . from strings and trim whitespace
	}
	if (Array.isArray(input)) {
		return input.map((item) => sanitizeInput(item)); // Recursively sanitize each item if input is an array
	}
	return input;
};

const getRooms = asyncHandler(async (req, res) => {
	const sanitizedHotelId = sanitizeInput(req.params.id);
	const rooms = await Room.find({ hotel: sanitizedHotelId });
	res.json(rooms);
});

const createRoom = asyncHandler(async (req, res) => {
	let { admin, hotel, roomType, availability, beds, roomSize, roomFacilities, bathRoomFacilities, price, pic } =
		req.body;

	// Sanitize all inputs
	admin = sanitizeInput(admin);
	hotel = sanitizeInput(hotel);
	roomType = sanitizeInput(roomType);
	availability = sanitizeInput(availability);
	beds = sanitizeInput(beds);
	roomSize = sanitizeInput(roomSize);
	roomFacilities = sanitizeInput(roomFacilities);
	bathRoomFacilities = sanitizeInput(bathRoomFacilities);
	price = sanitizeInput(price);
	pic = sanitizeInput(pic);

	if (
		!admin ||
		!hotel ||
		!roomType ||
		!availability ||
		!beds ||
		!roomSize ||
		!roomFacilities ||
		!bathRoomFacilities ||
		!price ||
		!pic
	) {
		res.status(400);
		throw new Error("Please Fill all the fields");
	} else {
		const room = new Room({
			admin,
			hotel,
			roomType,
			availability,
			beds,
			roomSize,
			roomFacilities,
			bathRoomFacilities,
			price,
			pic,
		});

		const createdRoom = await room.save();
		res.status(201).json(createdRoom);
	}
});

const getRoomById = asyncHandler(async (req, res) => {
	const sanitizedRoomId = sanitizeInput(req.params.id);
	const room = await Room.findById(sanitizedRoomId);

	if (room) {
		res.json(room);
	} else {
		res.status(404).json({ message: "Room not found" });
	}
});

const updateRoom = asyncHandler(async (req, res) => {
	let { roomType, availability, beds, roomSize, roomFacilities, bathRoomFacilities, price, pic } = req.body;

	// Sanitize all inputs
	roomType = sanitizeInput(roomType);
	availability = sanitizeInput(availability);
	beds = sanitizeInput(beds);
	roomSize = sanitizeInput(roomSize);
	roomFacilities = sanitizeInput(roomFacilities);
	bathRoomFacilities = sanitizeInput(bathRoomFacilities);
	price = sanitizeInput(price);
	pic = sanitizeInput(pic);

	const sanitizedRoomId = sanitizeInput(req.params.id);
	const room = await Room.findById(sanitizedRoomId);

	if (room) {
		room.roomType = roomType;
		room.availability = availability;
		room.beds = beds;
		room.roomSize = roomSize;
		room.roomFacilities = roomFacilities;
		room.bathRoomFacilities = bathRoomFacilities;
		room.price = price;
		room.pic = pic;

		const updatedRoom = await room.save();
		res.json(updatedRoom);
	} else {
		res.status(404);
		throw new Error("Room not found");
	}
});

const deleteRoom = asyncHandler(async (req, res) => {
	const sanitizedRoomId = sanitizeInput(req.params.id);
	const room = await Room.findById(sanitizedRoomId);

	if (room) {
		await room.deleteOne();
		res.json({ message: "Room removed" });
	} else {
		res.status(404);
		throw new Error("Room not found");
	}
});

module.exports = {
	getRooms,
	createRoom,
	getRoomById,
	updateRoom,
	deleteRoom,
};
