const { fetchMatchData, fetchTeamInfo, compareMatchData } = require('../src/tbaApi');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

describe('TBA API Functions', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should fetch match data from TBA API', async () => {
    const mockMatchData = [{ match_number: 1, score: 100 }];
    mock.onGet('https://www.thebluealliance.com/api/v3/matches').reply(200, mockMatchData);

    const matchData = await fetchMatchData();
    expect(matchData).toEqual(mockMatchData);
  });

  test('should fetch team information from TBA API', async () => {
    const teamNumber = 1234;
    const mockTeamInfo = { team_number: teamNumber, name: 'Test Team' };
    mock.onGet(`https://www.thebluealliance.com/api/v3/team/frc${teamNumber}`).reply(200, mockTeamInfo);

    const teamInfo = await fetchTeamInfo(teamNumber);
    expect(teamInfo).toEqual(mockTeamInfo);
  });

  test('should compare match data', () => {
    const manualData = { match_number: 1, score: 100 };
    const fetchedData = { match_number: 1, score: 100 };

    const comparisonResult = compareMatchData(manualData, fetchedData);
    expect(comparisonResult).toEqual({ manualData, fetchedData });
  });
});
