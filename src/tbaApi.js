const axios = require('axios');

const TBA_API_BASE_URL = 'https://www.thebluealliance.com/api/v3';
const TBA_API_KEY = process.env.TBA_API_KEY;

async function fetchMatchData() {
  try {
    const response = await axios.get(`${TBA_API_BASE_URL}/matches`, {
      headers: {
        'X-TBA-Auth-Key': TBA_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching match data from TBA API');
  }
}

async function fetchTeamInfo(teamNumber) {
  try {
    const response = await axios.get(`${TBA_API_BASE_URL}/team/frc${teamNumber}`, {
      headers: {
        'X-TBA-Auth-Key': TBA_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching team information from TBA API');
  }
}

function compareMatchData(manualData, fetchedData) {
  // Implement comparison logic here
  // This is a placeholder function
  return {
    manualData,
    fetchedData,
  };
}

module.exports = {
  fetchMatchData,
  fetchTeamInfo,
  compareMatchData,
};
