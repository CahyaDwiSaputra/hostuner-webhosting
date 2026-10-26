import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/format';
import { Cpu, HardDrive, Network, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { VpsPackage } from '../types';

export const VpsSection: React.FC = () => {
  const { vpsPackages, startOrderWithPackage } = useApp();

  const activeVps = vpsPackages.filter((v) => v.isActive);

  return (
    <section id="vps-section" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Layanan Cloud Virtual Private Server (VPS)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Server virtual pribadi dengan sumber daya terisolasi, akses penuh (root access), dan alamat IP publik dedicated.
          </p>
        </div>

        {/* VPS Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeVps.map((vps: VpsPackage) => (
            <div
              key={vps.id}
              className={`rounded-3xl p-7 transition-all flex flex-col justify-between ${
                vps.isPopular
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-950/20 ring-2 ring-indigo-500'
                  : 'bg-slate-50 text-slate-900 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{vps.name}</h3>
                  {vps.isPopular && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500 text-white font-bold tracking-wide uppercase">
                      Terlaris
                    </span>
                  )}
                </div>

                {/* Specs Box */}
                <div className={`p-4 rounded-2xl space-y-3 ${
                  vps.isPopular ? 'bg-slate-800/80 border border-slate-700' : 'bg-white border border-slate-200/80'
                }`}>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 font-medium opacity-80">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      <span>Processor</span>
                    </span>
                    <span className="font-bold">{vps.cpu}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 font-medium opacity-80">
                      <Network className="w-4 h-4 text-indigo-400" />
                      <span>Memory RAM</span>
                    </span>
                    <span className="font-bold">{vps.ram}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 font-medium opacity-80">
                      <HardDrive className="w-4 h-4 text-indigo-400" />
                      <span>NVMe SSD</span>
                    </span>
                    <span className="font-bold">{vps.storage}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 font-medium opacity-80">
                      <Shield className="w-4 h-4 text-indigo-400" />
                      <span>Bandwidth</span>
                    </span>
                    <span className="font-bold">{vps.bandwidth}</span>
                  </div>
                </div>

                {/* OS Choice Badges */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-60">
                    Pilihan Sistem Operasi:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {vps.osOptions.map((os) => (
                      <span
                        key={os}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                          vps.isPopular
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {os}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-6 mt-6 border-t border-slate-200/20 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold">
                      {formatRupiah(vps.monthlyPrice)}
                    </span>
                    <span className="text-xs opacity-60"> / bln</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {vps.ipPublic}
                  </span>
                </div>

                <button
                  onClick={() => startOrderWithPackage(vps, 'vps')}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center ${
                    vps.isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Pilih {vps.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
