
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

// Configurazione Database utilizzando i SECRET forniti
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

const initDb = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Verifica connessione
    const connection = await pool.getConnection();
    console.log('✅ Connessione al database MySQL riuscita.');

    // Creazione tabella Utenti se non esiste
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);

    // Creazione tabella Libri se non esiste
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
        INDEX (userId),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    connection.release();
    console.log('✅ Tabelle database verificate e pronte.');
  } catch (err) {
    console.error('❌ Errore critico durante l\'inizializzazione del database:', err.message);
    console.error('Assicurati che i segreti DB_NAME, DB_USERNAME e DB_PASSWORD siano corretti.');
  }
};

// API Endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT id, username, email FROM users WHERE email = ? AND password = ?', [email, password]);
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
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Questa email è già registrata.' });
    } else {
      res.status(500).json({ error: err.message });
    }
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

// Serve static files e SPA handling
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  // Se siamo in sviluppo Vite gestisce le rotte, altrimenti serviamo index.html dalla dist
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      // Fallback per ambiente di sviluppo locale se 'dist' non esiste ancora
      res.status(200).send('Il server è attivo. Se vedi questo messaggio in produzione, esegui prima il build del frontend.');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server BiblioTech attivo sulla porta ${PORT}`);
  initDb();
});
