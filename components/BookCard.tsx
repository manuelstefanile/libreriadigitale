
import React from 'react';
import { Book, BookStatus } from '../types';

interface BookCardProps {
  book: Book;
  onDelete?: (id: string) => void;
  onEdit?: (book: Book) => void;
  onSelect?: (book: Book) => void;
  showActions?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDelete, onEdit, onSelect, showActions = false }) => {
  const getStatusConfig = (status: BookStatus) => {
    switch (status) {
      case BookStatus.READING: 
        return { label: 'In Lettura', bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-700' };
      case BookStatus.COMPLETED: 
        return { label: 'Completato', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' };
      default: 
        return { label: 'Wishlist', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600' };
    }
  };

  const config = getStatusConfig(book.status);

  return (
    <div 
      onClick={() => onSelect?.(book)}
      className="group relative bg-white rounded-[3rem] p-4 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(15,23,42,0.12)] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col h-full hover:-translate-y-4 hover:scale-[1.02]"
    >
      {/* Contenitore Immagine */}
      <div className="relative aspect-[4/5.5] overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100">
        <img 
          src={book.coverUrl || `https://picsum.photos/seed/${book.id}/400/600`} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/10 transition-colors duration-700"></div>
        
        {/* Badge Flottante Premium */}
        <div className="absolute top-4 left-4">
          <div className={`backdrop-blur-md ${config.bg} ${config.text} px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border ${config.border} shadow-sm`}>
            {config.label}
          </div>
        </div>
      </div>

      {/* Info Testo */}
      <div className="px-5 py-7 flex flex-col flex-1">
        <h3 className="text-2xl font-black text-slate-950 line-clamp-2 leading-tight mb-2 group-hover:text-indigo-700 transition-colors font-serif">
          {book.title}
        </h3>
        <p className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">{book.author}</p>
        
        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium opacity-80 mb-6">
          {book.description || 'Questo volume non possiede ancora una sinossi dettagliata nell\'archivio.'}
        </p>

        {showActions && (
          <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.(book); }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edita
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(book.id); }}
              className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full blur-3xl -translate-y-12 translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default BookCard;
