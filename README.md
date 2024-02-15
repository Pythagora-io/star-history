# Star_History

Star_History is a Node.js web application that allows users to visualize the star history of GitHub repositories. It compares the popularity over time of two public repositories by plotting an interactive and zoomable line chart based on the number of stars the repositories have received. Users can register and login to gain access to this tool, ensuring that the GitHub API is queried securely using authenticated requests.

## Overview

The application is built using the Express framework in Node.js and employs MongoDB for session storage and caching star histories to optimize performance. User authentication is provided by Passport.js. The front end is constructed using EJS templates, and charts are powered by Chart.js with a zoom plugin. It enforces the use of environmental variables such as the MongoDB URI and GitHub API token for secure operations.

## Features

- Interactive visualization of GitHub star history for comparison between repositories
- Secure user authentication with register, login, and logout capabilities
- Cache mechanism to store star history, minimizing repetitive API calls
- Error handling for non-public repositories
- Environmental variable management with dotenv for security

## Getting started

### Requirements

- Node.js
- MongoDB with running service
- GitHub API token

### Quickstart

1. Clone the repository to your local machine.
2. Install the project dependencies with `npm install`.
3. Setup the `.env` file with the necessary environmental variables.
4. Start your local MongoDB service.
5. Run the server with `npm start` and navigate to `http://localhost:3000/` in your web browser.

### License

Copyright (c) 2024.