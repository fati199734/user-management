// backend/server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware pour parser le JSON
app.use(express.json());

// Initialisation / connexion à la base SQLite
const dbPath = path.resolve(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur de connexion à la base SQLite :', err.message);
  } else {
    console.log('Connecté à la base SQLite.');
  }
});

// Création de la table "users" si elle n'existe pas déjà
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    console.error("❌ Erreur lors de la création de la table :", err.message);
  } else {
    console.log("✅ Table 'users' créée avec succès !");
  }
});
// --- Endpoints API CRUD ---
// Récupérer tous les utilisateurs
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'success', data: rows });
  });
});
// Récupérer un utilisateur par id
app.get('/api/users/:id', (req, res) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'success', data: row });
  });
});

// Créer un nouvel utilisateur
app.post('/api/users', (req, res) => {
  console.log("📩 Données reçues dans le backend :", req.body); // Debug

  const { name, email, role } = req.body;

  // Vérifier que les champs sont bien remplis
  if (!name || !email || !role) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  const sql = 'INSERT INTO users (name, email, role) VALUES (?, ?, ?)';
  const params = [name, email, role];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: '✅ Utilisateur ajouté avec succès !',
      data: { id: this.lastID, name, email, role }
    });
  });
});
// Modifier un utilisateur existant
app.put('/api/users/:id', (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
  const params = [name, email, role, id];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Utilisateur mis à jour avec succès !',
      data: { id, name, email, role },
      changes: this.changes
    });
  });
});

// Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';

  db.run(sql, id, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Utilisateur supprimé avec succès !',
      changes: this.changes
    });
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Le serveur tourne sur le port ${port}`);
});
