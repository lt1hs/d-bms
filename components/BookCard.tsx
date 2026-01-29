import React from 'react';
import { Eye, EyeOff, Edit2, Trash2, Clock } from 'lucide-react';
import { Book, User } from '../types';
import { STATUS_COLORS } from '../constants';

interface BookCardProps {
    book: Book;
    onEdit: (b: Book) => void;
    onDelete: (id: string) => void;
    onViewDetails: (b: Book) => void;
    onToggleVisibility: (id: string) => void;
    user: User | null;
}

const BookCard: React.FC<BookCardProps> = ({
    book,
    onEdit,
    onDelete,
    onViewDetails,
    onToggleVisibility,
    user
}) => {
    return (
        <div className={`bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all duration-700 hover:shadow-lg hover:-translate-y-1 relative ${book.publicVisible === false ? 'opacity-60' : ''}`}>
            <div className="relative aspect-[3/4.5] overflow-hidden">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg ${STATUS_COLORS[book.status]}`}>
                        {book.status}
                    </span>
                    {user && (user.permissions.canHide === true || (user.permissions.canHide as any) === 1 || (user.permissions.canHide as any) === '1') && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleVisibility(book.id); }}
                            className={`p-1.5 rounded-lg backdrop-blur-md border border-white/20 shadow-lg transition-all ${book.publicVisible === false ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-900'}`}
                            title={book.publicVisible === false ? "مخفي عن الجمهور" : "مرئي للجمهور"}
                        >
                            {book.publicVisible === false ? <EyeOff size={10} /> : <Eye size={10} />}
                        </button>
                    )}
                </div>

                {/* Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                    <div className="flex gap-1.5">
                        {user && (user.permissions.canEdit === true || (user.permissions.canEdit as any) === 1 || (user.permissions.canEdit as any) === '1') && (
                            <button
                                onClick={() => onEdit(book)}
                                className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg text-[8px] font-black tracking-widest transition-all border border-white/20"
                            >
                                تعديل
                            </button>
                        )}
                        <button
                            onClick={() => onViewDetails(book)}
                            className="flex-1 py-1.5 bg-white text-slate-900 rounded-lg text-[8px] font-black tracking-widest transition-all shadow-xl hover:bg-slate-50"
                        >
                            تفاصيل
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-3 flex-1 flex flex-col bg-white">
                <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-slate-400 text-[7px] font-black uppercase tracking-widest">{book.category}</span>
                    </div>
                    <h3 className="text-[12px] font-black text-slate-900 leading-tight mb-0.5 line-clamp-2 min-h-[32px]">{book.title}</h3>
                    <p className="text-[9px] font-bold text-slate-400 truncate">{book.author}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-300">
                        <Clock size={10} />
                        <span className="text-[8px] font-black">{book.publicationYear}</span>
                    </div>
                    {user?.permissions.canDelete && (
                        <div className="flex items-center gap-1">
                            <button onClick={() => onDelete(book.id)} className="p-1 text-slate-200 hover:text-red-500 transition-all">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;
