
import React, { useState } from 'react';
import { Book, PublicationType, PublicationSize, ProcessStatus, Category } from '../types';
import { PUBLICATION_TYPES, PUBLICATION_SIZES, PROCESS_STATUSES, CATEGORIES } from '../constants';
import { X, ChevronRight, ChevronLeft, Save } from 'lucide-react';

interface BookFormProps {
  book?: Partial<Book>;
  onSave: (data: Partial<Book>) => void;
  onCancel: () => void;
  initialCategory?: Category;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSave, onCancel, initialCategory }) => {
  const [activeTab, setActiveTab] = useState<'part1' | 'part2'>('part1');
  const [formData, setFormData] = useState<Partial<Book>>(book || {
    category: initialCategory || Category.Books,
    title: '',
    author: '',
    scientificReview: '',
    translation: '',
    linguisticCorrector: '',
    investigation: '',
    director: '',
    coverDesigner: '',
    publicationYear: '',
    edition: '',
    type: PublicationType.Book,
    size: PublicationSize.Waziri,
    customSize: '',
    status: ProcessStatus.InProgress,
    depositNumber: '',
    isbn: '',
    pageCount: 0,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700 text-xs placeholder:text-slate-200 shadow-sm";
  const labelClass = "block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-[0.1em] ml-1";

  return (
    <div className="bg-white rounded-xl shadow-xl w-full overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      {/* Sidebar Progress */}
      <div className="md:w-56 bg-slate-900 p-6 flex flex-col text-white">
        <div className="mb-8">
          <h2 className="text-xl font-black mb-0.5 leading-tight">سجل الإصدار</h2>
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">AL DALEEL Entry</p>
        </div>

        <div className="space-y-4 flex-1">
          <button
            type="button"
            onClick={() => setActiveTab('part1')}
            className={`w-full flex items-center gap-3 transition-all ${activeTab === 'part1' ? 'text-white translate-x-[-4px]' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-all ${activeTab === 'part1' ? 'bg-emerald-500' : 'bg-slate-800'}`}>1</div>
            <span className="font-bold text-xs">بيانات الإصدار</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('part2')}
            className={`w-full flex items-center gap-3 transition-all ${activeTab === 'part2' ? 'text-white translate-x-[-4px]' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-all ${activeTab === 'part2' ? 'bg-emerald-500' : 'bg-slate-800'}`}>2</div>
            <span className="font-bold text-xs">المواصفات الفنية</span>
          </button>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-xl"></div>
            <p className="text-[8px] font-black uppercase tracking-widest">محمي بنظام التشفير</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 bg-white relative">
        <button type="button" onClick={onCancel} className="absolute top-6 left-6 p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-900 transition-all">
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex-1">
            {activeTab === 'part1' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 animate-fadeIn">
                <div className="md:col-span-2 mb-2">
                  <h3 className="text-xl font-black text-slate-900 mb-0.5">البيانات الأساسية</h3>
                  <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Part 01: Identity</p>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>عنوان الإصدار بالكامل</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass} required placeholder="أدخل العنوان هنا..." />
                </div>
                <div>
                  <label className={labelClass}>المؤلف / الموعد</label>
                  <input type="text" name="author" value={formData.author} onChange={handleChange} className={inputClass} placeholder="اسم المؤلف..." />
                </div>
                <div>
                  <label className={labelClass}>المراجعة العلمية</label>
                  <input type="text" name="scientificReview" value={formData.scientificReview} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>الترجمة</label>
                  <input type="text" name="translation" value={formData.translation} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>المقوم اللغوي</label>
                  <input type="text" name="linguisticCorrector" value={formData.linguisticCorrector} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>التحقيق</label>
                  <input type="text" name="investigation" value={formData.investigation} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>الإخراج الفني</label>
                  <input type="text" name="director" value={formData.director} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>مصمم الغلاف</label>
                  <input type="text" name="coverDesigner" value={formData.coverDesigner} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>سنة النشر</label>
                  <input type="text" name="publicationYear" value={formData.publicationYear} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>رقم الطبعة</label>
                  <input type="text" name="edition" value={formData.edition} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            )}

            {activeTab === 'part2' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 animate-fadeIn">
                <div className="md:col-span-2 mb-2">
                  <h3 className="text-xl font-black text-slate-900 mb-0.5">المواصفات الفنية</h3>
                  <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Part 02: Technicals</p>
                </div>
                <div>
                  <label className={labelClass}>القسم الرئيسي</label>
                  <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>صنف المطبوع</label>
                  <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                    {PUBLICATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>مقاس القطع</label>
                  <select name="size" value={formData.size} onChange={handleChange} className={inputClass}>
                    {PUBLICATION_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {formData.size === PublicationSize.Custom && (
                  <div>
                    <label className={labelClass}>أبعاد القطع (مخصص)</label>
                    <input type="text" name="customSize" value={formData.customSize} onChange={handleChange} className={inputClass} placeholder="مثال: 17x24 سم" />
                  </div>
                )}
                <div>
                  <label className={labelClass}>الحالة الفنية</label>
                  <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                    {PROCESS_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>رقم الإيداع</label>
                  <input type="text" name="depositNumber" value={formData.depositNumber} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>ISBN الرقم المعياري</label>
                  <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>إجمالي الصفحات</label>
                  <input type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>رابط صورة الغلاف</label>
                  <input type="text" name="image" value={formData.image} onChange={handleChange} className={inputClass} placeholder="https://..." />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50">
            <div>
              {activeTab === 'part2' ? (
                <button type="button" onClick={() => setActiveTab('part1')} className="flex items-center gap-1.5 px-4 py-3 text-slate-400 font-bold hover:text-slate-900 transition-all text-xs">
                  <ChevronRight size={16} />
                  <span>العودة</span>
                </button>
              ) : (
                <button type="button" onClick={onCancel} className="px-4 py-3 text-slate-400 font-bold hover:text-red-500 transition-all text-xs">إلغاء</button>
              )}
            </div>

            <div className="flex gap-3">
              {activeTab === 'part1' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('part2')}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-black shadow-md hover:translate-y-[-1px] transition-all text-xs"
                >
                  <span>المتابعة</span>
                  <ChevronLeft size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-10 py-3 bg-emerald-600 text-white rounded-xl font-black shadow-md hover:bg-emerald-700 hover:translate-y-[-1px] transition-all text-xs"
                >
                  <Save size={16} />
                  <span>حفظ السجل</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
