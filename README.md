# Star_History

Star_History is a Node.js web application that enables authenticated users to visualize and compare the star history of two public GitHub repositories. Users can input GitHub repository URLs, and the app fetches the historical star data, displays it on an interactive line chart, and stores it in MongoDB for future queries.

## Overview

The app's backend is built on Node.js with Express, using Passport.js for user authentication and MongoDB for session storage and data persistence. The frontend uses EJS for templating and Chart.js for rendering the comparative star history charts. The GitHub API is accessed using an authenticated token to retrieve historical star data, which is stored in a .env file for security.

## Features

- Comparison of GitHub repository star history via inputted URLs
- Zoomable line charts for detailed star history analysis
- User registration, login, and logout functionality
- Caching of repository star data in MongoDB to optimize performance
- Error handling for private repositories and invalid URL inputs

## Getting started

### Requirements

- Node.js
- MongoDB
- A GitHub account with an API token

### Quickstart

1. Clone the repository to your local environment.
2. Install the necessary npm packages using `npm install`.
3. Configure the .env file with your GitHub API token and MongoDB URI.
4. Start the MongoDB service on your system.
5. Launch the application with `npm start` and access it at `http://localhost:3000/`.

### License

Copyright (c) 2024.