// dbTest.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // base de test en mémoire

// Crée la table users avant les tests
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    )
  `);
});

module.exports = db;
