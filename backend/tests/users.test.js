const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

// Création de la base en mémoire
const db = new sqlite3.Database(':memory:');

// Création de l'app Express
const app = express();
app.use(bodyParser.json());

// Création de la table users pour les tests
beforeAll((done) => {
  db.run(
    'CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)',
    done
  );
});

// Définition des routes comme dans ton backend
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  db.run(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, email });
    }
  );
});

app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Fermeture propre après les tests
afterAll((done) => {
  db.close(done);
});

// ✅ TESTS

test('devrait créer un utilisateur', async () => {
  const response = await request(app).post('/api/users').send({
    name: 'Test User',
    email: 'test@example.com',
  });

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  expect(response.body.name).toBe('Test User');
});

test('devrait récupérer les utilisateurs', async () => {
  const response = await request(app).get('/api/users');

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toBeGreaterThan(0); // Car un user est déjà ajouté
});
