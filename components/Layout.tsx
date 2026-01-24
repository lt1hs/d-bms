
import React from 'react';
import { Category } from '../types';
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
  Library
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeCategory: Category | 'dashboard';
  setActiveCategory: (cat: Category | 'dashboard') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeCategory, setActiveCategory }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const getIcon = (cat: Category | 'dashboard') => {
    switch (cat) {
      case 'dashboard': return <LayoutDashboard size={14} />;
      case Category.Books: return <Library size={14} />;
      case Category.Booklets: return <FileText size={14} />;
      case Category.GuideMagazine: return <Newspaper size={14} />;
      case Category.AnnualReport: return <Hash size={14} />;
      case Category.VisualReport: return <ImageIcon size={14} />;
      case Category.NatureMagazine: return <BookOpen size={14} />;
      default: return <BookOpen size={14} />;
    }
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'نظرة عامة' },
  ];

  const publicationItems = CATEGORIES.map(cat => ({ id: cat, label: cat }));

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* Mobile Toggle - Enhanced */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-2xl active:scale-95 transition-all border border-slate-700/50"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar - Pro Professional Design */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-64 bg-white border-l border-slate-100 transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col pt-8 pb-4">
          {/* Brand Identity */}
          <div className="px-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_12px_24px_-8px_rgba(15,23,42,0.5)] transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                  D
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-[2.5px] border-white rounded-xl"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">AL DALEEL</h1>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 opacity-70">Publication Hub</span>
              </div>
            </div>
          </div>

          {/* Navigation - Grouped & Styled */}
          <nav className="flex-1 px-4 space-y-6 overflow-y-auto scrollbar-hide">

            {/* Section: Main */}
            <div>
              <p className="text-[10px] font-black text-slate-300 mb-2 px-3 uppercase tracking-[0.3em]">الرئيسية</p>
              <div className="space-y-0.5">
                {navItems.map((item) => {
                  const isActive = activeCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveCategory(item.id); setIsMobileMenuOpen(false); }}
                      className={`
                        w-full flex items-center justify-between group px-3 py-2 rounded-xl transition-all duration-300
                        ${isActive
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-[-4px]'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`transition-colors duration-300 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          {getIcon(item.id)}
                        </span>
                        <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                      </div>
                      {isActive && <div className="w-1 h-1 bg-emerald-400 rounded-xl animate-pulse"></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section: Publications Categories */}
            <div>
              <p className="text-[10px] font-black text-slate-300 mb-2 px-3 uppercase tracking-[0.3em]">تصنيفات الإصدارات</p>
              <div className="space-y-0.5">
                {publicationItems.map((item) => {
                  const isActive = activeCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveCategory(item.id); setIsMobileMenuOpen(false); }}
                      className={`
                        w-full flex items-center justify-between group px-3 py-2 rounded-xl transition-all duration-300
                        ${isActive
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-[-4px]'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`transition-all duration-300 ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          {getIcon(item.id)}
                        </span>
                        <span className="text-[13px] font-bold tracking-tight text-right flex-1">{item.label}</span>
                      </div>
                      {isActive && <ChevronLeft size={12} className="text-emerald-400 mr-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section: System Tools */}
            <div className="pt-2 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-300 mb-2 px-3 uppercase tracking-[0.3em]">النظام</p>
              <div className="space-y-0.5">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all group">
                  <Settings size={14} className="group-hover:rotate-45 transition-transform" />
                  <span className="text-[13px] font-bold">الإعدادات</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all">
                  <HelpCircle size={14} />
                  <span className="text-[13px] font-bold">المساعدة</span>
                </button>
              </div>
            </div>
          </nav>

          {/* User Status Footer */}
          <div className="px-4 mt-4">
            <div className="bg-slate-900 rounded-xl p-3 flex flex-col gap-2.5 relative overflow-hidden shadow-2xl">
              {/* Decorative background circle */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-400/10 rounded-xl blur-xl"></div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={16} />
                </div>
                <div className="flex flex-col">
                  <p className="text-[12px] font-black text-white leading-none">إدارة النظام</p>
                  <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">Verified Admin</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[8px] font-black text-slate-500 border-t border-slate-800 pt-2 mt-0.5 uppercase tracking-tighter">
                <span>V 2.5.1 PRO</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1 h-1 rounded-xl bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
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
