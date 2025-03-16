const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'scoutingApp.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS match_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_number INTEGER NOT NULL,
      match_number INTEGER NOT NULL,
      score INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function saveMatchScore(matchScore) {
  return new Promise((resolve, reject) => {
    const { team_number, match_number, score } = matchScore;
    const query = `
      INSERT INTO match_scores (team_number, match_number, score)
      VALUES (?, ?, ?)
    `;
    db.run(query, [team_number, match_number, score], function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID, ...matchScore });
    });
  });
}

function getMatchScores() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM match_scores
      ORDER BY timestamp DESC
    `;
    db.all(query, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  saveMatchScore,
  getMatchScores,
};
