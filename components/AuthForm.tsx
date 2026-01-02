
import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const user = await storageService.login(email, password);
        if (user) onAuthSuccess(user);
        else setError('Credenziali errate.');
      } else {
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          username: username || email.split('@')[0],
          password
        };
        const user = await storageService.register(newUser);
        if (user) onAuthSuccess(user);
        else setError('Errore durante la registrazione.');
      }
    } catch (err: any) {
      setError(err.message || 'Errore di connessione al database.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen-dynamic flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Mesh Gradients - Soft & Editorial */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-100/50 blur-[160px] rounded-full animate-pulse"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-violet-100/50 blur-[160px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-1000">
        <div className="bg-white/90 backdrop-blur-3xl p-12 sm:p-16 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.1)] border border-white/50 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-950 text-white rounded-[2.5rem] shadow-2xl shadow-slate-200 mb-8 transform hover:rotate-6 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-black text-slate-950 font-serif tracking-tighter mb-4">BiblioTech</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">L'architettura del tuo sapere</p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl text-[10px] font-black uppercase tracking-widest text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <input 
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value)} 
                  className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-transparent outline-none focus:ring-4 focus:ring-indigo-700/5 focus:bg-white focus:border-indigo-100 font-bold text-slate-900 placeholder:text-slate-300 transition-all" 
                  placeholder="Nome utente" 
                />
              </div>
            )}
            
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-transparent outline-none focus:ring-4 focus:ring-indigo-700/5 focus:bg-white focus:border-indigo-100 font-bold text-slate-900 placeholder:text-slate-300 transition-all" 
              placeholder="Indirizzo Email" 
            />

            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-transparent outline-none focus:ring-4 focus:ring-indigo-700/5 focus:bg-white focus:border-indigo-100 font-bold text-slate-900 placeholder:text-slate-300 transition-all" 
              placeholder="Password" 
            />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-4 mt-6"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : isLogin ? 'Inizia l\'esplorazione' : 'Crea il tuo scaffale'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-700 transition-colors border-b-2 border-transparent hover:border-indigo-700 pb-1"
            >
              {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
