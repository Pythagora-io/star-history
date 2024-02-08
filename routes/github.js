const express = require('express');
const axios = require('axios');
const StarHistory = require('../models/StarHistory');
const { fetchStargazers } = require('../helpers/githubApi');
const router = express.Router();

const GITHUB_API_URL = 'https://api.github.com';

const errorHandler = (error) => {
  if (error.response) {
    console.error('Error data:', error.response.data); // gpt_pilot_debugging_log
    console.error('Error status:', error.response.status); // gpt_pilot_debugging_log
    console.error('Error headers:', error.response.headers); // gpt_pilot_debugging_log
  } else if (error.request) {
    console.error('Error request:', error.request); // gpt_pilot_debugging_log
  } else {
    console.error('Error message:', error.message); // gpt_pilot_debugging_log
  }
  console.error('Error config:', error.config); // gpt_pilot_debugging_log
};

const processStargazers = (stargazers, repoName) => {
  console.log(`Processing ${stargazers.length} stargazers for repo: ${repoName}`); // gpt_pilot_debugging_log
  console.log(`Stargazers data: ${JSON.stringify(stargazers, null, 2)}`); // gpt_pilot_debugging_log
  const starsTimeline = [];
  stargazers.forEach(stargazer => {
    // Add debug logging for starred_at
    console.log(`starred_at value for stargazer: ${stargazer.starred_at}`); // gpt_pilot_debugging_log
    
    const starredAt = new Date(stargazer.starred_at);

    console.log(`Processing starred_at for stargazer: ${starredAt.toISOString()}, parsed date: ${starredAt}`); // gpt_pilot_debugging_log

    if (isNaN(starredAt.getTime())) {
      console.error(`Invalid date found for stargazer star time: ${starredAt.toISOString()}`); // gpt_pilot_debugging_log
      console.error(`Skipped a stargazer due to invalid date: ${starredAt.toISOString()}`); // gpt_pilot_debugging_log
      return; // Skip this entry and continue with the next stargazer
    }

    if (starsTimeline.length === 0 || starredAt > starsTimeline[starsTimeline.length - 1].date) {
      starsTimeline.push({
        date: starredAt,
        count: starsTimeline.length + 1 // Because the array is 0-indexed
      });
    }
  });
  console.log(`Processed starsTimeline for repo: ${repoName}, length: ${starsTimeline.length}`); // gpt_pilot_debugging_log
  return starsTimeline;
};

router.post('/fetch-stars', async (req, res, next) => {
  const { repoUrl1, repoUrl2 } = req.body;

  const extractRepoName = (url) => {
    const pattern = /github\.com\/(\S+\/\S+?)(\.git)?$/;
    const match = pattern.exec(url);
    return match ? match[1] : null;
  };

  const repoNames = [extractRepoName(repoUrl1), extractRepoName(repoUrl2)];
  const authToken = `token ${process.env.GITHUB_TOKEN}`;

  try {
    const starHistories = await Promise.all(repoNames.map(async (repoName) => {
      if (!repoName) throw new Error("Invalid repository URL");

      let starHistory = await StarHistory.findOne({ repoName: repoName });

      if (!starHistory || (Date.now() - starHistory.lastUpdated) > 86400000) {
        let stargazers;
        try {
          stargazers = await fetchStargazers(repoName, authToken);
          console.log(`Stargazers fetched for ${repoName}`); // gpt_pilot_debugging_log
          if (stargazers.length === 0) {
            console.log(`No stargazers found for ${repoName}`); // gpt_pilot_debugging_log
          } else {
            const starData = processStargazers(stargazers, repoName);
            if (starData.length === 0) {
              console.log(`No star history processed for ${repoName}`); // gpt_pilot_debugging_log
            }
            if (starHistory) {
              starHistory.stars = starData;
              starHistory.lastUpdated = Date.now();
              await starHistory.save();
            } else {
              starHistory = new StarHistory({ repoName, stars: starData });
              await starHistory.save();
            }
          }
        } catch (error) {
          errorHandler(error);
          throw error;
        }
      }
      console.log(`Star history for ${repoName} served from ${starHistory ? 'database' : 'GitHub API'}.`); // gpt_pilot_debugging_log
      return starHistory;
    }));

    res.status(200).json(starHistories);
  } catch (error) {
    console.error('Error fetching star history:', error.stack); // gpt_pilot_debugging_log
    next(error);
  }
});

module.exports = router;