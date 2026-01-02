
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Database in memoria temporaneo (si resetta al riavvio del server)
let mockBooks = [];
let mockUsers = [];

console.log('--- MODALITÀ TEST ATTIVA: NESSUNA CONNESSIONE DB ---');

// --- ENDPOINT API CON LOGGING ---

app.get('/api/health', (req, res) => {
  console.log('[LOG] Health Check ricevuto alle:', new Date().toLocaleTimeString());
  res.json({ 
    status: 'ok', 
    server: 'attivo',
    database: 'non richiesto (in-memory)',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOG] Tentativo di login per: ${email}`);
  
  // Mock login: accetta qualsiasi password lunga almeno 3 caratteri
  if (email && password && password.length >= 3) {
    const user = { id: 'u1', username: email.split('@')[0], email };
    res.json(user);
  } else {
    res.status(401).json({ error: 'Dati non validi per il test.' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { id, username, email } = req.body;
  console.log(`[LOG] Nuovo utente registrato: ${username} (${email})`);
  res.json({ id, username, email });
});

app.get('/api/books', (req, res) => {
  console.log(`[LOG] Richiesta elenco libri. Totale in memoria: ${mockBooks.length}`);
  res.json(mockBooks);
});

app.post('/api/books', (req, res) => {
  const book = req.body;
  console.log(`[LOG] Aggiunta libro: "${book.title}" di ${book.author}`);
  mockBooks.push(book);
  res.json({ success: true, id: book.id });
});

app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  console.log(`[LOG] Aggiornamento libro ID: ${id}`);
  mockBooks = mockBooks.map(b => b.id === id ? { ...b, ...updatedData } : b);
  res.json({ success: true });
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  console.log(`[LOG] Eliminazione libro ID: ${id}`);
  mockBooks = mockBooks.filter(b => b.id !== id);
  res.json({ success: true });
});

// --- GESTIONE FILE STATICI ---

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    console.log(`[LOG] 404 - Endpoint API non trovato: ${req.path}`);
    return res.status(404).json({ error: 'Endpoint non esistente' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Backend BiblioTech Pronto. API disponibili su /api');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server di TEST in ascolto su porta ${PORT}`);
  console.log(`📍 Prova: curl http://localhost:${PORT}/api/health`);
});
