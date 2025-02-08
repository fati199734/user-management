// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [editingUser, setEditingUser] = useState(null);

  // Fonction pour récupérer la liste des utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const json = await response.json();
      setUsers(json.data);
    } catch (error) {
      console.error('Erreur lors du fetch des utilisateurs', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Gérer le changement des inputs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Gérer la soumission du formulaire pour créer ou modifier un utilisateur
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        setForm({ name: '', email: '', role: '' });
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire', error);
    }
  };

  // Préparer la modification d'un utilisateur
  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  return (
    <div className="App">
      <h1>Gestion des Utilisateurs</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Rôle"
          value={form.role}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingUser ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {editingUser && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setForm({ name: '', email: '', role: '' });
            }}
          >
            Annuler
          </button>
        )}
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> ({user.email}) - {user.role}{' '}
            <button onClick={() => handleEdit(user)}>Modifier</button>
            <button onClick={() => handleDelete(user.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
