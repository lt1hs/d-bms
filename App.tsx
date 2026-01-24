
import React, { useState, useEffect, useMemo } from 'react';
import { Category, Book, ProcessStatus, PublicationType, PublicationSize } from './types';
import Layout from './components/Layout';
import BookForm from './components/BookForm';
import { STATUS_COLORS, CATEGORIES } from './constants';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Info,
  BookOpen,
  Layers,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Filter,
  ShieldCheck,
  X,
  ArrowUpRight,
  MoreVertical,
  Activity,
  Box
} from 'lucide-react';

const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    category: Category.Books,
    title: 'مبادئ البرمجة للمبتدئين',
    author: 'أحمد العلي',
    scientificReview: 'د. خالد المحمد',
    translation: 'سارة الحسن',
    linguisticCorrector: 'محمد العمري',
    investigation: '-',
    director: 'م. يوسف',
    coverDesigner: 'نور الهدى',
    publicationYear: '2023',
    edition: 'الأولى',
    type: PublicationType.Book,
    size: PublicationSize.Waziri,
    customSize: '',
    status: ProcessStatus.Printed,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    depositNumber: 'DEP-1234',
    isbn: '978-3-16-148410-0',
    pageCount: 350
  },
  {
    id: '2',
    category: Category.GuideMagazine,
    title: 'مجلة الدليل - العدد 45',
    author: 'هيئة التحرير',
    scientificReview: 'اللجنة الاستشارية',
    translation: '-',
    linguisticCorrector: 'أماني السعد',
    investigation: '-',
    director: 'سعيد الجود',
    coverDesigner: 'زياد الراوي',
    publicationYear: '2024',
    edition: '-',
    type: PublicationType.GuideMagazine,
    size: PublicationSize.Rahli,
    customSize: '',
    status: ProcessStatus.InPrinting,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    depositNumber: 'DEP-5678',
    isbn: 'ISSN-1234-5678',
    pageCount: 64
  }
];

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category | 'dashboard'>('dashboard');
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [viewingBook, setViewingBook] = useState<Book | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = useMemo(() => {
    let result = books;
    if (activeCategory !== 'dashboard') {
      result = result.filter(b => b.category === activeCategory);
    }
    if (searchQuery) {
      result = result.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [books, activeCategory, searchQuery]);

  const handleSaveBook = (data: Partial<Book>) => {
    if (editingBook) {
      setBooks(prev => prev.map(b => b.id === editingBook.id ? { ...b, ...data } as Book : b));
    } else {
      const newBook: Book = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      } as Book;
      setBooks(prev => [...prev, newBook]);
    }
    setIsFormOpen(false);
    setEditingBook(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإصدار؟')) {
      setBooks(prev => prev.filter(b => b.id !== id));
      if (viewingBook?.id === id) setViewingBook(undefined);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
    setViewingBook(undefined);
  };

  const handleViewDetails = (book: Book) => {
    setViewingBook(book);
  };

  const stats = [
    { label: 'إجمالي المطبوعات', value: books.length, trend: '+12%', color: 'emerald', icon: <BookOpen size={18} /> },
    { label: 'قيد التنفيذ الآن', value: books.filter(b => b.status === ProcessStatus.InProgress).length, trend: 'نشط', color: 'blue', icon: <Activity size={18} /> },
    { label: 'جاهز للاستلام', value: books.filter(b => b.status === ProcessStatus.Printed).length, trend: '85%', color: 'indigo', icon: <ShieldCheck size={18} /> },
    { label: 'في المطبعة', value: books.filter(b => b.status === ProcessStatus.InPrinting).length, trend: 'تحديث', color: 'orange', icon: <Clock size={18} /> },
  ];

  return (
    <>
      <Layout activeCategory={activeCategory} setActiveCategory={setActiveCategory}>
        <div className="p-4 md:p-8 space-y-8 animate-fadeIn">
          {activeCategory === 'dashboard' ? (
            <div className="space-y-10">
              {/* Header with Search and Actions */}
              <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex h-2 w-2 rounded-xl bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">نظام إدارة الأصول الفكرية</span>
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">نظرة عامة على البيانات</h1>
                  <p className="text-slate-500 text-sm mt-1 font-medium">مرحباً بك مجدداً. إليك ملخص حالة المطبوعات والإصدارات الحالية.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="بحث سريع..."
                      className="pr-11 pl-4 py-3 bg-white border border-slate-100 rounded-xl w-full sm:w-64 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all font-bold text-xs shadow-sm"
                    />
                  </div>
                  <button
                    onClick={() => { setEditingBook(undefined); setIsFormOpen(true); }}
                    className="flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 text-white rounded-xl font-black shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)] hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 text-xs whitespace-nowrap"
                  >
                    <Plus size={18} />
                    <span>إضافة إصدار</span>
                  </button>
                </div>
              </header>

              {/* Pro Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, i) => (
                  <div key={i} className="group bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50/30 rounded-xl -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

                    <div className="flex items-start justify-between relative z-10">
                      <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all duration-300`}>
                        {stat.icon}
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        <ArrowUpRight size={10} className="text-emerald-500" />
                        {stat.trend}
                      </div>
                    </div>

                    <div className="mt-6 relative z-10">
                      <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dashboard Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Category Distribution (Visual) */}
                <div className="lg:col-span-1 bg-white p-7 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Box size={18} className="text-emerald-500" />
                      توزيع الأقسام
                    </h2>
                    <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"><MoreVertical size={16} /></button>
                  </div>

                  <div className="space-y-5 flex-1">
                    {CATEGORIES.map((cat, idx) => {
                      const count = books.filter(b => b.category === cat).length;
                      const percentage = books.length > 0 ? (count / books.length) * 100 : 0;
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-700">{cat}</span>
                            <span className="text-slate-400">{count} إصدار</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-50 rounded-xl overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-xl transition-all duration-1000 ease-out"
                              style={{ width: `${Math.max(percentage, percentage > 0 ? 5 : 0)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                        <Info size={18} />
                      </div>
                      <div>
                        <p className="text-white text-xs font-black">نظام التخزين الرقمي</p>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Storage Usage: 42%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Updates Grid */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">أحدث الإصدارات المضافة</h2>
                    <button onClick={() => setActiveCategory(Category.Books)} className="text-[11px] font-black text-emerald-600 hover:underline uppercase tracking-widest">عرض كل الأرشيف</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {books.slice(-2).reverse().map(book => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>

                  {/* Compact List for secondary updates */}
                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                      <h3 className="text-sm font-black text-slate-900">تحديثات ثانوية</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {books.slice(0, 3).map((book, i) => (
                        <div key={i} onClick={() => handleViewDetails(book)} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <img src={book.image} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="" />
                            <div>
                              <p className="text-xs font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{book.title}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{book.category} • {book.publicationYear}</p>
                            </div>
                          </div>
                          <div className={`px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-tighter ${STATUS_COLORS[book.status]}`}>
                            {book.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 mb-1">{activeCategory}</h1>
                  <p className="text-slate-400 font-bold tracking-widest uppercase text-[11px]">Repository Management</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder={`البحث في ${activeCategory}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-12 pl-4 py-3 bg-white border border-slate-100 rounded-xl w-full md:w-80 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-bold placeholder:text-slate-300 shadow-sm text-xs"
                    />
                  </div>
                  <button
                    onClick={() => { setEditingBook(undefined); setIsFormOpen(true); }}
                    className="p-3.5 bg-slate-900 text-white rounded-xl hover:shadow-2xl transition-all active:scale-95 shadow-lg"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </header>

              {filteredBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border-2 border-dashed border-slate-100">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 mb-6">
                    <Filter size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">لا يوجد تطابق</h3>
                  <p className="text-slate-400 text-sm font-medium">حاول تغيير معايير البحث أو إضافة إصدار جديد.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                  {filteredBooks.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>

      {/* Detail Modal Overlay - Rendered outside Layout to stay on top of Sidebar */}
      {viewingBook && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl animate-fadeIn" onClick={() => setViewingBook(undefined)}>
          <div className="bg-white w-full max-w-5xl rounded-xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Left Panel: Cover & Key Roles */}
            <div className="md:w-[38%] bg-slate-50 p-8 flex flex-col items-center border-l border-slate-100 overflow-y-auto scrollbar-hide">
              <div className="w-full relative mb-8 group">
                <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-3xl opacity-20 scale-90 group-hover:scale-110 transition-transform"></div>
                <img src={viewingBook.image} className="w-full aspect-[3/4] object-cover rounded-xl shadow-2xl relative z-10" alt={viewingBook.title} />
                <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl z-20 border border-white/20 ${STATUS_COLORS[viewingBook.status]}`}>
                  {viewingBook.status}
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 text-center mb-2 leading-tight">{viewingBook.title}</h2>
              <p className="text-emerald-600 font-black text-xs tracking-[0.2em] mb-8 text-center uppercase">{viewingBook.author}</p>

              <div className="w-full space-y-2.5">
                <DetailItem label="المراجعة العلمية" value={viewingBook.scientificReview} />
                <DetailItem label="الترجمة" value={viewingBook.translation} />
                <DetailItem label="المقوم اللغوي" value={viewingBook.linguisticCorrector} />
                <DetailItem label="التحقيق" value={viewingBook.investigation} />
                <DetailItem label="المخرج الفني" value={viewingBook.director} />
                <DetailItem label="تصميم الغلاف" value={viewingBook.coverDesigner} />
                <DetailItem label="سنة النشر" value={viewingBook.publicationYear} />
                <DetailItem label="رقم الطبعة" value={viewingBook.edition} />
              </div>
            </div>

            {/* Right Panel: Technical Details */}
            <div className="flex-1 p-10 overflow-y-auto scrollbar-hide bg-white relative">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">المواصفات الفنية</h3>
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[9px] mt-1">Full Technical Specification Sheet</p>
                </div>
                <button onClick={() => setViewingBook(undefined)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                <TechnicalBox label="صنف الإصدار" value={viewingBook.type} icon={<Layers size={18} />} />
                <TechnicalBox label="مقاس القطع" value={viewingBook.size === PublicationSize.Custom ? `مخصص (${viewingBook.customSize})` : viewingBook.size} icon={<BookOpen size={18} />} />
                <TechnicalBox label="الحالة الحالية" value={viewingBook.status} icon={<Settings size={18} />} color={STATUS_COLORS[viewingBook.status].split(' ')[1]} />
                <TechnicalBox label="حجم الصفحات" value={`${viewingBook.pageCount} صفحة`} icon={<FileText size={18} />} />
                <TechnicalBox label="رقم الإيداع" value={viewingBook.depositNumber || 'غير محدد'} icon={<Info size={18} />} />
                <TechnicalBox label="الرقم المعياري (ISBN)" value={viewingBook.isbn || 'غير محدد'} icon={<Info size={18} />} />
              </div>

              <div className="mt-12 p-8 bg-slate-900 text-white rounded-xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-xl -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10">
                  <h4 className="font-black text-base mb-3 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-xl shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                    مذكرة التدقيق
                  </h4>
                  <p className="text-slate-400 text-xs leading-[1.8] font-medium opacity-90 max-w-md">
                    هذا الإصدار معتمد ومسجل ضمن قاعدة بيانات منصة الدليل. تم التحقق من المراجعات اللغوية والعلمية. يرجى التقيّد بالمعايير الفنية الموضحة أعلاه عند الطباعة.
                  </p>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-end gap-4">
                <button onClick={() => { setViewingBook(undefined); handleEdit(viewingBook); }} className="px-7 py-3.5 text-slate-900 font-black text-xs border border-slate-100 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Edit2 size={14} />
                  تعديل السجل
                </button>
                <button onClick={() => setViewingBook(undefined)} className="px-8 py-3.5 bg-slate-900 text-white font-black text-xs rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">إغلاق النافذة</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form - Rendered outside Layout */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] scrollbar-hide">
            <BookForm
              book={editingBook}
              onSave={handleSaveBook}
              onCancel={() => setIsFormOpen(false)}
              initialCategory={activeCategory === 'dashboard' ? Category.Books : activeCategory}
            />
          </div>
        </div>
      )}
    </>
  );
};

const BookCard: React.FC<{ book: Book; onEdit: (b: Book) => void; onDelete: (id: string) => void; onViewDetails: (b: Book) => void }> = ({ book, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-50 shadow-sm overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-2xl hover:translate-y-[-6px] relative">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.1em] backdrop-blur-md border border-white/20 shadow-xl ${STATUS_COLORS[book.status]}`}>
            {book.status}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-6 backdrop-blur-[2px]">
          <div className="flex gap-2 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            <button
              onClick={() => onEdit(book)}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-xl text-[10px] font-black tracking-widest transition-all border border-white/10"
            >
              تعديل
            </button>
            <button
              onClick={() => onViewDetails(book)}
              className="flex-1 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black tracking-widest transition-all shadow-xl"
            >
              التفاصيل
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col bg-white">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-xl border border-slate-100">{book.category}</span>
          </div>
          <h3 className="text-base font-black text-slate-900 leading-[1.4] mb-2 line-clamp-2">{book.title}</h3>
          <p className="text-[11px] font-bold text-slate-400">{book.author}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock size={12} />
            <span className="text-[10px] font-black">{book.publicationYear}</span>
          </div>
          <button onClick={() => onDelete(book.id)} className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-slate-100/60 py-2.5 w-full">
    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{label}</span>
    <span className="text-[12px] text-slate-700 font-bold text-left">{value || '—'}</span>
  </div>
);

const TechnicalBox: React.FC<{ label: string; value: string; icon: React.ReactNode; color?: string }> = ({ label, value, icon, color }) => (
  <div className="flex items-center gap-4 group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border border-transparent group-hover:border-slate-100 ${color ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
      {icon}
    </div>
    <div>
      <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className={`text-base font-black ${color ? color : 'text-slate-900'} tracking-tight`}>{value}</p>
    </div>
  </div>
);

export default App;
