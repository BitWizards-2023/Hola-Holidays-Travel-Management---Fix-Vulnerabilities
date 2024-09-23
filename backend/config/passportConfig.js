const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const Customer = require('../models/customerModel');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5001/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            let customer = await Customer.findOne({ email });

            if (customer) {
                console.log("User already exists in the database Logging in..");
                return done(null, customer);
            } else {
                customer = new Customer({
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    gender: profile.gender || "Not Specified",
                    email: profile.emails[0].value,
                    pic: profile.photos[0].value,
                    telephone: "Not Provided",
                    address: "Not Provided",
                    password: "google-oauth",
                });

                const savedCustomer = await customer.save();
                console.log("New user saved:", savedCustomer);
                return done(null, savedCustomer);
            }
        } catch (error) {
            done(error, null);
        }
    }
));

// Facebook Strategy
// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:5001/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name', 'photos'] // Ensure the profile ID and email fields are included
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            const facebookId = profile.id; // Use the Facebook profile ID

            // First, check if a user with the Facebook ID exists in the database
            let customer = await Customer.findOne({ facebookId });

            // If no user exists with the Facebook ID, check with the email if available
            if (!customer && email) {
                customer = await Customer.findOne({ email });
            }

            // If a customer is found, log them in
            if (customer) {
                console.log("User already exists in the database. Logging in...");
                return done(null, customer);
            } else {
                // Create a new user if no match was found
                customer = new Customer({
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: email || `${profile.id}@facebook.com`, // Use Facebook profile ID as a fallback for email
                    facebookId: profile.id, // Save the Facebook ID for future logins
                    pic: profile.photos[0].value,
                    telephone: "Not Provided",
                    address: "Not Provided",
                    password: "facebook-oauth",  // Dummy password
                });

                const savedCustomer = await customer.save();
                console.log("New Facebook user saved:", savedCustomer);
                return done(null, savedCustomer);
            }
        } catch (error) {
            done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const customer = await Customer.findById(id);
        done(null, customer);
    } catch (error) {
        done(error, null);
    }
});
