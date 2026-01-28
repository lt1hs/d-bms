
import React from 'react';
import { Book, Category } from '../types';
import { CATEGORIES } from '../constants';
import {
    BookOpen,
    Layers,
    FileText,
    BarChart,
    Image as LucideImage,
    Leaf,
    ArrowLeftCircle,
    FileSearch,
    Clock
} from 'lucide-react';

interface CategoryTreeProps {
    books: Book[];
    onViewDetails: (book: Book) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    [Category.Books]: <BookOpen size={16} />,
    [Category.Booklets]: <Layers size={16} />,
    [Category.GuideMagazine]: <FileSearch size={16} />,
    [Category.AnnualReport]: <BarChart size={16} />,
    [Category.VisualReport]: <LucideImage size={16} />,
    [Category.NatureMagazine]: <Leaf size={16} />,
};

const ProTreeGroup: React.FC<{
    title: string;
    items: Book[];
    onViewDetails: (book: Book) => void,
    color: string,
    icon: React.ReactNode
}> = ({ title, items, onViewDetails, color, icon }) => {

    const colorClasses: Record<string, any> = {
        emerald: { bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', border: 'group-hover/tree:border-emerald-500', hoverBorder: 'hover:border-emerald-500/50', text: 'text-emerald-600', hoverText: 'group-hover/item:text-emerald-700', dot: 'bg-emerald-500', line: 'group-hover/item:bg-emerald-500/30' },
        blue: { bg: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'group-hover/tree:border-blue-500', hoverBorder: 'hover:border-blue-500/50', text: 'text-blue-600', hoverText: 'group-hover/item:text-blue-700', dot: 'bg-blue-500', line: 'group-hover/item:bg-blue-500/30' },
        orange: { bg: 'bg-orange-500', lightBg: 'bg-orange-50', border: 'group-hover/tree:border-orange-500', hoverBorder: 'hover:border-orange-500/50', text: 'text-orange-600', hoverText: 'group-hover/item:text-orange-700', dot: 'bg-orange-500', line: 'group-hover/item:bg-orange-500/30' },
        indigo: { bg: 'bg-indigo-500', lightBg: 'bg-indigo-50', border: 'group-hover/tree:border-indigo-500', hoverBorder: 'hover:border-indigo-500/50', text: 'text-indigo-600', hoverText: 'group-hover/item:text-indigo-700', dot: 'bg-indigo-500', line: 'group-hover/item:bg-indigo-500/30' },
        rose: { bg: 'bg-rose-500', lightBg: 'bg-rose-50', border: 'group-hover/tree:border-rose-500', hoverBorder: 'hover:border-rose-500/50', text: 'text-rose-600', hoverText: 'group-hover/item:text-rose-700', dot: 'bg-rose-500', line: 'group-hover/item:bg-rose-500/30' },
        teal: { bg: 'bg-teal-500', lightBg: 'bg-teal-50', border: 'group-hover/tree:border-teal-500', hoverBorder: 'hover:border-teal-500/50', text: 'text-teal-600', hoverText: 'group-hover/item:text-teal-700', dot: 'bg-teal-500', line: 'group-hover/item:bg-teal-500/30' },
        slate: { bg: 'bg-slate-500', lightBg: 'bg-slate-50', border: 'group-hover/tree:border-slate-500', hoverBorder: 'hover:border-slate-500/50', text: 'text-slate-600', hoverText: 'group-hover/item:text-slate-700', dot: 'bg-slate-500', line: 'group-hover/item:bg-slate-500/30' }
    };

    const cls = colorClasses[color] || colorClasses.slate;

    const getLabel = (book: Book) => {
        if (book.category === Category.AnnualReport) return `عام ${book.publicationYear}`;
        return book.title.length > 20 ? book.title.substring(0, 20) + '...' : book.title;
    };

    return (
        <div className="flex items-center justify-start gap-10 py-4 group/tree relative" dir="rtl">
            {/* Compact Category Trunk */}
            <div className="relative flex items-center h-full shrink-0">
                <div className={`
                    w-20 min-h-[160px] bg-white border-2 border-slate-900 rounded-xl 
                    flex flex-col items-center justify-center p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] 
                    ${cls.border} transition-all duration-500 relative overflow-hidden
                `}>
                    <div className={`mb-4 p-2.5 rounded-xl ${cls.lightBg} ${cls.text} relative z-10`}>
                        {icon}
                    </div>
                    <h3 className="[writing-mode:vertical-rl] font-black text-slate-900 text-[11px] tracking-widest leading-none relative z-10 text-center uppercase">
                        {title}
                    </h3>
                    <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 ${cls.bg} text-white rounded-md text-[8px] font-black opacity-0 group-hover/tree:opacity-100 transition-opacity`}>
                        {items.length}
                    </div>
                </div>
                <div className={`absolute -left-7 top-6 bottom-6 w-[2px] bg-slate-50 rounded-full`}></div>
            </div>

            {/* Compact Leaf Nodes */}
            <div className="flex flex-col gap-3 z-10 w-full max-w-[180px]">
                {items.map((book) => (
                    <div
                        key={book.id}
                        onClick={() => onViewDetails(book)}
                        className="group/item relative flex items-center justify-start"
                    >
                        <div className={`absolute left-full w-7 h-[2px] bg-slate-50 ${cls.line} transition-all -z-10`}></div>
                        <div className={`w-full pl-3 pr-2 py-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md ${cls.hoverBorder} hover:translate-x-1 transition-all cursor-pointer relative z-20 flex items-center gap-2`}>
                            <div className={`w-7 h-7 rounded-lg ${cls.lightBg} ${cls.text} flex items-center justify-center shrink-0`}>
                                <FileText size={12} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <span className="text-[10px] font-black text-slate-800 block truncate">{getLabel(book)}</span>
                                <span className="text-[8px] font-bold text-slate-400">{book.publicationYear}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryTree: React.FC<CategoryTreeProps> = ({ books, onViewDetails }) => {
    const categoryColors: Record<string, string> = {
        [Category.Books]: 'emerald', [Category.Booklets]: 'blue', [Category.GuideMagazine]: 'orange', [Category.AnnualReport]: 'indigo', [Category.VisualReport]: 'rose', [Category.NatureMagazine]: 'teal',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 p-6 bg-slate-50/20 rounded-xl border border-slate-100">
            {CATEGORIES.map((cat) => {
                const catBooks = books.filter(b => b.category === cat).slice(-5).reverse();
                if (catBooks.length === 0) return null;
                return (
                    <ProTreeGroup
                        key={cat} title={cat} items={catBooks}
                        onViewDetails={onViewDetails} color={categoryColors[cat] || 'slate'}
                        icon={CATEGORY_ICONS[cat] || <FileText size={16} />}
                    />
                );
            })}
        </div>
    );
};

export default CategoryTree;
