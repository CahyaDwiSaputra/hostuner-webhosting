import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, login, register, setCurrentView } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      if (!name || !email || !phone) {
        setErrorMsg('Semua kolom formulir pendaftaran wajib diisi.');
        return;
      }
      register(name, email, phone);
      setAuthModalOpen(false);
      setCurrentView('client-dashboard');
    } else {
      if (!email) {
        setErrorMsg('Silakan masukkan email Anda.');
        return;
      }
      const success = login(email, role);
      if (success) {
        setAuthModalOpen(false);
        if (role === 'admin') {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('client-dashboard');
        }
      }
    }
  };

  const handleQuickLogin = (quickEmail: string, quickRole: 'customer' | 'admin') => {
    login(quickEmail, quickRole);
    setAuthModalOpen(false);
    if (quickRole === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('client-dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 font-bold shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {isRegister ? 'Daftar Akun Baru' : 'Masuk ke Portal Layanan'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRegister
              ? 'Lengkapi data untuk mengelola hosting, domain, dan tagihan Anda.'
              : 'Gunakan kredensial akun pelanggan atau administrator Anda.'}
          </p>
        </div>

        {/* Quick Demo Login Tabs */}
        {!isRegister && (
          <div className="px-6 sm:px-8 pb-2">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                Akses Cepat (Demo Satu Klik):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('cahya@gmail.com', 'customer')}
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Pelanggan</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@hostuner.com', 'admin')}
                  className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 pt-4 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama sesuai identitas"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Nomor Telepon / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>
          </div>

          {!isRegister && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Peran Akses</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    role === 'customer'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Pelanggan
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    role === 'admin'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 pt-3"
          >
            <span>{isRegister ? 'Daftar Sekarang' : 'Masuk ke Sistem'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Toggle between Login and Register */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {isRegister ? (
              <span>
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Masuk di sini
                </button>
              </span>
            ) : (
              <span>
                Belum memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Daftar akun gratis
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
