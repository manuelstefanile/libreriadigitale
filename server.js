
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Configurazione Database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let pool;

const initDb = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Test connessione
    const connection = await pool.getConnection();
    console.log('Connesso a MySQL correttamente.');

    // Creazione tabella Utenti
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);

    // Creazione tabella Libri
    await connection.query(`
      CREATE TABLE IF NOT EXISTS books (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50),
        userId VARCHAR(36),
        coverUrl LONGTEXT,
        createdAt BIGINT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    connection.release();
    console.log('Tabelle database verificate/create.');
  } catch (err) {
    console.error('Errore inizializzazione database:', err);
  }
};

// API Endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(401).json({ error: 'Credenziali non valide' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { id, username, email, password } = req.body;
  try {
    await pool.query('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)', [id, username, email, password]);
    res.json({ id, username, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/books', async (req, res) => {
  const { id, title, author, description, status, userId, coverUrl, createdAt } = req.body;
  try {
    await pool.query(
      'INSERT INTO books (id, title, author, description, status, userId, coverUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, author, description, status, userId, coverUrl, createdAt]
    );
    res.json({ id, title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/books/:id', async (req, res) => {
  const { title, author, description, status, coverUrl } = req.body;
  try {
    await pool.query(
      'UPDATE books SET title = ?, author = ?, description = ?, status = ?, coverUrl = ? WHERE id = ?',
      [title, author, description, status, coverUrl, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initDb();
});
