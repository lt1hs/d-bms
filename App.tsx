
import React, { useState, useEffect, useMemo } from 'react';
import { Category, Book, ProcessStatus, PublicationType, PublicationSize, User, UserRole } from './types';
import Layout from './components/Layout';
import BookForm from './components/BookForm';
import Login from './components/Login';
import { STATUS_COLORS, CATEGORIES } from './constants';
import CategoryTree from './components/CategoryTree';
import { bookService } from './services/bookService';
import { authService } from './services/authService';
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
  Box,
  Upload,
  File as LucideFile,
  StickyNote,
  BarChart,
  Image as LucideImage,
  Leaf,
  FileSearch,
  LayoutGrid,
  List,
  Eye,
  EyeOff,
  Users,
  LogOut,
  UserPlus
} from 'lucide-react';

const DEFAULT_USERS: User[] = [];

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
  const [activeCategory, setActiveCategory] = useState<Category | 'dashboard' | 'search' | 'users' | 'settings'>('dashboard');
  const [settingsTab, setSettingsTab] = useState<'users' | 'branding' | 'backup'>('users');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const data = await bookService.getAll();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
        // Fallback to localStorage if API fails (optional)
        const saved = localStorage.getItem('d-bms-books');
        if (saved) setBooks(JSON.parse(saved));
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('d-bms-auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [viewingBook, setViewingBook] = useState<Book | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [repositoryViewMode, setRepositoryViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ProcessStatus | 'all'>('all');
  const [searchField, setSearchField] = useState<'all' | 'title' | 'author' | 'director' | 'isbn' | 'year'>('all');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('d-bms-auth', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('d-bms-auth');
    }
  }, [currentUser]);

  // Hidden Login Trigger (Ctrl+Shift+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        setIsLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle routing via query params (New Tab Support)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('bookId');
    if (bookId) {
      const book = books.find(b => b.id === bookId);
      if (book) setViewingBook(book);
    }
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = books;

    // Security Filter: Public users only see books where publicVisible is true (default is true for existing ones in this mock)
    if (!currentUser) {
      result = result.filter(b => b.publicVisible !== false);
    }

    // Category Filter
    if (activeCategory !== 'dashboard' && activeCategory !== 'search' && activeCategory !== 'users') {
      result = result.filter(b => b.category === activeCategory);
    }

    // Status Filter
    if (filterStatus !== 'all') {
      result = result.filter(b => b.status === filterStatus);
    }

    // Search Query Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => {
        const title = (b.title || '').toLowerCase();
        const author = (b.author || '').toLowerCase();
        const director = (b.director || '').toLowerCase();
        const isbn = (b.isbn || '').toLowerCase();
        const year = (b.publicationYear || '').toLowerCase();

        if (searchField === 'title') return title.includes(q);
        if (searchField === 'author') return author.includes(q);
        if (searchField === 'director') return director.includes(q);
        if (searchField === 'isbn') return isbn.includes(q);
        if (searchField === 'year') return year.includes(q);

        // Search all fields (default)
        return (
          title.includes(q) ||
          author.includes(q) ||
          director.includes(q) ||
          isbn.includes(q) ||
          year.includes(q)
        );
      });
    }

    return result;
  }, [books, activeCategory, searchQuery, filterStatus, searchField, currentUser]);

  const handleLogin = async (u: string, p: string) => {
    try {
      const { user, token } = await authService.login(u, p);
      localStorage.setItem('d-bms-token', token);
      setCurrentUser(user);
      setIsLoginOpen(false);
      setLoginError('');
      setActiveCategory('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('d-bms-token');
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('d-bms-token');
      setCurrentUser(null);
      setActiveCategory('dashboard');
    }
  };

  // Helper to check permission safely
  const hasPermission = (user: User | null, perm: keyof typeof user.permissions) => {
    if (!user || !user.permissions) return false;
    const val = user.permissions[perm] as any;
    return val === true || val === 1 || val === '1';
  };

  const handleToggleVisibility = async (bookId: string) => {
    if (!hasPermission(currentUser, 'canHide')) return;
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    try {
      const updatedBook = await bookService.update(bookId, { publicVisible: !book.publicVisible });
      setBooks(prev => prev.map(b => b.id === bookId ? updatedBook : b));
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      alert('حدث خطأ أثناء تحديث الحالة');
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveBook = async (data: Partial<Book>) => {
    try {
      setIsSaving(true);
      if (editingBook) {
        const updatedBook = await bookService.update(editingBook.id, data);
        setBooks(prev => prev.map(b => b.id === editingBook.id ? updatedBook : b));
      } else {
        const newBook = await bookService.create({
          ...data,
          publicVisible: true
        });
        setBooks(prev => [...prev, newBook]);
      }
      setIsFormOpen(false);
      setEditingBook(undefined);
    } catch (error) {
      console.error('Failed to save book:', error);
      alert('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsSaving(false);
    }
  };

  const [newUser, setNewUser] = useState<Partial<User>>({
    username: '',
    password: '',
    role: UserRole.ADMIN,
    permissions: { canAdd: true, canEdit: true, canDelete: false, canHide: true }
  });

  // Fetch users from API
  const fetchUsers = async () => {
    if (currentUser?.role === UserRole.SUPER_ADMIN) {
      try {
        const token = localStorage.getItem('d-bms-token');
        if (token) {
          const fetchedUsers = await authService.getAllUsers(token);
          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role !== UserRole.SUPER_ADMIN) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem('d-bms-token');
      if (token) {
        const createdUser = await authService.createUser(token, newUser);
        setUsers([...users, createdUser]);
        setNewUser({
          username: '',
          password: '',
          role: UserRole.ADMIN,
          permissions: { canAdd: true, canEdit: true, canDelete: false, canHide: true }
        });
        alert('تم إنشاء الحساب بنجاح');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveUser = async (id: string) => {
    if (currentUser?.role !== UserRole.SUPER_ADMIN) return;
    if (id === currentUser.id) return;

    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        const token = localStorage.getItem('d-bms-token');
        if (token) {
          await authService.deleteUser(token, id);
          setUsers(prev => prev.filter(u => u.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('حدث خطأ أثناء حذف المستخدم');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإصدار؟')) {
      try {
        await bookService.delete(id);
        setBooks(prev => prev.filter(b => b.id !== id));
        if (viewingBook?.id === id) setViewingBook(undefined);
      } catch (error) {
        console.error('Failed to delete book:', error);
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
    setViewingBook(undefined);
  };

  const handleViewDetails = (book: Book) => {
    const url = new URL(window.location.href);
    url.searchParams.set('bookId', book.id);
    window.open(url.toString(), '_blank');
  };

  const stats = [
    { label: 'إجمالي المطبوعات', value: filteredBooks.length, trend: '+12%', color: 'emerald', icon: <BookOpen size={18} /> },
    { label: 'قيد التنفيذ الآن', value: filteredBooks.filter(b => b.status === ProcessStatus.InProgress).length, trend: 'نشط', color: 'blue', icon: <Activity size={18} /> },
    { label: 'جاهز للاستلام', value: filteredBooks.filter(b => b.status === ProcessStatus.Printed).length, trend: '85%', color: 'indigo', icon: <ShieldCheck size={18} /> },
    { label: 'في المطبعة', value: filteredBooks.filter(b => b.status === ProcessStatus.InPrinting).length, trend: 'تحديث', color: 'orange', icon: <Clock size={18} /> },
  ];

  return (
    <>
      <Layout
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        user={currentUser}
        onLogout={handleLogout}
        onTriggerLogin={() => setIsLoginOpen(true)}
      >
        <div className="p-4 md:p-6 space-y-6 animate-fadeIn">
          {isLoading && activeCategory === 'dashboard' ? (
            <div className="flex flex-col items-center justify-center py-40 animate-pulse">
              <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">جاري تحميل البيانات...</p>
            </div>
          ) : activeCategory === 'dashboard' ? (
            <div className="space-y-8">
              {/* Ultra-Compact Dashboard Header */}
              <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">System Intelligence Dashboard</span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">نظرة عامة على البيانات</h1>
                </div>
                <div className="flex items-center gap-2">
                  {hasPermission(currentUser, 'canAdd') && (
                    <button
                      onClick={() => { setEditingBook(undefined); setIsFormOpen(true); }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-black shadow-md hover:shadow-lg transition-all active:scale-95 text-[10px]"
                    >
                      <Plus size={12} />
                      <span>إضافة إصدار</span>
                    </button>
                  )}
                </div>
              </header>

              {/* Compressed Analytics Section */}
              <div className={`bg-white ${isCompactMode ? 'p-2 rounded-lg' : 'p-5 rounded-xl'} border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.02)] ${isCompactMode ? 'space-y-2' : 'space-y-6'}`}>
                <div className={isCompactMode ? 'space-y-2' : 'space-y-4'}>
                  <div className="flex items-center justify-between px-1">
                    <h2 className={`${isCompactMode ? 'text-[9px]' : 'text-sm'} font-black text-slate-900 flex items-center gap-1.5`}>
                      <TrendingUp size={isCompactMode ? 10 : 14} className="text-slate-400" />
                      تحليل البيانات
                    </h2>

                    <div className="flex items-center gap-1.5">
                      <div className={`flex items-center gap-1 ${isCompactMode ? 'px-1 py-0.5 bg-slate-50' : 'px-2 py-1 bg-emerald-50'} rounded border border-slate-100 transition-all`}>
                        <ShieldCheck size={isCompactMode ? 8 : 12} className="text-emerald-500" />
                        <span className={`${isCompactMode ? 'text-[6px]' : 'text-[8px]'} font-black text-slate-400 uppercase tracking-tighter`}>94.2%</span>
                      </div>

                      <button
                        onClick={() => setIsCompactMode(!isCompactMode)}
                        className={`rounded-md transition-all ${isCompactMode ? 'p-1 bg-slate-900 text-white border-slate-900' : 'p-1.5 bg-white text-slate-400 border-slate-100 hover:bg-slate-50'} border`}
                      >
                        {isCompactMode ? <LayoutGrid size={10} /> : <List size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className={`grid ${isCompactMode ? 'grid-cols-4 gap-1' : 'grid-cols-2 md:grid-cols-4 gap-3'}`}>
                    {stats.map((stat, i) => (
                      <div key={i} className={`${isCompactMode ? 'p-1.5' : 'p-3.5'} ${isCompactMode ? 'rounded-md' : 'rounded-lg'} border border-slate-50 bg-slate-50/20 group/stat hover:bg-white hover:border-slate-100 transition-all duration-300`}>
                        <div className={`flex items-start justify-between ${isCompactMode ? 'mb-0.5' : 'mb-4'}`}>
                          <div className={`${isCompactMode ? 'p-1' : 'p-2'} rounded bg-white border border-slate-100 shadow-sm transition-transform group-hover/stat:rotate-3`}>
                            {React.cloneElement(stat.icon as React.ReactElement, { size: isCompactMode ? 10 : 14, className: `text-${stat.color}-500` })}
                          </div>
                          {!isCompactMode && <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">{stat.trend}</span>}
                        </div>
                        <div>
                          <p className={`${isCompactMode ? 'text-xs' : 'text-2xl'} font-black text-slate-900 leading-none mb-0.5`}>{stat.value}</p>
                          <p className={`${isCompactMode ? 'text-[6px]' : 'text-[9px]'} font-bold text-slate-400 uppercase tracking-widest truncate`}>{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100/30 mx-1" />

                <div className={isCompactMode ? 'space-y-2' : 'space-y-4'}>
                  <h3 className={`${isCompactMode ? 'text-[7px]' : 'text-[10px]'} font-black text-slate-900 px-1 uppercase tracking-widest`}>توزيع الأقسام والمؤشرات</h3>
                  <div className={`grid ${isCompactMode ? 'grid-cols-3 md:grid-cols-6 gap-1.5' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3'}`}>
                    {(() => {
                      const categoryThemes: Record<string, { color: string, icon: React.ReactNode }> = {
                        [Category.Books]: { color: 'emerald', icon: <BookOpen size={isCompactMode ? 10 : 14} /> },
                        [Category.Booklets]: { color: 'blue', icon: <Layers size={isCompactMode ? 10 : 14} /> },
                        [Category.GuideMagazine]: { color: 'orange', icon: <FileSearch size={isCompactMode ? 10 : 14} /> },
                        [Category.AnnualReport]: { color: 'indigo', icon: <BarChart size={10} /> },
                        [Category.VisualReport]: { color: 'rose', icon: <LucideImage size={10} /> },
                        [Category.NatureMagazine]: { color: 'teal', icon: <Leaf size={10} /> },
                      };

                      return CATEGORIES.map((cat, idx) => {
                        const count = filteredBooks.filter(b => b.category === cat).length;
                        const totalInCat = books.filter(b => b.category === cat).length;
                        const percentage = searchQuery
                          ? (totalInCat > 0 ? (count / totalInCat) * 100 : 0)
                          : (books.length > 0 ? (totalInCat / books.length) * 100 : 0);
                        const theme = categoryThemes[cat] || { color: 'slate', icon: <FileText size={isCompactMode ? 12 : 14} /> };
                        const colorCls: any = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', orange: 'bg-orange-500', indigo: 'bg-indigo-500', rose: 'bg-rose-500', teal: 'bg-teal-500', slate: 'bg-slate-500' };
                        const textCls: any = { emerald: 'text-emerald-600', blue: 'text-blue-600', orange: 'text-orange-600', indigo: 'text-indigo-600', rose: 'text-rose-600', teal: 'text-teal-600', slate: 'text-slate-600' };

                        if (count === 0 && searchQuery) return null;

                        if (isCompactMode) {
                          return (
                            <div key={idx} className="p-1 bg-white border border-slate-50 rounded-md flex items-center gap-1.5 hover:border-slate-200 transition-all group/card">
                              <div className={`w-5 h-5 rounded bg-slate-50 flex items-center justify-center shrink-0 ${textCls[theme.color]}`}>{theme.icon}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <h4 className="text-[7px] font-black text-slate-800 truncate">{cat}</h4>
                                  <span className="text-[6px] font-black text-slate-300">{count}</span>
                                </div>
                                <div className="h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${colorCls[theme.color]} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={idx} className="p-3 bg-white border border-slate-50 rounded-xl hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                              <div className={`p-1.5 rounded-lg bg-slate-50 ${textCls[theme.color]}`}>{theme.icon}</div>
                              <span className={`text-[9px] font-black ${textCls[theme.color]}`}>{Math.round(percentage)}%</span>
                            </div>
                            <h4 className="text-[10px] font-black text-slate-800 truncate mb-0.5">{cat}</h4>
                            <p className="text-[8px] font-bold text-slate-400 mb-2">{count} سـجل</p>
                            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                              <div className={`h-full ${colorCls[theme.color]} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* Functional View Section */}
              <div className="space-y-4">
                <div className="px-1">
                  <h2 className="text-lg font-black text-slate-900 leading-tight">هيكل الأرشيف</h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Categorical Relationship Map</p>
                </div>
                <CategoryTree books={filteredBooks} onViewDetails={handleViewDetails} />
              </div>
            </div>
          ) : activeCategory === 'settings' && currentUser?.role === UserRole.SUPER_ADMIN ? (
            <div className="space-y-8 animate-fadeIn">
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">إعدادات النظام المتقدمة</h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Super Admin Pro Console • v2.1.0</p>
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-slate-100/50 rounded-xl border border-slate-100">
                  {[
                    { id: 'users', label: 'المستخدمين', icon: <Users size={14} /> },
                    { id: 'branding', label: 'الهوية', icon: <LucideImage size={14} /> },
                    { id: 'backup', label: 'النسخ الاحتياطي', icon: <Settings size={14} /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSettingsTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${settingsTab === tab.id ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </header>

              {settingsTab === 'users' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Form to add users */}
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <UserPlus size={18} className="text-emerald-500" />
                      <h3 className="text-sm font-black text-slate-900">إضافة حساب إداري جديد</h3>
                    </div>
                    <form onSubmit={handleAddUser} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">اسم المستخدم</label>
                        <input
                          type="text"
                          required
                          value={newUser.username}
                          onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">كلمة المرور</label>
                        <input
                          type="password"
                          required
                          value={newUser.password}
                          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الصلاحيات المخصصة</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                            <input type="checkbox" checked={newUser.permissions?.canAdd} onChange={e => setNewUser({ ...newUser, permissions: { ...newUser.permissions!, canAdd: e.target.checked } })} />
                            <span className="text-[9px] font-black">إضافة</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                            <input type="checkbox" checked={newUser.permissions?.canEdit} onChange={e => setNewUser({ ...newUser, permissions: { ...newUser.permissions!, canEdit: e.target.checked } })} />
                            <span className="text-[9px] font-black">تعديل</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                            <input type="checkbox" checked={newUser.permissions?.canDelete} onChange={e => setNewUser({ ...newUser, permissions: { ...newUser.permissions!, canDelete: e.target.checked } })} />
                            <span className="text-[9px] font-black">حذف</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                            <input type="checkbox" checked={newUser.permissions?.canHide} onChange={e => setNewUser({ ...newUser, permissions: { ...newUser.permissions!, canHide: e.target.checked } })} />
                            <span className="text-[9px] font-black">إخفاء/إظهار</span>
                          </label>
                        </div>
                      </div>
                      <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 transition-all">
                        حفظ وإنشاء الحساب
                      </button>
                    </form>
                  </div>

                  {/* Users List */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="px-1 flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900">الحسابات النشطة ({users.length})</h3>
                      <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black">SECURITY SYNC: ON</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {users.map(u => (
                        <div key={u.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${u.role === UserRole.SUPER_ADMIN ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                              {u.role === UserRole.SUPER_ADMIN ? <ShieldCheck size={20} /> : <Users size={20} />}
                            </div>
                            <div>
                              <h4 className="text-[13px] font-black text-slate-900">{u.username}</h4>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{u.role === UserRole.SUPER_ADMIN ? 'System Owner' : 'Regional Admin'}</p>
                            </div>
                          </div>
                          {u.role !== UserRole.SUPER_ADMIN && (
                            <button
                              onClick={() => handleRemoveUser(u.id)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : settingsTab === 'branding' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                  <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><LucideImage size={20} /></div>
                      <h3 className="text-base font-black text-slate-900">هوية المؤسسة والشعار</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-10 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4"><Upload size={24} /></div>
                        <p className="text-xs font-black text-slate-500">رفع شعار جديد للهوية</p>
                        <p className="text-[9px] text-slate-300 mt-1 uppercase font-bold">Recommended: SVG or PNG (Transparent)</p>
                      </div>
                      <div className="space-y-1.5 pt-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase">اسم المنصة الرسمي</label>
                        <input type="text" defaultValue="منصة أرشيف الدليل" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-slate-900" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm space-y-6 opacity-60 grayscale cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Activity size={20} /></div>
                      <h3 className="text-base font-black text-slate-900">التخصيص البصري (كامن)</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-500">الوضع الليلي التلقائي</span>
                        <div className="w-10 h-5 bg-slate-200 rounded-full relative"><div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"></div></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-500">تأثيرات البانوراما</span>
                        <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full shadow-sm"></div></div>
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Developer Note</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1">This module is part of the next scheduled system update. Visual overrides are currently locked by global stylesheet.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 p-12 rounded-2xl relative overflow-hidden shadow-2xl animate-fadeIn">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                  <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
                    <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-900 mx-auto shadow-[0_0_50px_rgba(16,185,129,0.3)]"><Settings size={40} className="animate-spin-slow" /></div>
                    <h2 className="text-3xl font-black text-white tracking-tight">مركز حماية ونسخ البيانات</h2>
                    <p className="text-slate-400 font-medium leading-[1.8]">يمكنك هنا تصدير قاعدة البيانات بالكامل أو استعادتها من نقطة زمنية سابقة. جميع البيانات مشفرة وتخضع لبروتوكول الأمان العالي.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                      <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-xl font-black text-xs shadow-xl hover:-translate-y-1 transition-all">تصدير النسخة الاحتياطية (.SQL)</button>
                      <button className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-slate-900 rounded-xl font-black text-xs shadow-xl hover:-translate-y-1 transition-all">مزامنة البيانات السحابية</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeCategory === 'search' ? (
            <div className="space-y-6 py-4 animate-fadeIn">
              {/* Search Hero Section */}
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Search size={20} />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">قاعدة البيانات الرقمية</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px]">Unified Search Command Center</p>
                  </div>
                </div>

                <div className="relative group">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                  <input
                    type="text"
                    autoFocus
                    placeholder={(() => {
                      const fieldLabels: any = { all: 'الكل', title: 'العنوان', author: 'المؤلف', director: 'المخرج', isbn: 'الرقم الإيداعي', year: 'السنة' };
                      return `ابحث بواسطة ${fieldLabels[searchField]}...`;
                    })()}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-12 pl-10 py-3.5 bg-white border border-slate-100 rounded-xl text-sm font-black shadow-xl focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg transition-all"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Integration Filters */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                        نطاق البحث التخصصي
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'all', label: 'البحث الشامل' },
                          { id: 'title', label: 'العنوان' },
                          { id: 'author', label: 'المؤلف' },
                          { id: 'director', label: 'المخرج' },
                          { id: 'isbn', label: 'ISBN' },
                          { id: 'year', label: 'السنة' },
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setSearchField(f.id as any)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${searchField === f.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                        حالة الإنتاج
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setFilterStatus('all')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${filterStatus === 'all' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}
                        >
                          الكل
                        </button>
                        {Object.values(ProcessStatus).map(s => (
                          <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${filterStatus === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black">
                      {filteredBooks.length}
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">نتائج البحث المباشرة</h3>
                  </div>

                  <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setRepositoryViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-all ${repositoryViewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <LayoutGrid size={14} />
                    </button>
                    <button
                      onClick={() => setRepositoryViewMode('list')}
                      className={`p-1.5 rounded-lg transition-all ${repositoryViewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <List size={14} />
                    </button>
                  </div>
                </div>

                {filteredBooks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                      <Search size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">لا توجد نتائج مطابقة</h3>
                    <p className="text-slate-400 font-bold text-xs">قم بتعديل مصطلحات البحث أو تغيير نطاق البحث من الخيارات أعلاه.</p>
                  </div>
                ) : repositoryViewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {filteredBooks.map(book => (
                      <BookCard
                        key={book.id}
                        book={book}
                        user={currentUser}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                        onToggleVisibility={handleToggleVisibility}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBooks.map(book => (
                      <BookRow
                        key={book.id}
                        book={book}
                        user={currentUser}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                        onToggleVisibility={handleToggleVisibility}
                      />
                    ))}
                  </div>
                )
                }</div>
            </div>
          ) : (
            <div className="space-y-6">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-slate-900 rounded-full hidden md:block" />
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 mb-0.5 tracking-tight">{activeCategory}</h1>
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-[9px]">Administrative Repository Management</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button
                      onClick={() => setRepositoryViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-all ${repositoryViewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <LayoutGrid size={14} />
                    </button>
                    <button
                      onClick={() => setRepositoryViewMode('list')}
                      className={`p-1.5 rounded-lg transition-all ${repositoryViewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <List size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => { setEditingBook(undefined); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 text-[10px]"
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">إضافة جديد</span>
                  </button>
                </div>
              </header>

              {/* Repository Empty State or Advanced Filters (Note: filters moved to dedicated page mostly, keeping optional here for cleanup) */}
              {showFilters && activeCategory !== 'search' && (
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xl animate-fadeIn space-y-4">
                  {/* ... logic continues but we'll focus on search page implementation below ... */}
                </div>
              )}

              {filteredBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-100">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                    <Filter size={32} />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-1">لا توجد سجلات مطابقة</h3>
                  <p className="text-slate-400 text-xs font-medium">حاول تعديل معايير البحث أو إضافة إصدار جديد لهذا القسم.</p>
                </div>
              ) : repositoryViewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {filteredBooks.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      user={currentUser}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewDetails={handleViewDetails}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBooks.map(book => (
                    <BookRow
                      key={book.id}
                      book={book}
                      user={currentUser}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewDetails={handleViewDetails}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>

      {/* Detail Modal Overlay */}
      {
        viewingBook && (
          <div className="fixed inset-0 z-[200] bg-white animate-fadeIn flex flex-col overflow-hidden">
            {/* Top Bar Navigation */}
            <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30">
              <button
                onClick={() => setViewingBook(undefined)}
                className="flex items-center gap-3 text-slate-900 hover:text-emerald-600 transition-all font-black text-xs uppercase tracking-widest group"
              >
                <div className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                  <ChevronRight size={20} />
                </div>
                العودة للمكتبة
              </button>

              {currentUser && (
                <div className="flex items-center gap-4">
                  {hasPermission(currentUser, 'canEdit') && (
                    <button
                      onClick={() => { handleEdit(viewingBook); setViewingBook(undefined); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-900 rounded-xl font-black text-[10px] uppercase hover:bg-slate-100 transition-all"
                    >
                      <Edit2 size={14} />
                      تعديل السجل
                    </button>
                  )}
                  {hasPermission(currentUser, 'canDelete') && (
                    <button
                      onClick={() => handleDelete(viewingBook.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={14} />
                      حذف
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Panel: Cover & Key Roles */}
              <div className="md:w-[35%] bg-slate-50/50 p-12 flex flex-col items-center border-l border-slate-100 overflow-y-auto scrollbar-hide">
                <div className="w-full max-w-sm relative mb-12 group">
                  <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-[60px] opacity-20 scale-90 group-hover:scale-110 transition-transform duration-700"></div>
                  <img src={viewingBook.image} className="w-full aspect-[3/4] object-cover rounded-xl shadow-[0_32px_64px_-16px_rgba(15,23,42,0.2)] relative z-10 border border-white" alt={viewingBook.title} />
                  <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl z-20 border border-white/40 ${STATUS_COLORS[viewingBook.status]}`}>
                    {viewingBook.status}
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-3 leading-tight tracking-tight">{viewingBook.title}</h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <p className="text-emerald-700 font-black text-[10px] tracking-widest uppercase">{viewingBook.author}</p>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <div className="px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm space-y-1">
                    <DetailItem label="المراجعة العلمية" value={viewingBook.scientificReview} />
                    <DetailItem label="الترجمة" value={viewingBook.translation} />
                    <DetailItem label="سنة النشر" value={viewingBook.publicationYear} />
                    {currentUser && (
                      <>
                        <DetailItem label="المقوم اللغوي" value={viewingBook.linguisticCorrector} />
                        <DetailItem label="التحقيق" value={viewingBook.investigation} />
                        <DetailItem label="المخرج الفني" value={viewingBook.director} />
                        <DetailItem label="تصميم الغلاف" value={viewingBook.coverDesigner} />
                        <DetailItem label="رقم الطبعة" value={viewingBook.edition} />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel: Technical Details */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto scrollbar-hide bg-white">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-10">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">المواصفات الفنية</h3>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">{currentUser ? 'Technical Specification Sheet' : 'Public Information'}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                    <TechnicalBox label="صنف الإصدار" value={viewingBook.type} icon={<Layers size={22} />} />
                    <TechnicalBox label="مقاس القطع" value={viewingBook.size === PublicationSize.Custom ? `مخصص (${viewingBook.customSize})` : viewingBook.size} icon={<BookOpen size={22} />} />
                    {currentUser && (
                      <>
                        <TechnicalBox label="الحالة الحالية" value={viewingBook.status} icon={<Settings size={22} />} color={STATUS_COLORS[viewingBook.status].split(' ')[1]} />
                        <TechnicalBox label="حجم الصفحات" value={`${viewingBook.pageCount} صفحة`} icon={<FileText size={22} />} />
                        <TechnicalBox label="رقم الإيداع" value={viewingBook.depositNumber || 'غير محدد'} icon={<Info size={22} />} />
                        <TechnicalBox label="الرقم المعياري (ISBN)" value={viewingBook.isbn || 'غير محدد'} icon={<Info size={22} />} />
                      </>
                    )}
                    {!currentUser && (
                      <TechnicalBox label="تاريخ النشر" value={viewingBook.publicationYear} icon={<Clock size={22} />} />
                    )}
                  </div>

                  {/* Production Lifecycle Section - ADMIN ONLY */}
                  {currentUser && (
                    <div className="mt-12">
                      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-3">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">دورة الإنتاج والملفات</h3>
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">Lifecycle</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                        <div className="space-y-4">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest border-r-2 border-emerald-500 pr-2">المواعيد</p>
                          <div className="space-y-3">
                            <DateInfo label="الاستلام من البحوث" date={viewingBook.receivedFromResearchDate} />
                            <DateInfo label="المصادقة على العنوان" date={viewingBook.titleApprovalDate} imageUrl={viewingBook.titleApprovalImage} />
                            <DateInfo label="طلب رقم الإيداع" date={viewingBook.depositRequestDate} />
                            <DateInfo label="استلام رقم الإيداع" date={viewingBook.depositReceiveDate} />
                            <DateInfo label="استمارة الصرف" date={viewingBook.disbursementFormDate} imageUrl={viewingBook.disbursementFormImage} color="text-emerald-600" />
                          </div>
                        </div>

                        <div className="space-y-6">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-r-2 border-blue-500 pr-3">إدارة الملفات</p>
                          <div className="bg-slate-50 p-6 rounded-xl space-y-5">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 mb-3 uppercase">ملفات الغلاف</p>
                              <div className="flex flex-col gap-2 font-bold">
                                <FileBadge url={viewingBook.coverEditableUrl} label="النسخة القابلة للتحرير (PSD)" />
                                <FileBadge url={viewingBook.coverViewableUrl} label="نسخة للمشاهدة" />
                                <FileBadge url={viewingBook.coverPrintableUrl} label="نسخة المطبعة" />
                                <FileBadge url={viewingBook.coverSignatureUrl} label="توقيع الرئاسة" />
                              </div>
                            </div>
                            <div className="pt-4 border-t border-slate-200/50">
                              <p className="text-[9px] font-black text-slate-400 mb-3 uppercase">ملفات المتن</p>
                              <div className="flex flex-col gap-2 font-bold">
                                <FileBadge url={viewingBook.bodyEditableUrl} label="المتن القابل للتحرير" />
                                <FileBadge url={viewingBook.bodyPdfUrl} label="ملف المتن النهائي PDF" />
                                <FileBadge url={viewingBook.bodyWatermarkUrl} label="نسخة العلامة المائية" />
                                <FileBadge url={viewingBook.bodySignaturesUrl} label="استمارة التوقيعات" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-r-2 border-slate-900 pr-3">التنفيذ والطباعة</p>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">المطبعة المعتمدة</p>
                                <p className="text-xs font-black text-slate-900">{viewingBook.printingHouse || 'لم تُحدد'}</p>
                              </div>
                              <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black">
                                {viewingBook.printQuantity || '0'} نسخة
                              </div>
                            </div>
                            <DateInfo label="الإرسال للطبعة الرقمية" date={viewingBook.digitalPrintDate} />
                            <DateInfo label="الإرسال للأوفسيت" date={viewingBook.offsetPrintDate} />
                            <DateInfo label="تأييد الغلاف" date={viewingBook.coverEndorsementDate} />
                            <DateInfo label="الاستلام النهائي" date={viewingBook.receiveFromPrintDate} color="text-blue-600" />
                          </div>
                        </div>
                      </div>

                      {/* Workflow Analysis Section */}
                      <div className="bg-slate-50 p-8 rounded-xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <WorkflowStep
                          label="مرحلة الإخراج الفني"
                          sender="المرسل للإخراج"
                          sentDate={viewingBook.sentToDirectorDate}
                          receivedDate={viewingBook.receivedFromDirectorDate}
                          icon={<Activity size={20} />}
                          color="blue"
                        />
                        <WorkflowStep
                          label="مرحلة التصميم والابتكار"
                          sender="المرسل للتصميم"
                          sentDate={viewingBook.sentToDesignerDate}
                          receivedDate={viewingBook.receivedFromDesignerDate}
                          icon={<Box size={20} />}
                          color="emerald"
                        />
                      </div>

                      {/* Notes Section for Admin */}
                      <div className="mt-20 p-10 bg-slate-900 text-white rounded-xl relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-xl -mr-32 -mt-32 blur-[100px]"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                          <div className="w-20 h-20 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-900 shadow-[0_0_40px_rgba(16,185,129,0.3)] transform -rotate-3 transition-transform hover:rotate-0">
                            <StickyNote size={40} />
                          </div>
                          <div>
                            <h4 className="font-black text-xl mb-4 flex items-center gap-3">ملاحظات الإدارة والتدقيق</h4>
                            <p className="text-slate-400 text-sm leading-[1.8] font-medium opacity-90 max-w-xl">
                              {viewingBook.adminNotes || "هذا الإصدار معتمد ومسجل ضمن قاعدة بيانات منصة الدليل. تم التحقق من كافة المراجعات اللغوية والعلمية وفقاً لمعايير الجودة المتبعة."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-20 pt-10 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">بيانات النظام</p>
                      <p className="text-slate-900 font-bold text-xs">{viewingBook.publicVisible === false ? 'إصدار مخفي' : 'إصدار متاح للجمهور'}</p>
                    </div>
                    <button
                      onClick={() => setViewingBook(undefined)}
                      className="px-10 py-4 bg-slate-900 text-white font-black text-xs rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95"
                    >
                      إغلاق ومعاينة المكتبة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Wizard Form - Full Page Overlay */}
      {isFormOpen && currentUser && (
        <div className="fixed inset-0 z-[150] bg-white animate-fadeIn">
          <BookForm
            book={editingBook}
            onSave={handleSaveBook}
            onCancel={() => setIsFormOpen(false)}
            initialCategory={activeCategory === 'dashboard' ? Category.Books : (activeCategory as Category)}
            isSaving={isSaving}
          />
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <Login
          onLogin={handleLogin}
          onCancel={() => setIsLoginOpen(false)}
          error={loginError}
        />
      )}
    </>
  );
};

const BookCard: React.FC<{
  book: Book;
  onEdit: (b: Book) => void;
  onDelete: (id: string) => void;
  onViewDetails: (b: Book) => void;
  onToggleVisibility: (id: string) => void;
  user: User | null;
}> = ({ book, onEdit, onDelete, onViewDetails, onToggleVisibility, user }) => {
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

const BookRow: React.FC<{
  book: Book;
  onEdit: (b: Book) => void;
  onDelete: (id: string) => void;
  onViewDetails: (b: Book) => void;
  onToggleVisibility: (id: string) => void;
  user: User | null;
}> = ({ book, onEdit, onDelete, onViewDetails, onToggleVisibility, user }) => {
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

const DateInfo: React.FC<{ label: string; date?: string; color?: string; imageUrl?: string }> = ({ label, date, color, imageUrl }) => (
  <div className="flex items-center justify-between border-b border-slate-50 py-2 group/date">
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      {imageUrl && (
        <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center" title={imageUrl}>
          <LucideFile size={10} />
        </div>
      )}
    </div>
    <span className={`text-[11px] font-bold ${color || 'text-slate-700'}`}>{date || '—'}</span>
  </div>
);

const FileBadge: React.FC<{ url?: string; label: string }> = ({ url, label }) => (
  <div className={`flex items-center justify-between p-2 rounded-xl border transition-all ${url ? 'bg-white border-emerald-100/50 shadow-sm' : 'bg-transparent border-slate-200/30 opacity-40'}`}>
    <div className="flex items-center gap-2 overflow-hidden">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${url ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
        <LucideFile size={14} />
      </div>
      <div className="overflow-hidden">
        <p className={`text-[9px] font-black truncate ${url ? 'text-slate-900' : 'text-slate-400'}`}>{label}</p>
        {url && <p className="text-[8px] font-bold text-emerald-600 truncate">{url}</p>}
      </div>
    </div>
    {url && (
      <div className="p-1 px-2 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black flex items-center gap-1">
        <Upload size={10} className="rotate-180" />
        مرفوع
      </div>
    )}
  </div>
);

const WorkflowStep: React.FC<{ label: string; sender: string; sentDate?: string; receivedDate?: string; icon: React.ReactNode; color: string }> = ({ label, sender, sentDate, receivedDate, icon, color }) => {
  const calculateDays = (start?: string, end?: string) => {
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : null;
  };
  const days = calculateDays(sentDate, receivedDate);

  return (
    <div className="flex gap-6 items-start group">
      <div className={`w-14 h-14 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center shrink-0 shadow-sm border border-${color}-100 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1 space-y-4">
        <div>
          <h4 className="text-base font-black text-slate-900 mb-1">{label}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sender}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">تاريخ الإرسال</p>
            <p className="text-xs font-bold text-slate-700">{sentDate || '—'}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">تاريخ الاستلام</p>
              <p className="text-xs font-bold text-slate-700">{receivedDate || '—'}</p>
            </div>
            {days !== null && (
              <div className="px-2 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black">
                {days} يوم
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
