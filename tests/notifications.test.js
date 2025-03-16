const { sendNotification, fetchUpcomingMatches } = require('../src/notifications');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

describe('Notification Functions', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should send notification with match data', async () => {
    const mockMatchData = { eventKey: '2022miket', message: 'Upcoming match!' };
    const mockResponse = { match_number: 1, score: 100 };
    mock.onGet('https://www.thebluealliance.com/api/v3/match/2022miket').reply(200, mockResponse);

    const consoleSpy = jest.spyOn(console, 'log');
    await sendNotification(mockMatchData);
    expect(consoleSpy).toHaveBeenCalledWith('Notification for event 2022miket: Upcoming match!');
    consoleSpy.mockRestore();
  });

  test('should fetch upcoming matches from TBA API', async () => {
    const mockUpcomingMatches = [{ event_key: '2022miket', name: 'Test Event' }];
    mock.onGet('https://www.thebluealliance.com/api/v3/events/upcoming').reply(200, mockUpcomingMatches);

    const upcomingMatches = await fetchUpcomingMatches();
    expect(upcomingMatches).toEqual(mockUpcomingMatches);
  });
});
