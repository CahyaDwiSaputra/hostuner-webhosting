import React from 'react';
import { useApp } from '../context/AppContext';
import { Server, Mail, Phone, MapPin, Heart, Shield, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { theme, setCurrentView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info matching Figma */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
                <span>{theme.logoTextFirst || 'Hostuner'}</span>
                <span className="text-blue-500 font-extrabold">{theme.logoTextSecond || 'Webhosting'}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Solusi infrastruktur cloud hosting, pendaftaran domain, dan cloud server berkinerja tinggi dengan uptime SLA 99.9% dan dukungan teknis 24/7.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>{theme.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>{theme.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>{theme.email}</span>
              </div>
            </div>
          </div>

          {/* Links: Layanan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Layanan Hosting</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-blue-400 transition">
                  Web Hosting Murah
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-blue-400 transition">
                  Cloud Hosting Bisnis
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-blue-400 transition">
                  Cloud VPS Indonesia
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-blue-400 transition">
                  Pendaftaran Domain .ID
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-blue-400 transition">
                  Domain Internasional .COM
                </button>
              </li>
            </ul>
          </div>

          {/* Links: Bantuan & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Pusat Bantuan</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button onClick={() => setCurrentView('client-dashboard')} className="hover:text-blue-400 transition">
                  Tiket Bantuan 24/7
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-400 transition">
                  Pertanyaan Umum (FAQ)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-400 transition">
                  SLA Uptime & Status Server
                </a>
              </li>
              <li>
                <span className="text-slate-500">Kebijakan Privasi</span>
              </li>
              <li>
                <span className="text-slate-500">Syarat & Ketentuan Layanan</span>
              </li>
            </ul>
          </div>

          {/* Links: Portal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Portal Akses</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentView('client-dashboard')}
                  className="hover:text-blue-400 transition flex items-center gap-1"
                >
                  <span>Area Klien Pelanggan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('admin-dashboard')}
                  className="hover:text-purple-400 transition flex items-center gap-1 text-purple-300 font-semibold"
                >
                  <span>Panel Administrasi (CMS)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <span className="text-slate-500">Webmail Login</span>
              </li>
              <li>
                <span className="text-slate-500">cPanel Port 2083</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payment Partner Badges & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div>
            <p>
              © {new Date().getFullYear()} <strong className="text-slate-200">{theme.companyName}</strong>. Seluruh Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>

          {/* Payment Badges Pill */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <span className="text-slate-400">Metode Pembayaran:</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">QRIS</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">BCA VA</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Mandiri</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">BNI</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">BRI</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">GoPay</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">ShopeePay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
