import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/format';
import {
  Server,
  Globe,
  Receipt,
  LifeBuoy,
  User as UserIcon,
  LogOut,
  Plus,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Send,
  Printer,
  X,
  CreditCard,
  Key,
  Shield,
} from 'lucide-react';
import { CustomerService, SupportTicket, Order } from '../types';

export const ClientDashboardPage: React.FC = () => {
  const {
    currentUser,
    customerServices,
    customerDomains,
    orders,
    tickets,
    createTicket,
    replyTicket,
    renewCustomerService,
    updateUser,
    setCurrentView,
    activeInvoiceId,
    setActiveInvoiceId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'domains' | 'invoices' | 'tickets' | 'profile'>('overview');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('hosting');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Profile edit states
  const [profName, setProfName] = useState(currentUser?.name || '');
  const [profPhone, setProfPhone] = useState(currentUser?.phone || '');
  const [profCompany, setProfCompany] = useState(currentUser?.company || '');
  const [profAddress, setProfAddress] = useState(currentUser?.address || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Filter user specific data
  const myServices = customerServices.filter((s) => s.userId === currentUser?.id);
  const myDomains = customerDomains.filter((d) => d.userId === currentUser?.id);
  const myOrders = orders.filter((o) => o.userId === currentUser?.id);
  const myTickets = tickets.filter((t) => t.userId === currentUser?.id);

  // Find active invoice if activeInvoiceId is set
  const selectedInvoice = activeInvoiceId ? myOrders.find((o) => o.id === activeInvoiceId) : null;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    createTicket(ticketSubject, ticketCategory, ticketPriority, ticketMessage);
    setTicketSubject('');
    setTicketMessage('');
    setTicketModalOpen(false);
    showToast('Tiket bantuan berhasil dibuat. Tim support akan segera merespon kendala Anda.');
  };

  const handleReplyTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyMessage.trim()) return;
    replyTicket(activeTicket.id, replyMessage.trim());
    setReplyMessage('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUser(currentUser.id, {
      name: profName,
      phone: profPhone,
      company: profCompany,
      address: profAddress,
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleRenewService = (service: CustomerService) => {
    renewCustomerService(service.id, 12);
    showToast(`Layanan ${service.serviceName} berhasil diperpanjang untuk 1 tahun ke depan.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-md shadow-blue-500/20">
              {currentUser?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {currentUser?.name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                  Pelanggan
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser?.email} • {currentUser?.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Katalog Layanan
            </button>
            <button
              onClick={() => {
                setActiveTab('tickets');
                setTicketModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buka Tiket Bantuan</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation (3 Cols) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-left ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Server className="w-4 h-4" />
                <span>Ringkasan Akun</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-left ${
                  activeTab === 'services'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4" />
                  <span>Layanan Saya</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'services' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {myServices.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('domains')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-left ${
                  activeTab === 'domains'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4" />
                  <span>Domain Saya</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'domains' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {myDomains.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('invoices')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-left ${
                  activeTab === 'invoices'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-4 h-4" />
                  <span>Tagihan & Invoices</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'invoices' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {myOrders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('tickets')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-left ${
                  activeTab === 'tickets'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LifeBuoy className="w-4 h-4" />
                  <span>Tiket Bantuan</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'tickets' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {myTickets.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-left ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Pengaturan Profil</span>
              </button>
            </div>
          </div>

          {/* Main Workspace (9 Cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Layanan Aktif
                      </span>
                      <Server className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{myServices.length}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">Beroperasi Normal</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Domain Aktif
                      </span>
                      <Globe className="w-4 h-4 text-indigo-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{myDomains.length}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">Terkoneksi DNS</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Total Pesanan
                      </span>
                      <Receipt className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{myOrders.length}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">Riwayat Transaksi</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Tiket Bantuan
                      </span>
                      <LifeBuoy className="w-4 h-4 text-rose-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{myTickets.length}</p>
                    <p className="text-[11px] text-blue-600 font-semibold">Support 24 Jam</p>
                  </div>
                </div>

                {/* Recent Services List */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Layanan Hosting & VPS Terdaftar
                    </h3>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  {myServices.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {myServices.map((srv) => (
                        <div key={srv.id} className="py-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                              <Server className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{srv.serviceName}</p>
                              <p className="text-xs text-slate-500 font-medium">
                                Domain: <strong className="text-blue-600">{srv.domainName}</strong> • IP: {srv.ipAddress}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                              Aktif s/d {formatDate(srv.expiryDate)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      Belum ada layanan aktif. Silakan lakukan pemesanan di menu katalog.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: SERVICES */}
            {activeTab === 'services' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Manajemen Layanan Hosting & VPS
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kelola paket hosting, akses cPanel, server nameserver, dan tanggal perpanjangan.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentView('home')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Beli Layanan Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {myServices.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 hover:border-slate-300 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-slate-900">
                              {srv.serviceName}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {srv.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Domain Utama: <strong className="text-blue-600">{srv.domainName}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRenewService(srv)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Perpanjang Layanan</span>
                          </button>
                        </div>
                      </div>

                      {/* Detail Info Badges */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-200/60">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">IP Address</span>
                          <span className="font-mono font-bold text-slate-800">{srv.ipAddress}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Username cPanel</span>
                          <span className="font-mono font-bold text-slate-800">{srv.cpanelUsername || 'cahya_adm'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Nameservers</span>
                          <span className="text-slate-700 font-medium">ns1.buanahost.com</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Jatuh Tempo</span>
                          <span className="font-bold text-rose-600">{formatDate(srv.expiryDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: DOMAINS */}
            {activeTab === 'domains' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Manajemen Domain Anda
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Daftar nama domain, status registrasi, dan tanggal kedaluwarsa domain.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentView('home')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Daftar Domain Baru</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold">
                        <th className="pb-3">Nama Domain</th>
                        <th className="pb-3">Tgl Registrasi</th>
                        <th className="pb-3">Jatuh Tempo</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myDomains.map((dom) => (
                        <tr key={dom.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 font-bold text-slate-900">
                            {dom.domainName}
                          </td>
                          <td className="py-3.5 text-slate-600">
                            {formatDate(dom.registrationDate)}
                          </td>
                          <td className="py-3.5 font-bold text-slate-800">
                            {formatDate(dom.expiryDate)}
                          </td>
                          <td className="py-3.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {dom.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => showToast(`DNS untuk domain ${dom.domainName}: NS diarahkan ke ns1.buanahost.com & ns2.buanahost.com`)}
                              className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                            >
                              Kelola DNS
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: INVOICES */}
            {activeTab === 'invoices' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Riwayat Tagihan & Faktur (Invoices)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Daftar seluruh invoice transaksi pemesanan layanan Anda beserta status pembayaran.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold">
                        <th className="pb-3">No. Invoice</th>
                        <th className="pb-3">Tanggal</th>
                        <th className="pb-3">Rincian Layanan</th>
                        <th className="pb-3">Total Biaya</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 font-mono font-bold text-blue-600">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3.5 text-slate-600">
                            {formatDate(ord.createdAt)}
                          </td>
                          <td className="py-3.5 text-slate-800 font-medium">
                            {ord.items[0]?.name || 'Paket Hosting'}
                          </td>
                          <td className="py-3.5 font-extrabold text-slate-900">
                            {formatRupiah(ord.total)}
                          </td>
                          <td className="py-3.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ord.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'pending_payment'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {ord.status === 'paid' ? 'LUNAS' : ord.status === 'pending_payment' ? 'BELUM DIBAYAR' : ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => setActiveInvoiceId(ord.id)}
                              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition inline-flex items-center gap-1"
                            >
                              <span>Lihat Faktur</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: TICKETS */}
            {activeTab === 'tickets' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Pusat Bantuan & Tiket Support
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kirim pertanyaan, laporan kendala teknis, atau permintaan perpanjangan layanan.
                    </p>
                  </div>
                  <button
                    onClick={() => setTicketModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buat Tiket Baru</span>
                  </button>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                  {myTickets.map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            tkt.status === 'answered'
                              ? 'bg-blue-100 text-blue-800'
                              : tkt.status === 'open'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {tkt.status === 'answered' ? 'DIJAWAB ADMIN' : tkt.status === 'open' ? 'MENUNGGU RESPON' : 'SELESAI'}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">• {tkt.category}</span>
                        </div>
                        <span className="text-xs text-slate-400">{formatDate(tkt.createdAt)}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{tkt.subject}</h4>

                      {/* Chat Messages */}
                      <div className="space-y-2.5 pt-2 border-t border-slate-200/60">
                        {tkt.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-3 rounded-xl text-xs ${
                              msg.sender === 'admin'
                                ? 'bg-blue-100/70 border border-blue-200 text-blue-950 ml-4'
                                : 'bg-white border border-slate-200 text-slate-800 mr-4'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                              <span>{msg.senderName}</span>
                              <span className="text-slate-400 font-normal">{msg.timestamp}</span>
                            </div>
                            <p className="leading-relaxed">{msg.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Quick Reply Box */}
                      {tkt.status !== 'closed' && (
                        <div className="pt-2 flex gap-2">
                          <input
                            type="text"
                            placeholder="Tulis balasan Anda..."
                            value={activeTicket?.id === tkt.id ? replyMessage : ''}
                            onFocus={() => setActiveTicket(tkt)}
                            onChange={(e) => {
                              setActiveTicket(tkt);
                              setReplyMessage(e.target.value);
                            }}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <button
                            type="button"
                            onClick={handleReplyTicketSubmit}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Kirim</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Pengaturan Profil & Akun Pelanggan
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Perbarui nama lengkap, informasi kontak, dan alamat perusahaan Anda.
                  </p>
                </div>

                {profileSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Data profil berhasil diperbarui!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Email (Akun Utama)</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || ''}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-semibold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">No. Telepon / WhatsApp</label>
                    <input
                      type="tel"
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nama Perusahaan / Organisasi (Opsional)</label>
                    <input
                      type="text"
                      value={profCompany}
                      onChange={(e) => setProfCompany(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Penagihan</label>
                    <textarea
                      rows={3}
                      value={profAddress}
                      onChange={(e) => setProfAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow transition"
                    >
                      Simpan Perubahan Profil
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: BUKA TIKET BARU */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-100 shadow-2xl relative">
            <button
              onClick={() => setTicketModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Buat Tiket Bantuan Baru</h3>
              <p className="text-xs text-slate-500 mt-1">
                Jelaskan kendala teknis atau pertanyaan Anda secara rinci.
              </p>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kategori Kendala</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="hosting">Web Hosting (cPanel / Resource)</option>
                  <option value="domain">Domain & DNS Setup</option>
                  <option value="billing">Tagihan & Verifikasi Pembayaran</option>
                  <option value="technical">Masalah Teknis & Server</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subjek Masalah</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Contoh: Kendala SSL atau Setup Email Bisnis"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rincian Pertanyaan / Pesan</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Jelaskan pesan atau kendala Anda di sini..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
                >
                  Kirim Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL / CETAK INVOICE */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative print:p-0">
            <button
              onClick={() => setActiveInvoiceId(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Printable Sheet */}
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-blue-600">Hostuner Webhosting</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Cyber Building Jakarta • billing.hostuner.com • support@hostuner.com
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-slate-900 block">
                    {selectedInvoice.orderNumber}
                  </span>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                    selectedInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedInvoice.status === 'paid' ? 'LUNAS (PAID)' : 'BELUM DIBAYAR'}
                  </span>
                </div>
              </div>

              {/* Customer & Invoice Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Ditagihkan Kepada:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedInvoice.userName}</p>
                  <p className="text-slate-600">{selectedInvoice.userEmail}</p>
                  <p className="text-slate-600">{selectedInvoice.userPhone}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Tanggal Faktur:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{formatDate(selectedInvoice.createdAt)}</p>
                  <span className="text-slate-400 font-bold block uppercase text-[10px] mt-2">Metode Pembayaran:</span>
                  <p className="font-semibold text-slate-700">{selectedInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Deskripsi Layanan</th>
                      <th className="p-3 text-right">Durasi</th>
                      <th className="p-3 text-right">Biaya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.map((it) => (
                      <tr key={it.id}>
                        <td className="p-3 font-medium text-slate-800">
                          {it.name}
                          {it.domainName && <span className="text-blue-600 block text-[11px]">Domain: {it.domainName}</span>}
                        </td>
                        <td className="p-3 text-right text-slate-600">{it.periodMonths} Bulan</td>
                        <td className="p-3 text-right font-bold text-slate-900">{formatRupiah(it.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Calculations */}
              <div className="space-y-1.5 text-xs text-slate-600 text-right">
                <p>Subtotal: <strong className="text-slate-800">{formatRupiah(selectedInvoice.subtotal)}</strong></p>
                {selectedInvoice.discount > 0 && (
                  <p className="text-rose-600 font-bold">Diskon: -{formatRupiah(selectedInvoice.discount)}</p>
                )}
                <p>PPN 11%: <strong className="text-slate-800">{formatRupiah(selectedInvoice.tax)}</strong></p>
                <p className="text-base font-extrabold text-blue-700 pt-2 border-t border-slate-200">
                  Total Faktur: {formatRupiah(selectedInvoice.total)}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>

                {selectedInvoice.status !== 'paid' && selectedInvoice.subdomainPaymentUrl && (
                  <a
                    href={selectedInvoice.subdomainPaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <span>Bayar di Billing.hostuner.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
