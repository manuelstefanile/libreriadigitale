
import { User, Book } from '../types';

const API_URL = '/api';

export const storageService = {
  // Auth
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  register: async (user: User & { password?: string }): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // Libri
  getBooks: async (): Promise<Book[]> => {
    try {
      const response = await fetch(`${API_URL}/books`);
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  saveBook: async (book: Book): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      return response.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  updateBook: async (book: Book): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/books/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      return response.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  deleteBook: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
