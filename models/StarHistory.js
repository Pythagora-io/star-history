const mongoose = require('mongoose');

const starHistorySchema = new mongoose.Schema({
  repoName: { type: String, required: true },
  stars: [
    {
      date: Date,
      count: Number
    }
  ],
  lastUpdated: { type: Date, default: Date.now }
});

const StarHistory = mongoose.model('StarHistory', starHistorySchema);

module.exports = StarHistory;
