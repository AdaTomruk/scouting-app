const axios = require('axios');
const { fetchMatchData } = require('./tbaApi');

const TBA_API_BASE_URL = 'https://www.thebluealliance.com/api/v3';
const TBA_API_KEY = process.env.TBA_API_KEY;

async function sendNotification(notificationData) {
  const { eventKey, message } = notificationData;
  const matchData = await fetchMatchData(eventKey);

  // Implement logic to send notification based on matchData and message
  // This is a placeholder function
  console.log(`Notification for event ${eventKey}: ${message}`);
}

async function fetchUpcomingMatches() {
  try {
    const response = await axios.get(`${TBA_API_BASE_URL}/events/upcoming`, {
      headers: {
        'X-TBA-Auth-Key': TBA_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching upcoming matches from TBA API');
  }
}

module.exports = {
  sendNotification,
  fetchUpcomingMatches,
};
