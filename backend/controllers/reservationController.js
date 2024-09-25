const Reservation = require("../models/reservationModel");
const Hotel = require("../models/hotelModel");
const Room = require("../models/roomModel");
const asyncHandler = require("express-async-handler");

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

// Get reservations for a specific customer
const getReservations = asyncHandler(async (req, res) => {
	const sanitizedCustomerId = sanitizeInput(req.params.id);
	const items = await Reservation.find({ customer: sanitizedCustomerId });
	res.json(items);
});

// Get reservations for a specific hotel
const getReservationsForEachHotel = asyncHandler(async (req, res) => {
	const sanitizedHotelId = sanitizeInput(req.params.id);
	const items = await Reservation.find({ hotel: sanitizedHotelId });
	res.json(items);
});

// Calculate total price for reservations
const getTotal = asyncHandler(async (req, res) => {
	const sanitizedCustomerId = sanitizeInput(req.params.id);
	const items = await Reservation.find({ customer: sanitizedCustomerId });
	let total = 0;

	items.forEach((item) => {
		total += item.price * item.noOfDates * item.noOfRooms;
	});

	const loopData = {
		totalPrice: total,
	};
	res.json(loopData);
});

// Add a new reservation
const addReservation = asyncHandler(async (req, res) => {
	let { customer, customerName, customerEmail, room, checkInDate, checkOutDate, noOfDates, noOfRooms } = req.body;

	// Sanitize all inputs
	customer = sanitizeInput(customer);
	customerName = sanitizeInput(customerName);
	customerEmail = sanitizeInput(customerEmail);
	room = sanitizeInput(room);
	checkInDate = sanitizeInput(checkInDate);
	checkOutDate = sanitizeInput(checkOutDate);
	noOfDates = sanitizeInput(noOfDates);
	noOfRooms = sanitizeInput(noOfRooms);

	if (
		!customer ||
		!customerName ||
		!customerEmail ||
		!room ||
		!checkInDate ||
		!checkOutDate ||
		!noOfDates ||
		!noOfRooms
	) {
		res.status(400);
		throw new Error("Failed adding reservation");
	} else {
		const existingReservation = await Reservation.findOne({ customer, room });

		if (existingReservation) {
			throw new Error("Already has a reservation");
		} else {
			const hotelRoom = await Room.findById(room);

			if (hotelRoom) {
				hotelRoom.availability -= 1;
				await hotelRoom.save();
			}

			const hotelItem = await Hotel.findById(hotelRoom.hotel);
			const hotelName = hotelItem.hotelName;
			const roomName = hotelRoom.roomType;
			const price = hotelRoom.price;

			const reservation = new Reservation({
				customer,
				customerName,
				customerEmail,
				hotel: hotelRoom.hotel,
				hotelName,
				room,
				roomName,
				checkInDate,
				checkOutDate,
				noOfDates,
				noOfRooms,
				price,
			});

			const createdReservation = await reservation.save();
			res.status(201).json(createdReservation);
		}
	}
});

// Update reservation details
const updateReservation = asyncHandler(async (req, res) => {
	const { noOfRooms } = req.body;
	const sanitizedReservationId = sanitizeInput(req.params.id);

	const reservation = await Reservation.findById(sanitizedReservationId);
	const room = await Room.findById(reservation.room);

	const previousQuantity = reservation.noOfRooms;

	if (room.availability <= 0 && previousQuantity < noOfRooms) {
		throw new Error("All rooms are booked");
	}

	if (previousQuantity > noOfRooms) {
		room.availability += previousQuantity - noOfRooms;
	} else if (previousQuantity < noOfRooms) {
		room.availability -= noOfRooms - previousQuantity;
	}

	await room.save();

	if (reservation) {
		reservation.noOfRooms = noOfRooms;
		const updatedReservation = await reservation.save();
		res.json(updatedReservation);
	} else {
		res.status(404);
		throw new Error("Reservation not found");
	}
});

// Delete a reservation
const deleteReservation = asyncHandler(async (req, res) => {
	const sanitizedReservationId = sanitizeInput(req.params.id);
	const reservation = await Reservation.findById(sanitizedReservationId);

	if (reservation) {
		const room = await Room.findById(reservation.room);
		room.availability += reservation.noOfRooms;
		await room.save();

		await reservation.deleteOne();
		res.json({ message: "Reservation Removed" });
	} else {
		res.status(404);
		throw new Error("Reservation not found");
	}
});

module.exports = {
	getReservations,
	addReservation,
	updateReservation,
	deleteReservation,
	getTotal,
	getReservationsForEachHotel,
};
