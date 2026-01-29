import React from 'react';
import { File as LucideFile, Upload } from 'lucide-react';

export const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex items-center justify-between border-b border-slate-100/60 py-2.5 w-full">
        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{label}</span>
        <span className="text-[12px] text-slate-700 font-bold text-left">{value || '—'}</span>
    </div>
);

export const TechnicalBox: React.FC<{ label: string; value: string; icon: React.ReactNode; color?: string }> = ({ label, value, icon, color }) => (
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

export const DateInfo: React.FC<{ label: string; date?: string; color?: string; imageUrl?: string }> = ({ label, date, color, imageUrl }) => (
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

export const FileBadge: React.FC<{ url?: string; label: string }> = ({ url, label }) => (
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

export const WorkflowStep: React.FC<{ label: string; sender: string; sentDate?: string; receivedDate?: string; icon: React.ReactNode; color: string }> = ({ label, sender, sentDate, receivedDate, icon, color }) => {
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
