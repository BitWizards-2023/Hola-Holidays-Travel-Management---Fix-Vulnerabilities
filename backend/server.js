const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
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
const passport = require('passport');
require('./config/passportConfig');


dotenv.config();
connectDB();
app.use(express.json());
app.use(cors({
	origin: 'http://localhost:3000', // or your frontend origin
	credentials: true, // allow credentials (cookies) to be sent
}));


app.get("/", (req, res) => {
	res.send("API is Running");
});


// Session middleware
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false, // avoid resaving session if not modified
	saveUninitialized: false, // only create session when something is stored
	cookie: {
		secure: false, // ensure this is true when using HTTPS in production
		httpOnly: true, // prevent client-side access to session cookie
	},
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Routes (including auth routes)
app.use('/', authRoutes);

app.use("/user/admin", adminRoutes);
app.use("/user/customer", customerRoutes);
app.use("/sites", siteRoutes);
app.use("/transport", transportRoute);
app.use("/guide", tourGuideRoutes);
app.use("/hotels", hotelRoutes);
app.use("/rooms", roomRoutes);
app.use("/reservations", reservationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = 5001 || 5002;
app.listen(PORT, console.log(`Server Started on port ${PORT}..`));
