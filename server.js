require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Passport configuration for User authentication
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // middleware to handle URL encoded data
app.use(express.static(path.join(__dirname, 'public')));

try {
  // Set EJS as the view engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  console.log('View engine set to EJS');
} catch (error) {
  console.error('Error setting the view engine:', error.stack);
}

// Session configuration
app.use(session({
  secret: 'star_history_session_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(`MongoDB connection error: ${err.stack}`));

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Import authentication routes
const authRoutes = require('./routes/auth');
app.use(authRoutes);

// Import GitHub routes
const githubRoutes = require('./routes/github');

// Middleware to require login/auth
const authRequired = require('./middlewares/authRequired');

// Serve the main page only if the user is authenticated
app.get('/', authRequired, (req, res, next) => {
  res.render('index', {user: req.user}, function(err, html) {
    if (err) {
      console.error('Error rendering index:', err.stack); // gpt_pilot_debugging_log
      return next(err);
    }
    res.send(html);
  });
});

// Use GitHub routes
app.use('/github', githubRoutes);

// Example protected route
app.get('/dashboard', authRequired, (req, res) => {
  res.send('Welcome to your dashboard.');
});

// Routes for authentication (included above) and other functionality would be added here

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('An internal server error occurred: ', err.stack);
  res.status(err.statusCode || 500).send(err.message || 'An unexpected error occurred.');
});

// Start the server and listen on the env port or default to 3000
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address().port}`);
}).on('error', (err) => {
  console.error(`Failed to start the server on port ${process.env.PORT || 3000}:`, err.stack);
});