import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, Headphones, Zap } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  const { setCurrentView } = useApp();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 sm:p-12 lg:p-14 text-white shadow-xl shadow-blue-500/20">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Dapatkan Hosting Terbaik untuk Website Anda Sekarang!
            </h2>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
              Mulai dari Rp 15.000/bulan dengan garansi 30 hari uang kembali, gratis SSL, dan bantuan teknis 24/7.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
              <button
                type="button"
                onClick={() => scrollTo('#hosting-plans')}
                className="px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-blue-700 font-extrabold text-sm shadow-md transition text-center"
              >
                Mulai Sekarang
              </button>

              <button
                type="button"
                onClick={() => scrollTo('#domain-search')}
                className="px-8 py-4 rounded-full bg-blue-800/50 hover:bg-blue-800/80 border border-white/20 text-white font-bold text-sm transition text-center backdrop-blur-sm"
              >
                Cari Domain
              </button>
            </div>

            <div className="pt-4 border-t border-white/20 flex flex-wrap items-center gap-6 text-xs text-blue-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Garansi 30 Hari Uang Kembali</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-emerald-300" />
                <span>Dukungan Teknis Siaga 24 Jam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
