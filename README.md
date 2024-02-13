# Star_History

Star_History is a Node.js web application that allows users to input URLs for two public GitHub repositories, compare their historical star data, and visualize this information on a zoomable line chart. Users must be registered and authenticated to access this feature.

## Overview

The application is structured into a backend built with Node.js and Express, serving EJS rendered pages for the user interface. User sessions are managed with MongoDB utilizing connect-mongo, while user authentication is handled by Passport.js. The star history data is fetched using the authenticated GitHub API, stored in MongoDB for caching, and plotted using Chart.js with a chartjs-plugin-zoom for interactivity.

## Features

- Fetch and compare star history for two public GitHub repositories
- User authentication with register/login/logout functionality
- Cached star history data to minimize API calls
- Zoomable and interactive line charts
- Server-side error handling and user input validation

## Getting started

### Requirements

- Node.js
- MongoDB
- A GitHub API token

### Quickstart

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install`.
3. Create a `.env` file with your own GitHub API token and other environment settings.
4. Ensure that MongoDB is running locally on your machine.
5. Start the application server with `npm start` and access it via `http://localhost:3000/`.

### License

Copyright (c) 2024.