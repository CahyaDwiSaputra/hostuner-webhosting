import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/format';
import {
  Check,
  Zap,
  ArrowRight,
  Shield,
  Sparkles,
  Server,
  Globe,
  Database,
  Mail,
} from 'lucide-react';
import { HostingPackage } from '../types';

export const HostingPricingSection: React.FC = () => {
  const { hostingPackages, startOrderWithPackage } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const activePackages = hostingPackages.filter((p) => p.isActive);

  return (
    <section id="hosting-plans" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Figma */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Pilihan Paket Hosting Terbaik Untuk Anda
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Pilih paket hosting terbaik yang sesuai dengan kebutuhan website dan perkembangan bisnis Anda.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-4 flex items-center justify-center">
            <div className="p-1 bg-white border border-slate-200 rounded-full shadow-sm inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bayar Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2 ${
                  billingCycle === 'annual'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Tahunan (12 Bulan)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black tracking-wide">
                  HEMAT 50%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {activePackages.map((pkg: HostingPackage) => {
            const isAnnual = billingCycle === 'annual';
            const price = isAnnual ? pkg.annualDiscountPrice : pkg.monthlyPrice;
            const originalPrice = isAnnual ? pkg.monthlyPrice : undefined;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl bg-white transition-all flex flex-col justify-between ${
                  pkg.isPopular
                    ? 'border-2 border-blue-600 shadow-xl shadow-blue-500/10 -translate-y-1'
                    : 'border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/30 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Paling Populer</span>
                    </span>
                  </div>
                )}

                {/* Card Header & Price */}
                <div className="p-7 sm:p-8 space-y-5">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium min-h-[32px]">{pkg.tagline}</p>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2 border-t border-slate-100">
                    {originalPrice && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 line-through">
                        <span>{formatRupiah(originalPrice)}/bln</span>
                        <span className="no-underline text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">
                          Diskon 50%
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        {formatRupiah(price)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/ bulan</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isAnnual
                        ? `Ditagih tahunan ${formatRupiah(price * 12)} / tahun`
                        : 'Ditagih per bulan tanpa komitmen'}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => startOrderWithPackage(pkg, 'hosting')}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition flex items-center justify-center shadow-sm ${
                      pkg.isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Pilih Paket {pkg.name}</span>
                  </button>

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Spesifikasi & Fasilitas:
                    </p>

                    <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span><strong>{pkg.storage}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span><strong>{pkg.bandwidth}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Dukungan <strong>{pkg.websites}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{pkg.emailAccounts}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{pkg.databases}</span>
                      </div>

                      {pkg.freeDomain && (
                        <div className="flex items-center gap-2.5 text-blue-700 font-bold bg-blue-50/70 p-2 rounded-lg">
                          <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>GRATIS Domain 1 Tahun</span>
                        </div>
                      )}

                      {pkg.freeSSL && (
                        <div className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>Gratis SSL Let's Encrypt</span>
                        </div>
                      )}

                      {pkg.cPanel && (
                        <div className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>Akses cPanel Control Panel Resmi</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Micro Spec */}
                <div className="p-4 bg-slate-50/80 rounded-b-3xl border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
                  Garansi 30 Hari Uang Kembali • Setup Instan
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
