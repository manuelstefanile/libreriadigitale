
import { User, Book } from '../types';

// Utilizziamo un percorso relativo per le API, così funzionano sullo stesso host/porta del deploy
const API_BASE = '/api';

export const storageService = {
  // Health Check
  checkHealth: async (): Promise<{ status: string; database: string } | null> => {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        // Timeout breve per non bloccare la UI
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error('Backend non raggiungibile:', e);
      return null;
    }
  },

  // Autenticazione
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error('Errore login:', e);
      throw e;
    }
  },

  register: async (user: User & { password?: string }): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Errore registrazione');
      }
      return await response.json();
    } catch (e) {
      console.error('Errore registrazione:', e);
      throw e;
    }
  },

  // Operazioni sui Libri
  getBooks: async (): Promise<Book[]> => {
    try {
      const response = await fetch(`${API_BASE}/books`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((b: any) => ({
        ...b,
        createdAt: Number(b.createdAt) // Assicuriamoci che sia un numero
      }));
    } catch (e) {
      console.error('Errore recupero libri:', e);
      return [];
    }
  },

  saveBook: async (book: Book): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      return response.ok;
    } catch (e) {
      console.error('Errore salvataggio libro:', e);
      return false;
    }
  },

  updateBook: async (book: Book): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/books/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      return response.ok;
    } catch (e) {
      console.error('Errore aggiornamento libro:', e);
      return false;
    }
  },

  deleteBook: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/books/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (e) {
      console.error('Errore eliminazione libro:', e);
      return false;
    }
  }
};
