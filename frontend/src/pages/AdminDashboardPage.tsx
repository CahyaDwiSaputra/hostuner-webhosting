import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/format';
import {
  Palette,
  LayoutGrid,
  CreditCard,
  Receipt,
  Server,
  Users,
  BarChart3,
  LifeBuoy,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Zap,
  Star,
  MessageSquareQuote,
  Quote,
} from 'lucide-react';
import {
  HostingPackage,
  VpsPackage,
  DomainExtension,
  FeatureCard,
  TestimonialItem,
  OrderStatus,
} from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    theme,
    updateTheme,
    resetTheme,
    paymentConfig,
    updatePaymentConfig,
    hostingPackages,
    addHostingPackage,
    updateHostingPackage,
    deleteHostingPackage,
    resetHostingPackages,
    vpsPackages,
    addVpsPackage,
    updateVpsPackage,
    deleteVpsPackage,
    domainExtensions,
    addDomainExtension,
    updateDomainExtension,
    deleteDomainExtension,
    featureCards,
    addFeatureCard,
    updateFeatureCard,
    deleteFeatureCard,
    orders,
    updateOrderStatus,
    customerServices,
    users,
    updateUser,
    tickets,
    replyTicket,
    updateTicketStatus,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'appearance' | 'cards' | 'payment-config' | 'orders' | 'services' | 'users' | 'reports' | 'tickets'
  >('appearance');

  // Sub-tab under Cards
  const [cardSection, setCardSection] = useState<'hosting' | 'vps' | 'domain' | 'features' | 'testimonials'>('hosting');

  // Theme Form state
  const [themeForm, setThemeForm] = useState(theme);
  const [themeSaved, setThemeSaved] = useState(false);

  // Payment Form state
  const [payForm, setPayForm] = useState(paymentConfig);
  const [paySaved, setPaySaved] = useState(false);

  // Modal states for CRUD cards
  const [hostingModalOpen, setHostingModalOpen] = useState(false);
  const [editingHosting, setEditingHosting] = useState<HostingPackage | null>(null);

  const [vpsModalOpen, setVpsModalOpen] = useState(false);
  const [editingVps, setEditingVps] = useState<VpsPackage | null>(null);

  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<DomainExtension | null>(null);

  const [testiModalOpen, setTestiModalOpen] = useState(false);
  const [editingTesti, setEditingTesti] = useState<TestimonialItem | null>(null);

  // Reply ticket modal
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyTicketText, setReplyTicketText] = useState('');

  // Orders Filter
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Total Analytics
  const totalRevenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'active')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const activeServicesCount = customerServices.filter((s) => s.status === 'active').length;
  const customerCount = users.filter((u) => u.role === 'customer').length;

  // Preset Colors for Quick Selection
  const colorPresets = [
    { label: 'Royal Blue (Standar)', hex: '#2563eb' },
    { label: 'Emerald Green', hex: '#059669' },
    { label: 'Indigo Modern', hex: '#4f46e5' },
    { label: 'Violet Premium', hex: '#7c3aed' },
    { label: 'Sky Cyan', hex: '#0284c7' },
    { label: 'Crimson Rose', hex: '#e11d48' },
  ];

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    updateTheme(themeForm);
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 2500);
  };

  const handleSavePaymentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentConfig(payForm);
    setPaySaved(true);
    setTimeout(() => setPaySaved(false), 2500);
  };

  const handleSaveHostingPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHosting) return;
    if (hostingPackages.some((p) => p.id === editingHosting.id)) {
      updateHostingPackage(editingHosting.id, editingHosting);
    } else {
      addHostingPackage(editingHosting);
    }
    setHostingModalOpen(false);
    setEditingHosting(null);
  };

  const handleSaveVpsPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVps) return;
    if (vpsPackages.some((v) => v.id === editingVps.id)) {
      updateVpsPackage(editingVps.id, editingVps);
    } else {
      addVpsPackage(editingVps);
    }
    setVpsModalOpen(false);
    setEditingVps(null);
  };

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDomain) return;
    if (domainExtensions.some((d) => d.id === editingDomain.id)) {
      updateDomainExtension(editingDomain.id, editingDomain);
    } else {
      addDomainExtension(editingDomain);
    }
    setDomainModalOpen(false);
    setEditingDomain(null);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTesti) return;
    if (testimonials.some((t) => t.id === editingTesti.id)) {
      updateTestimonial(editingTesti.id, editingTesti);
    } else {
      addTestimonial(editingTesti);
    }
    setTestiModalOpen(false);
    setEditingTesti(null);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.userName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Admin Bar */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/30">
                Panel Kontrol Administrator & CMS
              </span>
              <span className="text-xs text-slate-400">Hostuner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              Sistem Manajemen & Kustomisasi Konten
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Atur tampilan, edit card paket/layanan, konfigurasi subdomain pembayaran, dan kelola pesanan pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website Live</span>
            </button>
            <button
              onClick={() => setCurrentView('client-dashboard')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow"
            >
              Area Klien
            </button>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'appearance'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Kustomisasi Tampilan & Tema</span>
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'cards'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Manajemen Konten Card</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cards');
              setCardSection('testimonials');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'cards' && cardSection === 'testimonials'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Review & Testimoni ({testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payment-config')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'payment-config'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subdomain Pembayaran</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Pesanan & Transaksi ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'services'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Layanan Pelanggan ({customerServices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pengguna ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'tickets'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Tiket Bantuan ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'reports'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Laporan Penjualan</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: KUSTOMISASI TAMPILAN & TEMA (SESUAI REQUEST USER)       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'appearance' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Kustomisasi Tampilan & Branding Sistem (CMS)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Admin dapat secara bebas mengubah skema warna tema, nama instansi, slogan, headline hero, dan banner promosi secara instan.
                </p>
              </div>

              {themeSaved && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>Perubahan Tampilan Berhasil Disimpan & Diterapkan!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveTheme} className="space-y-6">
              {/* Color Scheme Picker */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  1. Skema Warna Utama Tema (Brand Accent Color)
                </label>
                <p className="text-xs text-slate-500">
                  Pilih warna aksen sistem. Seluruh tombol, badge, dan highlight pada website pelanggan akan berubah mengikuti pilihan ini secara langsung!
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {colorPresets.map((cp) => (
                    <button
                      key={cp.hex}
                      type="button"
                      onClick={() => setThemeForm({ ...themeForm, primaryColor: cp.hex })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                        themeForm.primaryColor === cp.hex
                          ? 'border-slate-900 bg-white shadow-md ring-2 ring-purple-500'
                          : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300"
                        style={{ backgroundColor: cp.hex }}
                      />
                      <span>{cp.label}</span>
                    </button>
                  ))}

                  {/* Custom Hex input */}
                  <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">Custom Hex:</span>
                    <input
                      type="color"
                      value={themeForm.primaryColor}
                      onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      value={themeForm.primaryColor}
                      onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                      className="w-24 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-200 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Company Info & Logo Text */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nama Perusahaan / Organisasi
                  </label>
                  <input
                    type="text"
                    value={themeForm.companyName}
                    onChange={(e) => setThemeForm({ ...themeForm, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Teks Logo (Kata 1)
                  </label>
                  <input
                    type="text"
                    value={themeForm.logoTextFirst}
                    onChange={(e) => setThemeForm({ ...themeForm, logoTextFirst: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Teks Logo Aksen (Kata 2)
                  </label>
                  <input
                    type="text"
                    value={themeForm.logoTextSecond}
                    onChange={(e) => setThemeForm({ ...themeForm, logoTextSecond: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              {/* Tagline & Hero Copy */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Judul Utama Banner Hero (H1)
                  </label>
                  <input
                    type="text"
                    value={themeForm.heroTitle}
                    onChange={(e) => setThemeForm({ ...themeForm, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Subjudul / Deskripsi Banner Hero
                  </label>
                  <textarea
                    rows={2}
                    value={themeForm.heroSubtitle}
                    onChange={(e) => setThemeForm({ ...themeForm, heroSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              {/* Top Banner Announcement */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Top Bar Pengumuman Promosi
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={themeForm.topBannerEnabled}
                      onChange={(e) => setThemeForm({ ...themeForm, topBannerEnabled: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Tampilkan Banner Atas</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={themeForm.topBannerText}
                  onChange={(e) => setThemeForm({ ...themeForm, topBannerText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">No. WhatsApp / Telepon</label>
                  <input
                    type="text"
                    value={themeForm.phone}
                    onChange={(e) => setThemeForm({ ...themeForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Layanan</label>
                  <input
                    type="email"
                    value={themeForm.email}
                    onChange={(e) => setThemeForm({ ...themeForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Kantor</label>
                  <input
                    type="text"
                    value={themeForm.address}
                    onChange={(e) => setThemeForm({ ...themeForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Kembalikan semua tampilan ke setelan default Hostuner?')) {
                      resetTheme();
                      setThemeForm(theme);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Tampilan Live</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: MANAJEMEN KONTEN CARD (SESUAI REQUEST USER)            */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'cards' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Manajemen Konten Card & Layanan (CMS)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ubah data card pada halaman depan: tambah paket baru, ganti harga, ubah kuota diskon, dan sembunyikan card.
                </p>
              </div>

              {/* Card Sub-Navigation */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  onClick={() => setCardSection('hosting')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    cardSection === 'hosting' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Card Hosting ({hostingPackages.length})
                </button>
                <button
                  onClick={() => setCardSection('vps')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    cardSection === 'vps' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Card Cloud VPS ({vpsPackages.length})
                </button>
                <button
                  onClick={() => setCardSection('domain')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    cardSection === 'domain' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Harga Domain ({domainExtensions.length})
                </button>
                <button
                  onClick={() => setCardSection('testimonials')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    cardSection === 'testimonials' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Review & Testimoni ({testimonials.length})
                </button>
              </div>
            </div>

            {/* SECTION: HOSTING CARDS */}
            {cardSection === 'hosting' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Kembalikan paket hosting ke katalog standar Hostuner (Hosting Mini, Pro, Enterprise) dari database?')) {
                        resetHostingPackages();
                      }
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Kembalikan Default (3 Paket)</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingHosting({
                        id: `pkg-${Date.now()}`,
                        name: 'Paket Hosting Baru',
                        slug: 'paket-baru',
                        whmcsPid: 4,
                        tagline: 'Deskripsi singkat paket baru...',
                        monthlyPrice: 50000,
                        annualDiscountPrice: 25000,
                        description: 'Spesifikasi hosting...',
                        storage: '10 GB NVMe SSD',
                        bandwidth: 'Unlimited Bandwidth',
                        websites: '2 Website',
                        emailAccounts: '10 Email & FTP',
                        databases: '5 Database MySQL',
                        cPanel: true,
                        freeDomain: false,
                        freeSSL: true,
                        isPopular: false,
                        isActive: true,
                        displayOrder: hostingPackages.length + 1,
                      });
                      setHostingModalOpen(true);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Card Paket Hosting</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {hostingPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`p-6 rounded-2xl border-2 transition space-y-4 flex flex-col justify-between ${
                        pkg.isActive ? 'border-slate-200 bg-white' : 'border-dashed border-slate-300 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            pkg.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {pkg.isActive ? 'AKTIF TAMPIL' : 'DISEMBUNYIKAN'}
                          </span>
                          {pkg.isPopular && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              Badge Populer
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{pkg.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{pkg.tagline}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-xs text-slate-400 line-through">
                            Normal: {formatRupiah(pkg.monthlyPrice)}/bln
                          </p>
                          <p className="text-xl font-extrabold text-blue-700">
                            {formatRupiah(pkg.annualDiscountPrice)}
                            <span className="text-xs text-slate-500"> /bln (tahunan)</span>
                          </p>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1 font-medium pt-2 border-t border-slate-100">
                          <p>• {pkg.storage}</p>
                          <p>• {pkg.bandwidth}</p>
                          <p>• {pkg.websites}</p>
                          <p>• Gratis Domain: {pkg.freeDomain ? 'YA' : 'TIDAK'}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setEditingHosting(pkg);
                            setHostingModalOpen(true);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Card</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Hapus paket "${pkg.name}"?`)) {
                              deleteHostingPackage(pkg.id);
                            }
                          }}
                          className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: VPS CARDS */}
            {cardSection === 'vps' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setEditingVps({
                        id: `vps-${Date.now()}`,
                        name: 'Cloud VPS Kustom',
                        cpu: '2 vCPU',
                        ram: '4 GB RAM',
                        storage: '60 GB NVMe',
                        bandwidth: '3 TB Bandwidth',
                        ipPublic: '1 Dedicated IPv4',
                        monthlyPrice: 200000,
                        osOptions: ['Ubuntu 22.04', 'Debian 12', 'AlmaLinux 9'],
                        isPopular: false,
                        isActive: true,
                      });
                      setVpsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Card Cloud VPS</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {vpsPackages.map((vps) => (
                    <div
                      key={vps.id}
                      className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-slate-900">{vps.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            vps.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {vps.isActive ? 'AKTIF' : 'NONAKTIF'}
                          </span>
                        </div>

                        <p className="text-xl font-extrabold text-indigo-700">
                          {formatRupiah(vps.monthlyPrice)}/bln
                        </p>

                        <div className="text-xs text-slate-600 space-y-1 font-medium pt-2 border-t border-slate-100">
                          <p>• {vps.cpu}</p>
                          <p>• {vps.ram}</p>
                          <p>• {vps.storage}</p>
                          <p>• {vps.bandwidth}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setEditingVps(vps);
                            setVpsModalOpen(true);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit VPS</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Hapus paket VPS "${vps.name}"?`)) {
                              deleteVpsPackage(vps.id);
                            }
                          }}
                          className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: DOMAIN EXTENSIONS */}
            {cardSection === 'domain' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setEditingDomain({
                        id: `dom-${Date.now()}`,
                        tld: '.my.id',
                        priceRegister: 25000,
                        priceRenew: 35000,
                        priceTransfer: 30000,
                        isPopular: false,
                        isPromo: false,
                        isActive: true,
                      });
                      setDomainModalOpen(true);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Ekstensi Domain (TLD)</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold">
                        <th className="pb-3">Ekstensi (TLD)</th>
                        <th className="pb-3">Harga Pendaftaran</th>
                        <th className="pb-3">Harga Perpanjangan</th>
                        <th className="pb-3">Promo</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {domainExtensions.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50">
                          <td className="py-3 font-mono font-extrabold text-blue-600">{d.tld}</td>
                          <td className="py-3 font-bold text-slate-900">{formatRupiah(d.priceRegister)}</td>
                          <td className="py-3 text-slate-600">{formatRupiah(d.priceRenew)}</td>
                          <td className="py-3">
                            {d.isPromo ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                                PROMO
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              d.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {d.isActive ? 'AKTIF' : 'NONAKTIF'}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingDomain(d);
                                setDomainModalOpen(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus ekstensi ${d.tld}?`)) {
                                  deleteDomainExtension(d.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION: REVIEW & TESTIMONI PELANGGAN (SESUAI REQUEST USER) */}
            {cardSection === 'testimonials' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <MessageSquareQuote className="w-4 h-4 text-purple-600" />
                      <span>Manajemen Review & Testimoni Pelanggan ({testimonials.length})</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kelola ulasan nyata pelanggan yang tampil di landing page website. Anda dapat menambah ulasan baru, mengedit kata-kata testimoni, mengganti rating bintang, atau menyembunyikan ulasan.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTesti({
                        id: `testi-${Date.now()}`,
                        name: '',
                        role: 'Customer',
                        company: 'Bisnis Online',
                        comment: '',
                        rating: 5,
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                        isActive: true,
                      });
                      setTestiModalOpen(true);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Review Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className={`p-6 rounded-2xl border-2 transition space-y-4 flex flex-col justify-between ${
                        t.isActive ? 'border-slate-200 bg-white shadow-sm' : 'border-dashed border-slate-300 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              t.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {t.isActive ? 'AKTIF DI LANDING PAGE' : 'DISEMBUNYIKAN'}
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: t.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          "{t.comment}"
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                          {t.avatar ? (
                            <img
                              src={t.avatar}
                              alt={t.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {t.name ? t.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate">{t.name || 'Tanpa Nama'}</h5>
                            <p className="text-[11px] text-slate-500 truncate">
                              {t.role} • {t.company}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => updateTestimonial(t.id, { isActive: !t.isActive })}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                            t.isActive
                              ? 'text-slate-600 hover:bg-slate-100'
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {t.isActive ? 'Sembunyikan' : 'Aktifkan'}
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTesti(t);
                              setTestiModalOpen(true);
                            }}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            title="Edit Review"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus review dari "${t.name}"?`)) {
                                deleteTestimonial(t.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: SUBDOMAIN PEMBAYARAN CONFIG (SESUAI REQUEST USER)       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'payment-config' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Konfigurasi Integrasi Subdomain Pembayaran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesuai arahan: Subdomain pembayaran Anda yang sudah jadi akan menerima GET request parameter transaksi dari pesanan pelanggan.
                </p>
              </div>

              {paySaved && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Konfigurasi Pembayaran Tersimpan!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSavePaymentConfig} className="space-y-5">
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Petunjuk Integrasi Subdomain</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Ketika pelanggan mengonfirmasi pesanan di sistem, sistem akan mengarahkan pelanggan (redirect GET) ke alamat URL subdomain Anda beserta parameter tagihan (invoice, amount, customer name, email, dan callback return URL).
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  URL Subdomain Pembayaran (Base URL)
                </label>
                <input
                  type="url"
                  value={payForm.subdomainUrl}
                  onChange={(e) => setPayForm({ ...payForm, subdomainUrl: e.target.value })}
                  placeholder="https://billing.hostuner.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Format Pola Query Parameter (Template GET URL)
                </label>
                <input
                  type="text"
                  value={payForm.urlTemplate}
                  onChange={(e) => setPayForm({ ...payForm, urlTemplate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tag pengganti otomatis: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">{'{subdomain}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">{'{invoice}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">{'{amount}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">{'{customer}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">{'{email}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">{'{return_url}'}</code>
                </p>
              </div>

              {/* Tax Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tarif Pajak PPN (%)
                  </label>
                  <input
                    type="number"
                    value={payForm.taxPercent}
                    onChange={(e) => setPayForm({ ...payForm, taxPercent: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={payForm.simulationMode}
                      onChange={(e) => setPayForm({ ...payForm, simulationMode: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Aktifkan Tombol Simulasi Sukses di Sisi Pelanggan (Mode Demo)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow"
                >
                  Simpan Konfigurasi Subdomain
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: ORDERS & TRANSACTIONS MANAGEMENT                       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Daftar Pesanan & Verifikasi Pembayaran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola status transaksi pelanggan, verifikasi manual, dan aktifkan layanan hosting secara langsung.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Cari invoice / pelanggan..."
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending_payment">Belum Dibayar</option>
                  <option value="paid">Lunas (Paid)</option>
                  <option value="active">Layanan Aktif</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold">
                    <th className="pb-3">No. Invoice</th>
                    <th className="pb-3">Pelanggan</th>
                    <th className="pb-3">Item Pesanan</th>
                    <th className="pb-3">Total Biaya</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Ubah Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="py-3.5 font-mono font-bold text-blue-600">
                        {ord.orderNumber}
                        <span className="block text-[10px] text-slate-400 font-normal">{formatDate(ord.createdAt)}</span>
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900">{ord.userName}</p>
                        <p className="text-[11px] text-slate-500">{ord.userEmail}</p>
                      </td>
                      <td className="py-3.5">
                        <p className="font-medium text-slate-800">{ord.items[0]?.name}</p>
                        {ord.items[0]?.domainName && (
                          <span className="text-[11px] text-blue-600 font-bold block">
                            Domain: {ord.items[0]?.domainName}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 font-extrabold text-slate-900">
                        {formatRupiah(ord.total)}
                      </td>
                      <td className="py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === 'paid' || ord.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'pending_payment'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {ord.status === 'paid' ? 'LUNAS' : ord.status === 'pending_payment' ? 'MENUNGGU BAYAR' : ord.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-1.5">
                        {ord.status === 'pending_payment' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'paid')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                          >
                            Tandai Lunas
                          </button>
                        )}
                        {ord.status !== 'active' && ord.status !== 'cancelled' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'active')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                          >
                            Aktifkan Layanan
                          </button>
                        )}
                        {ord.status !== 'cancelled' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'cancelled')}
                            className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition"
                          >
                            Batal
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: ACTIVE SERVICES MANAGEMENT                             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900">
                Manajemen Seluruh Layanan Hosting & VPS Pelanggan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring IP address, tanggal kedaluwarsa, dan status operasional akun pelanggan.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold">
                    <th className="pb-3">Layanan</th>
                    <th className="pb-3">Domain Terhubung</th>
                    <th className="pb-3">IP Address</th>
                    <th className="pb-3">cPanel User</th>
                    <th className="pb-3">Jatuh Tempo</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customerServices.map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{srv.serviceName}</td>
                      <td className="py-3 text-blue-600 font-bold">{srv.domainName}</td>
                      <td className="py-3 font-mono text-slate-600">{srv.ipAddress}</td>
                      <td className="py-3 font-mono text-slate-600">{srv.cpanelUsername}</td>
                      <td className="py-3 font-bold text-rose-600">{formatDate(srv.expiryDate)}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {srv.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: USERS MANAGEMENT                                       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900">
                Manajemen Akun Pengguna & Hak Akses (RF-02)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar seluruh akun pelanggan dan admin terdaftar di sistem.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold">
                    <th className="pb-3">Nama</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">No. Telepon</th>
                    <th className="pb-3">Peran (Role)</th>
                    <th className="pb-3">Status Akun</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{u.name}</td>
                      <td className="py-3 text-slate-600">{u.email}</td>
                      <td className="py-3 text-slate-600">{u.phone}</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {u.isActive ? 'AKTIF' : 'NONAKTIF'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => updateUser(u.id, { isActive: !u.isActive })}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-100"
                        >
                          {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: TICKETS SUPPORT MANAGEMENT                             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'tickets' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900">
                Pusat Tanggapan Tiket Bantuan Pelanggan (RF-13)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Respon pertanyaan dan laporan kendala teknis dari pelanggan.
              </p>
            </div>

            <div className="space-y-4">
              {tickets.map((tkt) => (
                <div key={tkt.id} className="p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{tkt.subject}</h4>
                      <p className="text-xs text-slate-500">
                        Dari: <strong>{tkt.userName}</strong> ({tkt.userEmail}) • Kategori: {tkt.category}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      tkt.status === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tkt.status}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {tkt.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl text-xs ${
                          m.sender === 'admin'
                            ? 'bg-purple-50 text-purple-950 border border-purple-200 ml-4'
                            : 'bg-slate-50 text-slate-800 mr-4 border border-slate-200'
                        }`}
                      >
                        <span className="font-bold block mb-0.5">{m.senderName}:</span>
                        <p>{m.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <div className="pt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Ketik tanggapan admin kepada pelanggan..."
                      value={replyTicketId === tkt.id ? replyTicketText : ''}
                      onFocus={() => setReplyTicketId(tkt.id)}
                      onChange={(e) => {
                        setReplyTicketId(tkt.id);
                        setReplyTicketText(e.target.value);
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      onClick={() => {
                        if (!replyTicketText.trim()) return;
                        replyTicket(tkt.id, replyTicketText.trim());
                        setReplyTicketText('');
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                    >
                      Balas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: SALES REPORT & EXPORT                                  */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Laporan Transaksi Penjualan Layanan Hosting (RF-10)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekapitulasi total pendapatan transaksi lunas CV. Buana Logika Utama.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Cetak / Ekspor Laporan
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
                <span className="text-xs font-bold text-blue-800 uppercase">Total Omset Penjualan</span>
                <p className="text-2xl font-black text-blue-900">{formatRupiah(totalRevenue)}</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <span className="text-xs font-bold text-emerald-800 uppercase">Total Pesanan Sukses</span>
                <p className="text-2xl font-black text-emerald-900">
                  {orders.filter((o) => o.status === 'paid' || o.status === 'active').length} Transaksi
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                <span className="text-xs font-bold text-purple-800 uppercase">Total Akun Pelanggan</span>
                <p className="text-2xl font-black text-purple-900">{customerCount} Pengguna</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: EDIT / TAMBAH PAKET HOSTING CARD */}
      {hostingModalOpen && editingHosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Formulir Card Paket Hosting (CMS)
              </h3>
              <button onClick={() => setHostingModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveHostingPackage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Paket</label>
                <input
                  type="text"
                  required
                  value={editingHosting.name}
                  onChange={(e) => setEditingHosting({ ...editingHosting, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Slug URL</label>
                  <input
                    type="text"
                    required
                    value={editingHosting.slug}
                    onChange={(e) => setEditingHosting({ ...editingHosting, slug: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WHMCS Product ID (PID)</label>
                  <input
                    type="number"
                    value={editingHosting.whmcsPid || ''}
                    onChange={(e) => setEditingHosting({ ...editingHosting, whmcsPid: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Contoh: 40, 4, 5"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-purple-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tagline Singkat</label>
                <input
                  type="text"
                  value={editingHosting.tagline}
                  onChange={(e) => setEditingHosting({ ...editingHosting, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Harga Bulanan Normal (Rp)</label>
                  <input
                    type="number"
                    value={editingHosting.monthlyPrice}
                    onChange={(e) => setEditingHosting({ ...editingHosting, monthlyPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Harga Promo Tahunan/Bulan (Rp)</label>
                  <input
                    type="number"
                    value={editingHosting.annualDiscountPrice}
                    onChange={(e) => setEditingHosting({ ...editingHosting, annualDiscountPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-blue-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kapasitas Storage</label>
                  <input
                    type="text"
                    value={editingHosting.storage}
                    onChange={(e) => setEditingHosting({ ...editingHosting, storage: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bandwidth</label>
                  <input
                    type="text"
                    value={editingHosting.bandwidth}
                    onChange={(e) => setEditingHosting({ ...editingHosting, bandwidth: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Website</label>
                  <input
                    type="text"
                    value={editingHosting.websites}
                    onChange={(e) => setEditingHosting({ ...editingHosting, websites: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Akun Email & FTP</label>
                  <input
                    type="text"
                    value={editingHosting.emailAccounts || ''}
                    onChange={(e) => setEditingHosting({ ...editingHosting, emailAccounts: e.target.value })}
                    placeholder="Contoh: 100 Akun Email & FTP"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Database MySQL</label>
                  <input
                    type="text"
                    value={editingHosting.databases || ''}
                    onChange={(e) => setEditingHosting({ ...editingHosting, databases: e.target.value })}
                    placeholder="Contoh: 5 Database MySQL"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi Tambahan / Fasilitas</label>
                <textarea
                  rows={2}
                  value={editingHosting.description || ''}
                  onChange={(e) => setEditingHosting({ ...editingHosting, description: e.target.value })}
                  placeholder="Keterangan fasilitas atau OS..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHosting.freeDomain}
                    onChange={(e) => setEditingHosting({ ...editingHosting, freeDomain: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Sertakan Gratis Domain</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHosting.isPopular}
                    onChange={(e) => setEditingHosting({ ...editingHosting, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Tandai Badge "Paling Populer"</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHosting.isActive}
                    onChange={(e) => setEditingHosting({ ...editingHosting, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Aktifkan & Tampilkan Card</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setHostingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow"
                >
                  Simpan Card Hosting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / TAMBAH VPS CARD */}
      {vpsModalOpen && editingVps && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Formulir Card Cloud VPS (CMS)</h3>
              <button onClick={() => setVpsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveVpsPackage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Paket VPS</label>
                <input
                  type="text"
                  required
                  value={editingVps.name}
                  onChange={(e) => setEditingVps({ ...editingVps, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">vCPU Core</label>
                  <input
                    type="text"
                    value={editingVps.cpu}
                    onChange={(e) => setEditingVps({ ...editingVps, cpu: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ECC RAM</label>
                  <input
                    type="text"
                    value={editingVps.ram}
                    onChange={(e) => setEditingVps({ ...editingVps, ram: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Storage NVMe</label>
                  <input
                    type="text"
                    value={editingVps.storage}
                    onChange={(e) => setEditingVps({ ...editingVps, storage: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Harga Bulanan (Rp)</label>
                  <input
                    type="number"
                    value={editingVps.monthlyPrice}
                    onChange={(e) => setEditingVps({ ...editingVps, monthlyPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVpsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow"
                >
                  Simpan Card VPS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / TAMBAH DOMAIN EXTENSION */}
      {domainModalOpen && editingDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Kelola Ekstensi Domain (TLD)</h3>
              <button onClick={() => setDomainModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveDomain} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ekstensi (cth: .com, .id)</label>
                <input
                  type="text"
                  required
                  value={editingDomain.tld}
                  onChange={(e) => setEditingDomain({ ...editingDomain, tld: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Harga Registrasi Baru (Rp)</label>
                <input
                  type="number"
                  required
                  value={editingDomain.priceRegister}
                  onChange={(e) => setEditingDomain({ ...editingDomain, priceRegister: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Harga Perpanjangan (Rp)</label>
                <input
                  type="number"
                  required
                  value={editingDomain.priceRenew}
                  onChange={(e) => setEditingDomain({ ...editingDomain, priceRenew: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDomain.isPromo}
                    onChange={(e) => setEditingDomain({ ...editingDomain, isPromo: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Tandai Promo</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDomain.isActive}
                    onChange={(e) => setEditingDomain({ ...editingDomain, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Aktif Digunakan</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDomainModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow"
                >
                  Simpan Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / TAMBAH REVIEW & TESTIMONI PELANGGAN */}
      {testiModalOpen && editingTesti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-purple-600" />
                <span>Formulir Review & Testimoni Pelanggan</span>
              </h3>
              <button
                type="button"
                onClick={() => setTestiModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Pelanggan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={editingTesti.name}
                  onChange={(e) => setEditingTesti({ ...editingTesti, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Jabatan / Profesi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Founder & CEO"
                    value={editingTesti.role}
                    onChange={(e) => setEditingTesti({ ...editingTesti, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nama Perusahaan / Bisnis</label>
                  <input
                    type="text"
                    placeholder="Contoh: Santoso Tech Solo"
                    value={editingTesti.company}
                    onChange={(e) => setEditingTesti({ ...editingTesti, company: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rating Bintang</label>
                <select
                  value={editingTesti.rating}
                  onChange={(e) => setEditingTesti({ ...editingTesti, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang - Sangat Puas)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Bintang - Puas)</option>
                  <option value={3}>⭐⭐⭐ (3 Bintang - Cukup)</option>
                  <option value={2}>⭐⭐ (2 Bintang - Kurang)</option>
                  <option value={1}>⭐ (1 Bintang - Tidak Puas)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Isi Ulasan / Testimoni</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan ulasan pelanggan mengenai performa website, stabilitas server, atau bantuan teknis..."
                  value={editingTesti.comment}
                  onChange={(e) => setEditingTesti({ ...editingTesti, comment: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">URL Foto Profil / Avatar</label>
                <div className="flex items-center gap-3">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={editingTesti.avatar}
                    onChange={(e) => setEditingTesti({ ...editingTesti, avatar: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  {editingTesti.avatar ? (
                    <img
                      src={editingTesti.avatar}
                      alt="Preview"
                      className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {editingTesti.name ? editingTesti.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTesti.isActive}
                    onChange={(e) => setEditingTesti({ ...editingTesti, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600"
                  />
                  <span>Tampilkan ulasan ini secara aktif di Landing Page Website</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTestiModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20"
                >
                  Simpan Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
