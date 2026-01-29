
import React, { useState } from 'react';
import { Book, PublicationType, PublicationSize, ProcessStatus, Category } from '../types';
import { PUBLICATION_TYPES, PUBLICATION_SIZES, PROCESS_STATUSES, CATEGORIES } from '../constants';
import { X, ChevronRight, ChevronLeft, Save, Upload, File, FileText as LucideFileText, Check } from 'lucide-react';

interface BookFormProps {
  book?: Partial<Book>;
  onSave: (data: Partial<Book>) => void;
  onCancel: () => void;
  initialCategory?: Category;
  isSaving?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSave, onCancel, initialCategory, isSaving = false }) => {
  const [activeTab, setActiveTab] = useState<'part1' | 'part2' | 'part3'>('part1');
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
    image: '/images/placeholder.jpg'
  });

  const [imageType, setImageType] = useState<'link' | 'upload'>(
    book?.image?.startsWith('blob:') || book?.image?.startsWith('data:') ? 'upload' : 'link'
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Update form data when switching types if needed, or just let the UI handle it
  const handleImageTypeChange = (type: 'link' | 'upload') => {
    setImageType(type);
    // Optional: Clear image if switching types? 
    // For now we keep it so user doesn't lose data accidentally
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'part1') {
      setActiveTab('part2');
    } else if (activeTab === 'part2') {
      setActiveTab('part3');
    } else if (activeTab === 'part3') {
      onSave(formData);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700 text-xs placeholder:text-slate-200 shadow-sm";
  const labelClass = "block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-[0.1em] ml-1";

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Wizard Header & Stepper */}
      <div className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-widest group"
          >
            <div className="w-9 h-9 border border-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-50">
              <ChevronRight size={18} />
            </div>
            إلغاء العملية
          </button>

          <div className="h-8 w-px bg-slate-100 mx-2"></div>

          <div className="flex items-center gap-8">
            <StepIndicator
              step={1}
              active={activeTab === 'part1'}
              completed={activeTab === 'part2' || activeTab === 'part3'}
              label="بيانات الإصدار"
              onClick={() => setActiveTab('part1')}
            />
            <div className="w-12 h-px bg-slate-100"></div>
            <StepIndicator
              step={2}
              active={activeTab === 'part2'}
              completed={activeTab === 'part3'}
              label="المواصفات الفنية"
              onClick={() => {
                if (activeTab !== 'part1') setActiveTab('part2');
              }}
            />
            <div className="w-12 h-px bg-slate-100"></div>
            <StepIndicator
              step={3}
              active={activeTab === 'part3'}
              completed={false}
              label="تتبع الإنتاج"
              onClick={() => {
                if (activeTab === 'part3') setActiveTab('part3'); // Already there or do nothing
                // To allow clicking back only if we've reached it:
                // if (activeTab === 'part3') ... 
              }}
            />
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <h2 className="text-sm font-black text-slate-900 leading-none">سجل إصدار جديد</h2>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Creation Protocol v2.0</p>
        </div>
      </div>

      {/* Wizard Form Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide py-12 px-8">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-12 pb-24">
            <div className="bg-white p-12 rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] border border-slate-100">
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
                  <div className="md:col-span-2 space-y-2">
                    <label className={labelClass}>صورة الغلاف</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                      <button
                        type="button"
                        onClick={() => handleImageTypeChange('link')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${imageType === 'link' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                      >
                        رابط مباشر
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImageTypeChange('upload')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${imageType === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                      >
                        رفع ملف
                      </button>
                    </div>

                    {imageType === 'link' ? (
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="https://..."
                      />
                    ) : (
                      <FileUploader
                        label=""
                        value={formData.image?.startsWith('data:') ? 'تم اختيار صورة الغلاف' : undefined}
                        onChange={(dataUrl) => {
                          setFormData(prev => ({ ...prev, image: dataUrl }))
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'part3' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 animate-fadeIn overflow-y-auto pr-2 max-h-[60vh] scrollbar-hide">
                  <div className="md:col-span-3 mb-2 flex items-center justify-between border-b border-slate-50 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-0.5">تتبع دورة الإنتاج</h3>
                      <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Part 03: Production Timeline & Files</p>
                    </div>
                  </div>

                  {/* Dates Section */}
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                    <div className="md:col-span-3 mb-2">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">مواعيد الاستلام والاعتمادات</p>
                    </div>
                    <div>
                      <label className={labelClass}>الاستلام من شعبة البحوث</label>
                      <input type="date" name="receivedFromResearchDate" value={formData.receivedFromResearchDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className={labelClass + " !mb-0"}>المصادقة على العنوان</label>
                        <AttachmentTrigger
                          value={formData.titleApprovalImage}
                          onChange={(url) => setFormData(prev => ({ ...prev, titleApprovalImage: url }))}
                        />
                      </div>
                      <input type="date" name="titleApprovalDate" value={formData.titleApprovalDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>طلب رقم الإيداع</label>
                      <input type="date" name="depositRequestDate" value={formData.depositRequestDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>استلام رقم الإيداع</label>
                      <input type="date" name="depositReceiveDate" value={formData.depositReceiveDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>استلام كلمة المؤسسة</label>
                      <input type="date" name="orgWordReceiveDate" value={formData.orgWordReceiveDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>استلام الخلاصة</label>
                      <input type="date" name="abstractReceiveDate" value={formData.abstractReceiveDate} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>

                  {/* Files Status */}
                  <div className="md:col-span-1 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">ملفات الغلاف</p>
                    <div className="space-y-4">
                      <FileUploader label="النسخة قابلة للتحرير (PSD/AI)" value={formData.coverEditableUrl} onChange={(url) => setFormData(prev => ({ ...prev, coverEditableUrl: url }))} />
                      <FileUploader label="نسخة للمشاهدة (PNG/JPG)" value={formData.coverViewableUrl} onChange={(url) => setFormData(prev => ({ ...prev, coverViewableUrl: url }))} />
                      <FileUploader label="نسخة للمطبعة (PDF)" value={formData.coverPrintableUrl} onChange={(url) => setFormData(prev => ({ ...prev, coverPrintableUrl: url }))} />
                      <FileUploader label="توقيع الرئاسة" value={formData.coverSignatureUrl} onChange={(url) => setFormData(prev => ({ ...prev, coverSignatureUrl: url }))} />
                    </div>
                  </div>

                  <div className="md:col-span-1 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">ملفات المتن</p>
                    <div className="space-y-4">
                      <FileUploader label="النسخة قابلة للتحرير (Docx/InDesign)" value={formData.bodyEditableUrl} onChange={(url) => setFormData(prev => ({ ...prev, bodyEditableUrl: url }))} />
                      <FileUploader label="ملف المتن النهائي (PDF)" value={formData.bodyPdfUrl} onChange={(url) => setFormData(prev => ({ ...prev, bodyPdfUrl: url }))} />
                      <FileUploader label="العلامة المائية (Watermark)" value={formData.bodyWatermarkUrl} onChange={(url) => setFormData(prev => ({ ...prev, bodyWatermarkUrl: url }))} />
                      <FileUploader label="استمارة التوقيعات" value={formData.bodySignaturesUrl} onChange={(url) => setFormData(prev => ({ ...prev, bodySignaturesUrl: url }))} />
                    </div>
                  </div>

                  <div className="md:col-span-1 space-y-4">
                    <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between mb-1">
                        <label className={labelClass + " !mb-0 !text-emerald-700"}>تاريخ ملء استمارة الصرف</label>
                        <AttachmentTrigger
                          value={formData.disbursementFormImage}
                          onChange={(url) => setFormData(prev => ({ ...prev, disbursementFormImage: url }))}
                        />
                      </div>
                      <input type="date" name="disbursementFormDate" value={formData.disbursementFormDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="bg-slate-900 p-5 rounded-xl text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">هوية الإصدار</p>
                      <h4 className="text-sm font-black text-emerald-400 truncate">{formData.title || 'لم يُحدد عنوان'}</h4>
                    </div>
                  </div>

                  {/* Process Flow */}
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مراحل الإخراج الفني</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>تاريخ الإرسال</label>
                          <input type="date" name="sentToDirectorDate" value={formData.sentToDirectorDate} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>تاريخ الاستلام</label>
                          <input type="date" name="receivedFromDirectorDate" value={formData.receivedFromDirectorDate} onChange={handleChange} className={inputClass} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مراحل التصميم</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>تاريخ الإرسال</label>
                          <input type="date" name="sentToDesignerDate" value={formData.sentToDesignerDate} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>تاريخ الاستلام</label>
                          <input type="date" name="receivedFromDesignerDate" value={formData.receivedFromDesignerDate} onChange={handleChange} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Printing Details */}
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <div>
                      <label className={labelClass}>الإرسال للطبعة الرقمية</label>
                      <input type="date" name="digitalPrintDate" value={formData.digitalPrintDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>الإرسال للطبعة الأوفسيت</label>
                      <input type="date" name="offsetPrintDate" value={formData.offsetPrintDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>تأييد الغلاف</label>
                      <input type="date" name="coverEndorsementDate" value={formData.coverEndorsementDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>الاستلام من المطبعة</label>
                      <input type="date" name="receiveFromPrintDate" value={formData.receiveFromPrintDate} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>المطبعة</label>
                      <input type="text" name="printingHouse" value={formData.printingHouse} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>كمية الطبع</label>
                      <input type="text" name="printQuantity" value={formData.printQuantity} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>المنفذ</label>
                      <input type="text" name="executor" value={formData.executor} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="md:col-span-4 mt-2">
                      <label className={labelClass}>ملاحظات الإدارة (مذكرة التدقيق والجودة)</label>
                      <textarea
                        name="adminNotes"
                        value={formData.adminNotes}
                        onChange={handleChange}
                        rows={3}
                        className={inputClass + " resize-none min-h-[80px] pt-3"}
                        placeholder="أدخل ملاحظات التدقيق والجودة هنا..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50">
              <div>
                {activeTab === 'part2' ? (
                  <button type="button" onClick={() => setActiveTab('part1')} className="flex items-center gap-1.5 px-4 py-3 text-slate-400 font-bold hover:text-slate-900 transition-all text-xs">
                    <ChevronRight size={16} />
                    <span>سابقة</span>
                  </button>
                ) : activeTab === 'part3' ? (
                  <button type="button" onClick={() => setActiveTab('part2')} className="flex items-center gap-1.5 px-4 py-3 text-slate-400 font-bold hover:text-slate-900 transition-all text-xs">
                    <ChevronRight size={16} />
                    <span>سابقة</span>
                  </button>
                ) : (
                  <button type="button" onClick={onCancel} className="px-4 py-3 text-slate-400 font-bold hover:text-red-500 transition-all text-xs">إلغاء</button>
                )}
              </div>

              <div className="flex gap-3">
                {activeTab === 'part1' ? (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-black shadow-md hover:translate-y-[-1px] transition-all text-xs"
                  >
                    <span>المتابعة</span>
                    <ChevronLeft size={16} />
                  </button>
                ) : activeTab === 'part2' ? (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-black shadow-md hover:translate-y-[-1px] transition-all text-xs"
                  >
                    <span>دورة الإنتاج</span>
                    <ChevronLeft size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-10 py-3 bg-emerald-600 text-white rounded-xl font-black shadow-md hover:bg-emerald-700 hover:translate-y-[-1px] transition-all text-xs disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{isSaving ? 'جاري الحفظ...' : 'حفظ السجل'}</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const StepIndicator: React.FC<{ step: number, active: boolean, completed: boolean, label: string, onClick: () => void }> = ({ step, active, completed, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 transition-all ${active ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-60'}`}
  >
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
      {completed ? <Check size={16} /> : step}
    </div>
    <span className={`font-black text-[10px] uppercase tracking-widest ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
  </button>
);

const FileUploader: React.FC<{ label: string; value?: string; onChange: (url: string) => void }> = ({ label, value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit to 2MB to avoid "Data too long" for now
        alert('File is too large for this prototype. Please use an image smaller than 2MB.');
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">{label}</p>
      <label className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer group ${value ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50/50 border-slate-100 hover:border-emerald-200 hover:bg-white'}`}>
        <input type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} />
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${value ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 group-hover:text-emerald-500 shadow-sm'}`}>
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : value ? (
            <Check size={16} />
          ) : (
            <Upload size={16} />
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className={`text-[10px] font-black truncate ${value ? 'text-emerald-900' : 'text-slate-400'}`}>
            {value ? value : 'انقر لرفع الملف...'}
          </p>
          {value && <p className="text-[8px] font-bold text-emerald-600/60 uppercase">File attached successfully</p>}
        </div>
      </label>
    </div>
  );
};

const AttachmentTrigger: React.FC<{ value?: string; onChange: (url: string) => void }> = ({ value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        onChange(file.name);
        setIsUploading(false);
      }, 600);
    }
  };
  return (
    <label className={`cursor-pointer transition-all ${value ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}`}>
      <input type="file" className="hidden" onChange={handleFile} />
      {isUploading ? (
        <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      ) : value ? (
        <Check size={14} />
      ) : (
        <Upload size={14} />
      )}
    </label>
  );
};

export default BookForm;
