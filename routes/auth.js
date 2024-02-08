const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/login', (req, res) => {
  try {
    res.render('login');
  } catch (error) {
    console.error('Login page rendering error:', error.stack); // gpt_pilot_debugging_log
    res.status(500).send("Error rendering login page.");
  }
});

router.post('/register', async (req, res) => {
  console.log('Register request body:', req.body); // gpt_pilot_debugging_log
  try {
    const newUser = new User({ username: req.body.username });
    await User.register(newUser, req.body.password);
    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error during registration:', error.stack); // gpt_pilot_debugging_log
    res.status(500).send(error.message);
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true // Provide feedback for the user on authentication failure
}), (req, res) => {
  // Logging for debugging
  console.log('User logged in:', req.user); // gpt_pilot_debugging_log
});
  
router.get('/register', (req, res) => {
  try {
    res.render('register');
  } catch (error) {
    console.error('Register page rendering error:', error.stack); // gpt_pilot_debugging_log
    res.status(500).send("Error rendering register page.");
  }
});

router.get('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      console.error('Logout error:', error.stack); // gpt_pilot_debugging_log
      res.status(500).send("Error during logout.");
      return;
    }
    try {
      res.render('logout'); // Render logout message page after logging out
    } catch (error) {
      console.error('Logout page rendering error:', error.stack); // gpt_pilot_debugging_log
      res.status(500).send("Error rendering logout page.");
    }
  });
});

module.exports = router;