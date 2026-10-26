import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/format';
import {
  Check,
  ChevronRight,
  Shield,
  HardDrive,
  Globe,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Server,
  Zap,
} from 'lucide-react';
import { HostingPackage, VpsPackage } from '../types';

export const OrderConfigPage: React.FC = () => {
  const {
    orderDraft,
    setOrderDraft,
    hostingPackages,
    vpsPackages,
    domainExtensions,
    currentUser,
    createOrderFromDraft,
    updateOrderStatus,
    paymentConfig,
    setCurrentView,
    setActiveInvoiceId,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const isHosting = orderDraft.packageType === 'hosting';
  const pkg = orderDraft.selectedPackage;
  const hPkg = isHosting ? (pkg as HostingPackage) : null;
  const vPkg = !isHosting ? (pkg as VpsPackage) : null;

  // Periods available
  const periods = [
    { months: 1, label: '1 Bulan', badge: 'Normal' },
    { months: 12, label: '12 Bulan (1 Tahun)', badge: 'Paling Populer • Diskon 50%', discount: 0.5 },
    { months: 24, label: '24 Bulan (2 Tahun)', badge: 'Diskon 55%', discount: 0.55 },
    { months: 36, label: '36 Bulan (3 Tahun)', badge: 'Hemat Maksimal 60%', discount: 0.6 },
  ];

  // Price calculations
  let basePackagePrice = 0;
  if (hPkg) {
    if (orderDraft.periodMonths >= 12) {
      basePackagePrice = hPkg.annualDiscountPrice * orderDraft.periodMonths;
    } else {
      basePackagePrice = hPkg.monthlyPrice * orderDraft.periodMonths;
    }
  } else if (vPkg) {
    basePackagePrice = vPkg.monthlyPrice * orderDraft.periodMonths;
  }

  // Domain pricing
  let calculatedDomainPrice = 0;
  if (orderDraft.domainName && orderDraft.domainOption === 'new') {
    const isFreeDomain = hPkg?.freeDomain && orderDraft.periodMonths >= 12;
    if (isFreeDomain) {
      calculatedDomainPrice = 0;
    } else {
      const ext = domainExtensions.find((d) => d.tld === orderDraft.domainTld);
      calculatedDomainPrice = ext ? ext.priceRegister : 139000;
    }
  }

  // Addons total
  let addonsTotal = 0;
  if (orderDraft.addons.whoisPrivacy) addonsTotal += 45000;
  if (orderDraft.addons.autoBackup) addonsTotal += 120000;
  if (orderDraft.addons.sslPremium) addonsTotal += 150000;

  const rawSubtotal = basePackagePrice + calculatedDomainPrice + addonsTotal;
  const discountAmount = orderDraft.discountAmount || 0;
  const taxableSubtotal = Math.max(0, rawSubtotal - discountAmount);
  const tax = Math.round((taxableSubtotal * paymentConfig.taxPercent) / 100);
  const grandTotal = taxableSubtotal + tax;

  const [couponError, setCouponError] = useState('');

  const applyPromo = () => {
    setCouponError('');
    if (couponCode.toUpperCase() === 'BUANAHEMAT') {
      const disc = 50000;
      setOrderDraft((prev) => ({ ...prev, promoCode: 'BUANAHEMAT', discountAmount: disc }));
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === 'DISKON20') {
      const disc = Math.round(rawSubtotal * 0.2);
      setOrderDraft((prev) => ({ ...prev, promoCode: 'DISKON20', discountAmount: disc }));
      setCouponApplied(true);
    } else {
      setCouponError('Kupon promo tidak valid. Coba kode: BUANAHEMAT atau DISKON20');
    }
  };

  const handleFinishToPayment = () => {
    const order = createOrderFromDraft();
    setCreatedOrder(order);
    setStep(4);
  };

  const handleCopyPaymentUrl = () => {
    if (createdOrder?.subdomainPaymentUrl) {
      navigator.clipboard.writeText(createdOrder.subdomainPaymentUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleSimulateSuccess = () => {
    if (!createdOrder) return;
    updateOrderStatus(createdOrder.id, 'paid');
    setActiveInvoiceId(createdOrder.id);
    setCurrentView('client-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${
              step >= 1 ? 'text-blue-600' : 'text-slate-400'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                1
              </div>
              <span className="hidden sm:inline">Paket Layanan</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />

            <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${
              step >= 2 ? 'text-blue-600' : 'text-slate-400'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                2
              </div>
              <span className="hidden sm:inline">Domain & Addon</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />

            <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${
              step >= 3 ? 'text-blue-600' : 'text-slate-400'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                3
              </div>
              <span className="hidden sm:inline">Siklus Tagihan</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />

            <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${
              step >= 4 ? 'text-blue-600' : 'text-slate-400'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                step >= 4 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                4
              </div>
              <span className="hidden sm:inline">Pembayaran</span>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Configuration Columns (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Pilih / Konfirmasi Paket */}
            {step === 1 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Konfirmasi Pilihan Layanan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Pilih paket yang sesuai dengan kapasitas website dan beban server Anda.
                  </p>
                </div>

                {/* Package Type Switcher */}
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderDraft((prev) => ({
                        ...prev,
                        packageType: 'hosting',
                        selectedPackage: hostingPackages.find((h) => h.isPopular) || hostingPackages[0],
                      }));
                    }}
                    className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border transition flex items-center justify-center gap-2 ${
                      isHosting
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Server className="w-4 h-4" />
                    <span>Web Hosting</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOrderDraft((prev) => ({
                        ...prev,
                        packageType: 'vps',
                        selectedPackage: vpsPackages.find((v) => v.isPopular) || vpsPackages[0],
                      }));
                    }}
                    className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border transition flex items-center justify-center gap-2 ${
                      !isHosting
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Cloud VPS</span>
                  </button>
                </div>

                {/* List Available Packages */}
                <div className="space-y-3">
                  {isHosting
                    ? hostingPackages.filter((p) => p.isActive).map((hp) => (
                        <div
                          key={hp.id}
                          onClick={() => setOrderDraft((prev) => ({ ...prev, selectedPackage: hp }))}
                          className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                            orderDraft.selectedPackage?.id === hp.id
                              ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-lg font-bold text-slate-900">{hp.name}</h4>
                              {hp.isPopular && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white uppercase">
                                  Populer
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{hp.tagline}</p>
                            <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium mt-2">
                              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">{hp.storage}</span>
                              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">{hp.bandwidth}</span>
                              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">{hp.websites}</span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right flex-shrink-0">
                            <span className="text-xs text-slate-400 block line-through">
                              {formatRupiah(hp.monthlyPrice)}/bln
                            </span>
                            <span className="text-xl font-extrabold text-blue-700">
                              {formatRupiah(hp.annualDiscountPrice)}
                            </span>
                            <span className="text-xs text-slate-500"> /bln</span>
                          </div>
                        </div>
                      ))
                    : vpsPackages.filter((v) => v.isActive).map((vp) => (
                        <div
                          key={vp.id}
                          onClick={() => setOrderDraft((prev) => ({ ...prev, selectedPackage: vp }))}
                          className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                            orderDraft.selectedPackage?.id === vp.id
                              ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{vp.name}</h4>
                            <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium mt-2">
                              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">{vp.cpu}</span>
                              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">{vp.ram}</span>
                              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">{vp.storage}</span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right flex-shrink-0">
                            <span className="text-xl font-extrabold text-indigo-700">
                              {formatRupiah(vp.monthlyPrice)}
                            </span>
                            <span className="text-xs text-slate-500"> /bln</span>
                          </div>
                        </div>
                      ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                  >
                    <span>Lanjut ke Domain & Addon</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Konfigurasi Domain & Add-ons */}
            {step === 2 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Konfigurasi Domain & Tambahan Layanan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Tentukan nama domain untuk alamat website Anda atau hubungkan domain lama Anda.
                  </p>
                </div>

                {/* Domain Options Tabs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setOrderDraft((prev) => ({ ...prev, domainOption: 'new' }))}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition text-left ${
                        orderDraft.domainOption === 'new'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>1. Daftarkan Domain Baru</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderDraft((prev) => ({ ...prev, domainOption: 'transfer' }))}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition text-left ${
                        orderDraft.domainOption === 'transfer'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>2. Transfer Domain ke Sini</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderDraft((prev) => ({ ...prev, domainOption: 'existing' }))}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition text-left ${
                        orderDraft.domainOption === 'existing'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>3. Gunakan Domain Sendiri</span>
                    </button>
                  </div>

                  {/* Domain Input Field */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">
                      {orderDraft.domainOption === 'new'
                        ? 'Nama Domain Baru yang Didaftarkan'
                        : 'Nama Domain Anda yang Sudah Ada'}
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <div className="relative flex-1 w-full">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                          www.
                        </span>
                        <input
                          type="text"
                          value={orderDraft.domainName}
                          onChange={(e) =>
                            setOrderDraft((prev) => ({
                              ...prev,
                              domainName: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                            }))
                          }
                          placeholder="namadomainanda"
                          className="w-full pl-14 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <select
                        value={orderDraft.domainTld}
                        onChange={(e) => setOrderDraft((prev) => ({ ...prev, domainTld: e.target.value }))}
                        className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        {domainExtensions.filter((d) => d.isActive).map((ext) => (
                          <option key={ext.id} value={ext.tld}>
                            {ext.tld} ({formatRupiah(ext.priceRegister)}/thn)
                          </option>
                        ))}
                      </select>
                    </div>

                    {hPkg?.freeDomain && orderDraft.periodMonths >= 12 && orderDraft.domainOption === 'new' && (
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 pt-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Kabar gembira! Paket ini menyertakan GRATIS Domain untuk pembayaran tahunan!</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Add-ons Checkboxes */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Add-ons Tambahan (Opsional)
                  </h4>

                  <label className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 flex items-center justify-between gap-4 cursor-pointer transition">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={orderDraft.addons.whoisPrivacy}
                        onChange={(e) =>
                          setOrderDraft((prev) => ({
                            ...prev,
                            addons: { ...prev.addons, whoisPrivacy: e.target.checked },
                          }))
                        }
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">WHOIS Privacy Protection</p>
                        <p className="text-xs text-slate-500">
                          Sembunyikan nama, email, dan alamat Anda dari database WHOIS publik untuk mencegah spam.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-slate-700 whitespace-nowrap">
                      +Rp 45.000 / thn
                    </span>
                  </label>

                  <label className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 flex items-center justify-between gap-4 cursor-pointer transition">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={orderDraft.addons.autoBackup}
                        onChange={(e) =>
                          setOrderDraft((prev) => ({
                            ...prev,
                            addons: { ...prev.addons, autoBackup: e.target.checked },
                          }))
                        }
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Cloud Disaster Recovery Backup</p>
                        <p className="text-xs text-slate-500">
                          Penyimpanan cadangan terisolasi di data center terpisah dengan retensi hingga 30 hari.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-slate-700 whitespace-nowrap">
                      +Rp 120.000 / thn
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                  >
                    <span>Lanjut ke Siklus Tagihan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Pilih Siklus Tagihan (Billing Cycle) */}
            {step === 3 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Pilih Periode Berlangganan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Semakin panjang siklus tagihan yang Anda pilih, semakin besar penghematan yang didapatkan!
                  </p>
                </div>

                <div className="space-y-3">
                  {periods.map((p) => {
                    const isSelected = orderDraft.periodMonths === p.months;
                    const calculatedPeriodPrice = hPkg
                      ? p.months >= 12
                        ? hPkg.annualDiscountPrice * p.months
                        : hPkg.monthlyPrice * p.months
                      : (vPkg?.monthlyPrice || 0) * p.months;

                    return (
                      <div
                        key={p.months}
                        onClick={() => setOrderDraft((prev) => ({ ...prev, periodMonths: p.months }))}
                        className={`p-5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-slate-900">{p.label}</h4>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                                {p.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {p.months >= 12 ? 'Termasuk pembaruan otomatis & jaminan harga tetap' : 'Ditagih per bulan'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-extrabold text-blue-700">
                            {formatRupiah(calculatedPeriodPrice)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishToPayment}
                    className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                  >
                    <span>Lanjut ke Pembayaran</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Integrasi Pembayaran Subdomain & Verifikasi */}
            {step === 4 && createdOrder && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Pesanan Berhasil Dibuat</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Instruksi Pembayaran Pesanan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Nomor Invoice: <strong className="text-slate-800 font-bold">{createdOrder.orderNumber}</strong> • Total:{' '}
                    <strong className="text-blue-700 font-extrabold">{formatRupiah(createdOrder.total)}</strong>
                  </p>
                </div>

                {/* Subdomain Payment Box (Sesuai Subdomain Billing.hostuner.com) */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border-2 border-blue-200 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">
                        Gerbang Pembayaran Resmi Billing.hostuner.com
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Pesanan Anda diteruskan secara otomatis ke sistem penagihan resmi Hostuner di <strong className="text-blue-700">Billing.hostuner.com</strong> untuk pemilihan metode pembayaran (Transfer Bank, QRIS, Virtual Account, Kartu Kredit).
                      </p>
                    </div>
                  </div>

                  {/* Generated URL Inspector */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span>URL Target Billing Subdomain:</span>
                      <button
                        onClick={handleCopyPaymentUrl}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold"
                      >
                        {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUrl ? 'Tersalin' : 'Salin URL'}</span>
                      </button>
                    </div>
                    <p className="text-xs font-mono text-slate-800 break-all bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {createdOrder.subdomainPaymentUrl}
                    </p>
                  </div>

                  {/* Payment Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    {/* Primary Button: Open Subdomain URL */}
                    <a
                      href={createdOrder.subdomainPaymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 text-center"
                    >
                      <span>Lanjut Bayar di Billing.hostuner.com</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Simulation Button for Local Demo */}
                    <button
                      type="button"
                      onClick={handleSimulateSuccess}
                      className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Simulasikan Bayar Sukses (Demo)</span>
                    </button>
                  </div>
                </div>

                {/* Back to Client Area */}
                <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
                  <button
                    onClick={() => {
                      setActiveInvoiceId(createdOrder.id);
                      setCurrentView('client-dashboard');
                    }}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    ← Lihat di Area Pelanggan / Riwayat Tagihan
                  </button>

                  <span className="text-slate-400">
                    Menunggu verifikasi pembayaran otomatis
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Order Summary (4 Cols) */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Ringkasan Pesanan
              </h3>

              {/* Items Breakdown */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-800">{pkg?.name || 'Paket Layanan'}</p>
                    <p className="text-slate-500 text-xs">Durasi {orderDraft.periodMonths} Bulan</p>
                  </div>
                  <span className="font-bold text-slate-900">{formatRupiah(basePackagePrice)}</span>
                </div>

                {orderDraft.domainName && orderDraft.domainOption === 'new' && (
                  <div className="flex items-start justify-between gap-2 pt-2 border-t border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800">
                        Domain: {orderDraft.domainName}{orderDraft.domainTld}
                      </p>
                      <p className="text-slate-500 text-xs">1 Tahun Registrasi</p>
                    </div>
                    <span className="font-bold text-slate-900">
                      {calculatedDomainPrice === 0 ? (
                        <span className="text-emerald-600 font-extrabold">GRATIS</span>
                      ) : (
                        formatRupiah(calculatedDomainPrice)
                      )}
                    </span>
                  </div>
                )}

                {addonsTotal > 0 && (
                  <div className="flex items-start justify-between gap-2 pt-2 border-t border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800">Add-ons Tambahan</p>
                      <p className="text-slate-500 text-xs">Proteksi & Backup</p>
                    </div>
                    <span className="font-bold text-slate-900">{formatRupiah(addonsTotal)}</span>
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Kode Kupon (BUANAHEMAT)"
                    className="flex-1 px-3 py-2 text-xs uppercase font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    Terapkan
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Kupon {orderDraft.promoCode} berhasil digunakan!</span>
                  </p>
                )}
                {couponError && (
                  <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Price Calculation Subtotals */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">{formatRupiah(rawSubtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Diskon Kupon</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>PPN ({paymentConfig.taxPercent}%)</span>
                  <span>{formatRupiah(tax)}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Tagihan</span>
                  <span className="text-xl text-blue-700">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-100 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Pembayaran diamankan dengan enkripsi 256-bit dan diteruskan ke subdomain gateway pembayaran resmi.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
