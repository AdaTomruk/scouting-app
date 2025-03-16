const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { getMatchScores, saveMatchScore } = require('./database');
const { registerUser, loginUser, authenticateToken } = require('./auth');
const { fetchMatchData, fetchTeamInfo } = require('./tbaApi');
const { sendNotification } = require('./notifications');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// User authentication routes
app.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const token = await loginUser(req.body);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Match score recording routes
app.post('/match-scores', authenticateToken, async (req, res) => {
  try {
    const matchScore = await saveMatchScore(req.body);
    res.status(201).json(matchScore);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/match-scores', authenticateToken, async (req, res) => {
  try {
    const matchScores = await getMatchScores();
    res.status(200).json(matchScores);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// TBA API integration routes
app.get('/tba/match-data', authenticateToken, async (req, res) => {
  try {
    const matchData = await fetchMatchData();
    res.status(200).json(matchData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/tba/team-info', authenticateToken, async (req, res) => {
  try {
    const teamInfo = await fetchTeamInfo();
    res.status(200).json(teamInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Notifications route
app.post('/notifications', authenticateToken, async (req, res) => {
  try {
    await sendNotification(req.body);
    res.status(200).json({ message: 'Notification sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
