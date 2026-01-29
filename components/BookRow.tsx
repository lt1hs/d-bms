import React from 'react';
import { Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { Book, User } from '../types';
import { STATUS_COLORS } from '../constants';

interface BookRowProps {
    book: Book;
    onEdit: (b: Book) => void;
    onDelete: (id: string) => void;
    onViewDetails: (b: Book) => void;
    onToggleVisibility: (id: string) => void;
    user: User | null;
}

const BookRow: React.FC<BookRowProps> = ({
    book,
    onEdit,
    onDelete,
    onViewDetails,
    onToggleVisibility,
    user
}) => {
    return (
        <div className={`bg-white p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all group flex items-center gap-6 ${book.publicVisible === false ? 'border-red-100 bg-red-50/10' : ''}`}>
            <div className="w-16 h-20 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-50">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${STATUS_COLORS[book.status]}`}>{book.status}</span>
                    <span className="text-slate-300 text-[8px] font-black uppercase tracking-widest">• {book.category}</span>
                    {book.publicVisible === false && (
                        <span className="px-2 py-0.5 bg-red-500 text-white rounded-md text-[7px] font-black uppercase tracking-widest flex items-center gap-1">
                            <EyeOff size={8} /> مخفي
                        </span>
                    )}
                </div>
                <h3 className="text-sm font-black text-slate-900 truncate mb-0.5">{book.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 truncate">{book.author}</p>
            </div>

            <div className="hidden lg:flex items-center gap-12 px-8">
                <div>
                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mb-1">سنة النشر</p>
                    <p className="text-xs font-black text-slate-700">{book.publicationYear}</p>
                </div>
                {user && (
                    <>
                        <div>
                            <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mb-1">رقم الطبعة</p>
                            <p className="text-xs font-black text-slate-700">{book.edition}</p>
                        </div>
                        <div>
                            <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mb-1">المخرج الفني</p>
                            <p className="text-xs font-black text-slate-700 truncate max-w-[100px]">{book.director || '—'}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2 border-r border-slate-50 pr-4 mr-2">
                <button
                    onClick={() => onViewDetails(book)}
                    className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black hover:bg-slate-100 transition-all"
                >
                    التفاصيل
                </button>
                {user?.permissions.canEdit && (
                    <button
                        onClick={() => onEdit(book)}
                        className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <Edit2 size={16} />
                    </button>
                )}
                {user?.permissions.canHide && (
                    <button
                        onClick={() => onToggleVisibility(book.id)}
                        className={`p-2 rounded-xl transition-all ${book.publicVisible === false ? 'text-red-500 bg-red-50' : 'text-slate-300 hover:text-emerald-500 hover:bg-slate-50'}`}
                    >
                        {book.publicVisible === false ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
                {user?.permissions.canDelete && (
                    <button
                        onClick={() => onDelete(book.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookRow;
