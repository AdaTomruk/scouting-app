const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'scoutingApp.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);
});

async function registerUser({ username, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO users (username, password, role)
      VALUES (?, ?, ?)
    `;
    db.run(query, [username, hashedPassword, role], function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID, username, role });
    });
  });
}

async function loginUser({ username, password }) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM users
      WHERE username = ?
    `;
    db.get(query, [username], async (err, user) => {
      if (err) {
        return reject(err);
      }
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return reject(new Error('Invalid username or password'));
      }
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      resolve(token);
    });
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = {
  registerUser,
  loginUser,
  authenticateToken,
};
