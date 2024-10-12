const Site = require("../models/siteModel");
const asyncHandler = require("express-async-handler");

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

// Add a new site
const addSite = asyncHandler(async (req, res) => {
	let {
		siteName,
		country,
		province,
		siteLocation,
		postalCode,
		picURL,
		description,
		recommendations,
		specialEvents,
		specialInstructions,
		moreInfoURL,
	} = req.body;

	// Sanitize all inputs
	siteName = sanitizeInput(siteName);
	country = sanitizeInput(country);
	province = sanitizeInput(province);
	siteLocation = sanitizeInput(siteLocation);
	postalCode = sanitizeInput(postalCode);
	picURL = sanitizeInput(picURL);
	description = sanitizeInput(description);
	recommendations = sanitizeInput(recommendations);
	specialEvents = sanitizeInput(specialEvents);
	specialInstructions = sanitizeInput(specialInstructions);
	moreInfoURL = sanitizeInput(moreInfoURL);

	const siteExists = await Site.findOne({ siteName });
	if (siteExists) {
		res.status(400);
		throw new Error("Site Already Exists!");
	} else {
		if (
			!siteName ||
			!country ||
			!province ||
			!siteLocation ||
			!postalCode ||
			!picURL ||
			!description ||
			!recommendations ||
			!specialEvents ||
			!specialInstructions ||
			!moreInfoURL
		) {
			res.status(400);
			throw new Error("Please fill all the fields");
		} else {
			const site = new Site({
				siteName,
				country,
				province,
				siteLocation,
				postalCode,
				picURL,
				description,
				recommendations,
				specialEvents,
				specialInstructions,
				moreInfoURL,
			});

			const addedSite = await site.save();
			res.status(201).json(addedSite);
		}
	}
});

// Get all sites
const getSites = asyncHandler(async (req, res) => {
	const sites = await Site.find();
	res.json(sites);
});

// Get sites for a specific location
const getSitesForEachLocation = asyncHandler(async (req, res) => {
	const sanitizedProvince = sanitizeInput(req.params.id);
	const sites = await Site.find({ province: sanitizedProvince });
	res.status(201).json(sites);
});

// Get a site by ID
const getSiteById = asyncHandler(async (req, res) => {
	const sanitizedSiteId = sanitizeInput(req.params.id);
	const site = await Site.findById(sanitizedSiteId);

	if (site) {
		res.json(site);
	} else {
		res.status(404).json({ message: "Site not found" });
	}
});

// Update a site
const updateSite = asyncHandler(async (req, res) => {
	let {
		siteName,
		country,
		province,
		siteLocation,
		postalCode,
		picURL,
		description,
		recommendations,
		specialEvents,
		specialInstructions,
		moreInfoURL,
	} = req.body;

	// Sanitize all inputs
	siteName = sanitizeInput(siteName);
	country = sanitizeInput(country);
	province = sanitizeInput(province);
	siteLocation = sanitizeInput(siteLocation);
	postalCode = sanitizeInput(postalCode);
	picURL = sanitizeInput(picURL);
	description = sanitizeInput(description);
	recommendations = sanitizeInput(recommendations);
	specialEvents = sanitizeInput(specialEvents);
	specialInstructions = sanitizeInput(specialInstructions);
	moreInfoURL = sanitizeInput(moreInfoURL);

	const sanitizedSiteId = sanitizeInput(req.params.id);
	const site = await Site.findById(sanitizedSiteId);

	if (site) {
		site.siteName = siteName;
		site.country = country;
		site.province = province;
		site.siteLocation = siteLocation;
		site.postalCode = postalCode;
		site.picURL = picURL;
		site.description = description;
		site.recommendations = recommendations;
		site.specialEvents = specialEvents;
		site.specialInstructions = specialInstructions;
		site.moreInfoURL = moreInfoURL;

		const updatedSite = await site.save();
		res.json(updatedSite);
	} else {
		res.status(404);
		throw new Error("Site not found");
	}
});

// Delete a site
const deleteSite = asyncHandler(async (req, res) => {
	const sanitizedSiteId = sanitizeInput(req.params.id);
	const site = await Site.findById(sanitizedSiteId);

	if (site) {
		await site.deleteOne();
		res.json({ message: "Site Removed" });
	} else {
		res.status(404);
		throw new Error("Site not Found");
	}
});

module.exports = {
	addSite,
	getSites,
	getSitesForEachLocation,
	getSiteById,
	updateSite,
	deleteSite,
};
