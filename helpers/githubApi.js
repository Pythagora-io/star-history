const axios = require('axios');

async function fetchStargazers(repoName, authToken, perPage = 100) {
  const GITHUB_API_URL = 'https://api.github.com';
  let stargazers = [];
  let page = 1;
  let shouldFetch = true;

  console.log(`Starting to fetch stargazers for ${repoName}...`); // gpt_pilot_debugging_log

  while (shouldFetch) {
    const url = `${GITHUB_API_URL}/repos/${repoName}/stargazers?page=${page}&per_page=${perPage}`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': authToken,
          'Accept': 'application/vnd.github.v3.star+json' // Required for star creation timestamps
        }
      });

      console.log(`Fetched ${response.data.length} stargazers for ${repoName} - Page ${page}`); // gpt_pilot_debugging_log

      if (response.headers['x-ratelimit-remaining'] === '0') {
        console.error(`GitHub API rate limit reached for repository ${repoName}`); // gpt_pilot_debugging_log
        break;
      }

      if (response.data.length === 0) {
        shouldFetch = false;
      } else {
        stargazers = stargazers.concat(response.data);
        page++;
      }
    } catch (error) {
      console.error('Error during GitHub API call:', error.response || error.message || error); // gpt_pilot_debugging_log
      throw error;
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simple rate limit handling
  }

  return stargazers;
}

module.exports = {
  fetchStargazers
};