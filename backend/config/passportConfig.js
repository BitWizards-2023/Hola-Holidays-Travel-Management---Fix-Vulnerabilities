const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
