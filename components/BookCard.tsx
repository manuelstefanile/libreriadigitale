
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
      case BookStatus.READING: return { label: 'In Lettura', color: 'bg-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-600' };
      case BookStatus.COMPLETED: return { label: 'Letto', color: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-600' };
      case BookStatus.PUBLISHED: return { label: 'Pubblicato', color: 'bg-violet-500', bg: 'bg-violet-500/10', text: 'text-violet-600' };
      default: return { label: 'Wishlist', color: 'bg-slate-400', bg: 'bg-slate-400/10', text: 'text-slate-600' };
    }
  };

  const config = getStatusConfig(book.status);

  return (
    <div 
      onClick={() => onSelect?.(book)}
      className="group relative bg-white rounded-[2.5rem] p-3 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-12px_rgba(99,102,241,0.2)] transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full hover:-translate-y-2"
    >
      {/* Contenitore Immagine */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-100">
        <img 
          src={book.coverUrl || `https://picsum.photos/seed/${book.id}/400/600`} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
        
        {/* Badge Flottante */}
        <div className="absolute top-4 left-4">
          <div className={`backdrop-blur-xl ${config.bg} ${config.text} px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-sm`}>
            {config.label}
          </div>
        </div>
      </div>

      {/* Info Testo */}
      <div className="px-4 py-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm font-bold text-slate-400 mb-4">{book.author}</p>
        
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed opacity-70 mb-4">
          {book.description || 'Nessun dettaglio disponibile per questo volume.'}
        </p>

        {showActions && (
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.(book); }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors px-2 py-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Modifica
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(book.id); }}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Decorative Gradient Line */}
      <div className="absolute bottom-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default BookCard;
