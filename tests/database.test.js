const { saveMatchScore, getMatchScores } = require('../src/database');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../src/scoutingApp.db');
const db = new sqlite3.Database(dbPath);

describe('Database Functions', () => {
  beforeAll((done) => {
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS match_scores');
      db.run(`
        CREATE TABLE match_scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          team_number INTEGER NOT NULL,
          match_number INTEGER NOT NULL,
          score INTEGER NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, done);
    });
  });

  afterAll((done) => {
    db.close(done);
  });

  test('should save a match score', async () => {
    const matchScore = { team_number: 1234, match_number: 1, score: 100 };
    const savedMatchScore = await saveMatchScore(matchScore);
    expect(savedMatchScore).toHaveProperty('id');
    expect(savedMatchScore).toHaveProperty('team_number', 1234);
    expect(savedMatchScore).toHaveProperty('match_number', 1);
    expect(savedMatchScore).toHaveProperty('score', 100);
  });

  test('should retrieve match scores', async () => {
    const matchScores = await getMatchScores();
    expect(Array.isArray(matchScores)).toBe(true);
    expect(matchScores.length).toBeGreaterThan(0);
    expect(matchScores[0]).toHaveProperty('id');
    expect(matchScores[0]).toHaveProperty('team_number');
    expect(matchScores[0]).toHaveProperty('match_number');
    expect(matchScores[0]).toHaveProperty('score');
    expect(matchScores[0]).toHaveProperty('timestamp');
  });
});
