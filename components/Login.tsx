
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, Lock, User as UserIcon, X, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
    onLogin: (username: string, pass: string) => void;
    onCancel: () => void;
    error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slideUp border border-slate-100">
                <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-900 mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight">بوابة إدارة النظام</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Secure Admin Authentication</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">اسم المستخدم</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                                    <UserIcon size={16} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-700 text-sm"
                                    placeholder="admin_id_00"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">كلمة المرور</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pr-12 pl-12 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-700 text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-300 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black text-sm shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
                    >
                        تسجيل الدخول للنظام
                    </button>

                    <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                        Authorized Personnel Only • IP: Logged
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
