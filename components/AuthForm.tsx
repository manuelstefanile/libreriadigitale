
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
        else setError('Credenziali non corrette.');
      } else {
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          username: username || email.split('@')[0],
          password
        };
        const user = await storageService.register(newUser);
        if (user) onAuthSuccess(user);
        else setError('Registrazione fallita.');
      }
    } catch (err) {
      setError('Connessione al database non riuscita.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen-dynamic flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-200 mb-6 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-slate-900 font-serif tracking-tight">BiblioTech</h1>
            <p className="text-slate-500 mt-3 font-medium text-sm">Organizza il tuo sapere digitale.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input 
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value)} 
                  className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border-none outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold placeholder:text-slate-300 transition-all" 
                  placeholder="Nome utente" 
                />
              </div>
            )}
            
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border-none outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold placeholder:text-slate-300 transition-all" 
              placeholder="Email" 
            />

            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border-none outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold placeholder:text-slate-300 transition-all" 
              placeholder="Password" 
            />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isLogin ? 'Inizia l\'esplorazione' : 'Crea il tuo scaffale'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {isLogin ? 'Non hai un account? Registrati ora' : 'Hai già un account? Accedi qui'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
