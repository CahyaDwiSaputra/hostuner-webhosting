import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Server,
  Globe,
  Cpu,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    theme,
    currentUser,
    logout,
    currentView,
    setCurrentView,
    setAuthModalOpen,
    orderDraft,
    login,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'hosting', label: 'Hosting', hash: '#hosting-plans' },
    { id: 'domain', label: 'Domain', hash: '#domain-search' },
    { id: 'server', label: 'Server', hash: '#vps-section' },
    { id: 'features', label: 'Keunggulan', hash: '#features' },
    { id: 'faq', label: 'FAQ', hash: '#faq' },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.querySelector(link.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(link.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* Top Banner only if explicitly enabled in theme */}
      {theme.topBannerEnabled && (
        <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-slate-300">
                Bantuan Teknis: <strong className="text-white font-medium">{theme.phone}</strong>
              </span>
              <span className="hidden sm:inline text-slate-400">
                Email: {theme.email}
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-slate-300 font-medium hidden md:inline">
                Data Center Jakarta & Solo
              </span>
              <span className="hidden md:inline">•</span>
              <button
                onClick={() => {
                  if (currentView !== 'home') setCurrentView('home');
                  setTimeout(() => {
                    const el = document.querySelector('#faq');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="hover:text-white transition"
              >
                Pusat Bantuan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Brand Logo - Exact Figma Design */}
          <div className="flex items-center gap-8 shrink-0">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition shrink-0">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5 leading-none">
                <span className="text-slate-900">{theme.logoTextFirst || 'Hostuner'}</span>
                <span className="text-blue-600 font-extrabold">{theme.logoTextSecond || 'Webhosting'}</span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-2">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Clean Cart Indicator */}
            {orderDraft.selectedPackage && (
              <button
                onClick={() => setCurrentView('order-config')}
                className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
                title={`Pesanan Aktif: ${orderDraft.selectedPackage.name}`}
              >
                <ShoppingBag className="w-5 h-5 text-slate-700" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                  1
                </span>
              </button>
            )}

            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-900">{currentUser.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Masuk sebagai</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{currentUser.email}</p>
                    </div>

                    <div className="p-1.5">
                      <button
                        onClick={() => {
                          setCurrentView('client-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Area Pelanggan (Dashboard)</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setCurrentView('admin-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-purple-700 hover:bg-purple-50 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span>Panel Admin (CMS & Konten)</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 p-2 bg-slate-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">
                        Simulasi Peran Akses
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            login('cahya@gmail.com', 'customer');
                            setCurrentView('client-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition text-center ${
                            currentUser.role === 'customer'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Pelanggan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            login('admin@buanalogikautama.co.id', 'admin');
                            setCurrentView('admin-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition text-center ${
                            currentUser.role === 'admin'
                              ? 'bg-purple-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Admin CMS
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 p-1.5">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-blue-600 transition"
                >
                  Masuk
                </button>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 transition"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="text-left px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setCurrentView('client-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-bold bg-slate-100 text-slate-800"
                >
                  Area Pelanggan
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setCurrentView('admin-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-bold bg-purple-600 text-white"
                  >
                    Panel Admin (CMS & Konten)
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 px-4 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Keluar
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-bold bg-blue-600 text-white shadow"
              >
                Masuk / Daftar Akun
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
