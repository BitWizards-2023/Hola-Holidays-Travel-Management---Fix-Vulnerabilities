const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const passport = require("passport");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const siteRoutes = require("./routes/siteRoutes");
const transportRoute = require("./routes/transportRoutes");
const tourGuideRoutes = require("./routes/TourGuideRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require('./config/passportConfig'); // Passport config

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Secure CORS configuration
const allowedOrigins = ['http://localhost:3000'];

//Fixed Cross-domain miss-configuration of the backend
app.use(cors({
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Secure HTTP Headers using Helmet
app.use(helmet());

// Configure Content Security Policy (CSP) to mitigate XSS attacks
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'", "trusted-scripts.com"],
		styleSrc: ["'self'", "trusted-styles.com"],
	},
	reportOnly: true, // Enable CSP report-only mode during testing
}));

// Session Middleware Configuration
app.use(session({
	secret: process.env.SECRET_KEY, // Use a strong secret in production
	resave: false, // Avoid resaving session if not modified
	saveUninitialized: false, // Only create session when something is stored
	cookie: {
		secure: false, // Set to true when using HTTPS in production
		httpOnly: true, // Prevent client-side access to session cookie
	},
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Cookie Parser
app.use(cookieParser());

// Basic route to check if the API is running
app.get("/", (req, res) => {
	res.send("API is Running");
});

// Auth routes (Google, Facebook, etc.)
app.use('/', authRoutes);

// Application routes
app.use("/user/admin", adminRoutes);
app.use("/user/customer", customerRoutes);
app.use("/sites", siteRoutes);
app.use("/transport", transportRoute);
app.use("/guide", tourGuideRoutes);
app.use("/hotels", hotelRoutes);
app.use("/rooms", roomRoutes);
app.use("/reservations", reservationRoutes);

// Middleware for handling 404 errors
app.use(notFound);

// Global error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
	console.log(`Server Started on port ${PORT}..`);
});
