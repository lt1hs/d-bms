import React from 'react';
import { Category, User, UserRole } from '../types';
import { CATEGORIES } from '../constants';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Newspaper,
  Image as ImageIcon,
  Menu,
  X,
  ShieldCheck,
  ChevronLeft,
  Settings,
  HelpCircle,
  Hash,
  Library,
  Search,
  Users,
  LogOut,
  ShieldAlert
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeCategory: Category | 'dashboard' | 'search' | 'users' | 'settings';
  setActiveCategory: (cat: Category | 'dashboard' | 'search' | 'users' | 'settings') => void;
  user: User | null;
  onLogout: () => void;
  onTriggerLogin: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeCategory, setActiveCategory, user, onLogout, onTriggerLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [logoClicks, setLogoClicks] = React.useState(0);

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 5 && !user) {
      onTriggerLogin();
      setLogoClicks(0);
    }
    setTimeout(() => setLogoClicks(0), 3000);
  };

  const getIcon = (cat: Category | 'dashboard' | 'search' | 'users' | 'settings') => {
    const size = 18;
    switch (cat) {
      case 'dashboard': return <LayoutDashboard size={size} />;
      case 'search': return <Search size={size} />;
      case 'users': return <Users size={size} />;
      case 'settings': return <Settings size={size} />;
      case Category.Books: return <Library size={size} />;
      case Category.Booklets: return <FileText size={size} />;
      case Category.GuideMagazine: return <Newspaper size={size} />;
      case Category.AnnualReport: return <Hash size={size} />;
      case Category.VisualReport: return <ImageIcon size={size} />;
      case Category.NatureMagazine: return <BookOpen size={size} />;
      default: return <BookOpen size={size} />;
    }
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'لوحة القيادة' },
    { id: 'search' as const, label: 'استعراض الإصدارات' },
  ];

  const publicationItems = CATEGORIES.map(cat => ({ id: cat, label: cat }));

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-2xl active:scale-95 transition-all border border-slate-700/50"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar - Pro Professional Design with Compact Mode */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 bg-white border-l border-slate-100 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:sticky lg:top-0 lg:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Toggle Button - Desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute top-10 -left-3.5 w-7 h-7 bg-white border border-slate-100 rounded-full items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm z-50"
        >
          <ChevronLeft size={14} className={`transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="h-full flex flex-col pt-8 pb-4 overflow-hidden">
          {/* Brand Identity */}
          <div className={`px-6 mb-8 transition-all duration-300 ${isCollapsed ? 'px-4' : 'px-6'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="relative shrink-0">
                <div
                  onClick={handleLogoClick}
                  className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_12px_24px_-8px_rgba(15,23,42,0.5)] transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer select-none"
                >
                  D
                </div>
                {user && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-[2.5px] border-white rounded-xl"></div>}
              </div>
              <div className={`flex flex-col transition-all duration-300 origin-right ${isCollapsed ? 'w-0 opacity-0 scale-95 pointer-events-none' : 'w-auto opacity-100 scale-100'}`}>
                <h1 className="text-base font-black tracking-tight text-slate-900 leading-none whitespace-nowrap">AL DALEEL</h1>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 opacity-70 whitespace-nowrap">{user ? 'Admin Terminal' : 'Public Library'}</span>
              </div>
            </div>
          </div>

          {/* Navigation - Grouped & Styled */}
          <nav className="flex-1 px-4 space-y-8 overflow-y-auto scrollbar-hide overflow-x-hidden">

            {/* Section: Main */}
            <div>
              {!isCollapsed && <p className="text-[10px] font-black text-slate-300 mb-3 px-3 uppercase tracking-[0.3em] animate-fadeIn">الرئيسية</p>}
              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = activeCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveCategory(item.id); setIsMobileMenuOpen(false); }}
                      className={`
                        w-full flex items-center group rounded-xl transition-all duration-300 relative
                        ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'}
                        ${isActive
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                      `}
                      title={isCollapsed ? item.label : ''}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`transition-all duration-300 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          {getIcon(item.id)}
                        </span>
                        {!isCollapsed && <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">{item.label}</span>}
                      </div>
                      {!isCollapsed && isActive && <div className="w-1 h-1 bg-emerald-400 rounded-xl animate-pulse"></div>}
                      {isCollapsed && isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-400 rounded-l-full"></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section: Publications Categories */}
            <div>
              {!isCollapsed && <p className="text-[10px] font-black text-slate-300 mb-3 px-3 uppercase tracking-[0.3em] animate-fadeIn">تصنيفات الإصدارات</p>}
              <div className="space-y-1.5">
                {publicationItems.map((item) => {
                  const isActive = activeCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveCategory(item.id); setIsMobileMenuOpen(false); }}
                      className={`
                        w-full flex items-center group rounded-xl transition-all duration-300 relative
                        ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'}
                        ${isActive
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                      `}
                      title={isCollapsed ? item.label : ''}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`transition-all duration-300 ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          {getIcon(item.id)}
                        </span>
                        {!isCollapsed && <span className="text-[13px] font-bold tracking-tight text-right flex-1 whitespace-nowrap truncate max-w-[140px]">{item.label}</span>}
                      </div>
                      {!isCollapsed && isActive && <ChevronLeft size={12} className="text-emerald-400 mr-1" />}
                      {isCollapsed && isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-400 rounded-l-full"></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section: System Tools */}
            <div className="pt-2 border-t border-slate-50">
              {!isCollapsed && <p className="text-[10px] font-black text-slate-300 mb-3 px-3 uppercase tracking-[0.3em] animate-fadeIn">النظام</p>}
              <div className="space-y-1.5">
                <button
                  onClick={() => user?.role === UserRole.SUPER_ADMIN && setActiveCategory('settings')}
                  className={`
                    w-full flex items-center transition-all group relative rounded-xl
                    ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}
                    ${activeCategory === 'settings' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                  title={isCollapsed ? 'الإعدادات' : ''}
                >
                  <Settings size={18} className={activeCategory === 'settings' ? 'text-emerald-400' : 'group-hover:rotate-45 transition-transform duration-500'} />
                  {!isCollapsed && <span className="text-[13px] font-bold">الإعدادات</span>}
                  {!isCollapsed && user?.role !== UserRole.SUPER_ADMIN && <ShieldAlert size={10} className="mr-auto opacity-50" />}
                  {isCollapsed && activeCategory === 'settings' && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-400 rounded-l-full"></div>}
                </button>
                <button
                  className={`w-full flex items-center transition-all group rounded-xl ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} text-slate-400 hover:bg-slate-50 hover:text-slate-900`}
                  title={isCollapsed ? 'المساعدة' : ''}
                >
                  <HelpCircle size={18} />
                  {!isCollapsed && <span className="text-[13px] font-bold">المساعدة</span>}
                </button>
              </div>
            </div>
          </nav>

          {/* User Status Footer */}
          <div className={`mt-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {user ? (
              <div className={`bg-slate-900 rounded-xl relative overflow-hidden shadow-2xl transition-all duration-300 ${isCollapsed ? 'p-2 flex flex-col items-center gap-4' : 'p-3 flex flex-col gap-2.5'}`}>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-400/10 rounded-xl blur-xl"></div>

                <div className={`flex items-center relative z-10 w-full ${isCollapsed ? 'flex-col gap-4' : 'justify-between'}`}>
                  <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'gap-3'}`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                      <ShieldCheck size={20} />
                    </div>
                    <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'w-0 h-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                      <p className="text-[12px] font-black text-white leading-none truncate max-w-[80px]">{user.username}</p>
                      <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className={`text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all ${isCollapsed ? 'p-2 bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400' : 'p-1.5'}`}
                    title="تسجيل الخروج"
                  >
                    <LogOut size={16} />
                  </button>
                </div>

                {!isCollapsed && (
                  <div className="flex items-center justify-between text-[8px] font-black text-slate-500 border-t border-slate-800 pt-2 mt-0.5 uppercase tracking-tighter animate-fadeIn">
                    <span>SYSTEM ACTIVE</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-1 h-1 rounded-xl bg-emerald-400 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className={`bg-slate-50 rounded-xl border border-slate-100 border-dashed text-center transition-all duration-300 ${isCollapsed ? 'p-2 py-4' : 'p-4'}`}>
                {isCollapsed ? (
                  <Library size={20} className="text-slate-300 mx-auto" />
                ) : (
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                    نظام استعراض<br />المكتبة العام
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Content Canvas */}
      <main className="flex-1 overflow-auto bg-[#FAFAFA]">
        <div className="max-w-[1400px] mx-auto min-h-screen relative px-4 lg:px-8 py-6">
          {/* Backdrop Blur Header Spacer */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-white/40 backdrop-blur-sm pointer-events-none lg:hidden"></div>

          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
