const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const siteSchema = new mongoose.Schema({
	siteName: {
		type: String,
		required: [true, "Site name is required"],
		unique: true,
		trim: true, // Trim whitespace
		minlength: [3, "Site name must be at least 3 characters long"],
		maxlength: [100, "Site name cannot exceed 100 characters"],
	},
	country: {
		type: String,
		required: [true, "Country is required"],
		trim: true,
		minlength: [2, "Country must be at least 2 characters long"],
		maxlength: [100, "Country cannot exceed 100 characters"],
	},
	province: {
		type: String,
		required: [true, "Province is required"],
		trim: true,
		minlength: [2, "Province must be at least 2 characters long"],
		maxlength: [100, "Province cannot exceed 100 characters"],
	},
	siteLocation: {
		type: String,
		required: [true, "Site location is required"],
		trim: true,
		minlength: [3, "Site location must be at least 3 characters long"],
		maxlength: [200, "Site location cannot exceed 200 characters"],
	},
	postalCode: {
		type: Number,
		required: [true, "Postal code is required"],
		validate: {
			validator: function (v) {
				return /^[0-9]{4,10}$/.test(v); // Validates postal codes with 4-10 digits
			},
			message: (props) => `${props.value} is not a valid postal code!`,
		},
	},
	picURL: {
		type: String,
		required: [true, "Picture URL is required"],
		default:
			"https://res.cloudinary.com/dfmnpw0yp/image/upload/v1682779898/Hola%20Holidays/assets/zsa4281sbunh7hq1kuys.jpg",
		validate: {
			validator: function (v) {
				// Basic URL validation
				return /^(http|https):\/\/[^ "]+$/.test(v);
			},
			message: (props) => `${props.value} is not a valid URL!`,
		},
	},
	description: {
		type: String,
		required: [true, "Description is required"],
		trim: true,
		maxlength: [1000, "Description cannot exceed 1000 characters"],
	},
	recommendations: {
		type: String,
		required: [true, "Recommendations are required"],
		trim: true,
		maxlength: [1000, "Recommendations cannot exceed 1000 characters"],
	},
	specialEvents: {
		type: String,
		required: [true, "Special events are required"],
		trim: true,
		maxlength: [500, "Special events cannot exceed 500 characters"],
	},
	specialInstructions: {
		type: String,
		required: [true, "Special instructions are required"],
		trim: true,
		maxlength: [500, "Special instructions cannot exceed 500 characters"],
	},
	moreInfoURL: {
		type: String,
		required: [true, "More info URL is required"],
		validate: {
			validator: function (v) {
				// Basic URL validation
				return /^(http|https):\/\/[^ "]+$/.test(v);
			},
			message: (props) => `${props.value} is not a valid URL!`,
		},
		trim: true,
	},
});
const Site = mongoose.model("Site", siteSchema);

module.exports = Site;
