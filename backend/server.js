const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// Middleware JSON
app.use(express.json());

// Connexion PostgreSQL (via Docker ou local)
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'users_db',
  password: process.env.PGPASSWORD || '1234',
  port: process.env.PGPORT || 5432,
});

// Connexion à la base
pool.connect()
  .then(() => console.log("✅ Connecté à PostgreSQL (users_db)"))
  .catch(err => console.error("❌ Erreur de connexion à PostgreSQL :", err));

// Création de la table si elle n'existe pas
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL
  )
`).then(() => console.log("✅ Table 'users' prête dans users_db !"))
  .catch(err => console.error("❌ Erreur lors de la création de la table :", err));

// Routes API
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json({ message: 'success', data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'success', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
      [name, email, role]
    );
    res.json({ message: '✅ Utilisateur ajouté avec succès !', data: result.rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
      [name, email, role, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json({ message: '✅ Utilisateur mis à jour avec succès !', data: result.rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json({ message: '✅ Utilisateur supprimé avec succès !' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ⚠️ Export de l'app pour les tests
module.exports = app;

// Démarrage du serveur uniquement si ce fichier est exécuté directement
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
  });
}
