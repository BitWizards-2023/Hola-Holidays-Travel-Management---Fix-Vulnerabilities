// backend/routes/authRoutes.js

const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiate Google login
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/auth/google/callback',
    passport.authenticate("google", {
        successRedirect: "http://localhost:3000/loading", // Redirect to the homepage after successful authentication
        failureRedirect: "http://localhost:3000/customer-login", // Redirect to login page if authentication fails // Redirect to login page if authentication fails
    })
);

router.get('/auth', (req, res) => {
    if (req.isAuthenticated()) {
        // Send user info if authenticated
        res.status(200).json(req.user);
    } else {
        // Send error if not authenticated
        res.status(401).json({ message: 'User not authenticated' });
    }
});

// Facebook authentication
router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: "http://localhost:3000/loading",  // Redirect after successful login
        failureRedirect: "http://localhost:3000/customer-login" // Redirect on failure
    })
);

// Logout route
router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
