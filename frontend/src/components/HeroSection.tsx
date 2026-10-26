import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Server,
  HardDrive,
  Cpu,
  Lock,
  Globe,
  CheckCircle2,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { theme } = useApp();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-blue-50/40 via-white to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Actions matching Figma */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Solusi Web Hosting Terbaik di Indonesia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
              Bangun Website<br />
              Impian Anda dengan<br />
              <span className="text-blue-600">Hosting Berkualitas</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Dapatkan performa server maksimal dengan penyimpanan NVMe SSD super cepat, proteksi keamanan andal, dan dukungan teknis 24/7 untuk mendukung pertumbuhan website Anda.
            </p>

            {/* Action Buttons matching Figma */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollTo('#hosting-plans')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition"
              >
                Pilih Paket
              </button>

              <button
                type="button"
                onClick={() => scrollTo('#domain-search')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border border-slate-300 shadow-sm hover:border-slate-400 transition"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>

          {/* Right Column: 3D Isometric Desktop & Server Illustration matching Figma */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Soft Radial Blue Glow Backdrop */}
            <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="relative w-full max-w-md p-2">
              {/* Floating 99.9% Uptime Badge */}
              <div className="absolute -top-3 right-8 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-blue-100 flex items-center gap-2.5 animate-bounce [animation-duration:3s]">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-500/30">
                  ⚡
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block leading-tight">99.9% Uptime</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Server Bergaransi</span>
                </div>
              </div>

              {/* Main Desktop Monitor Assembly */}
              <div className="relative bg-slate-900 rounded-2xl p-3 shadow-2xl border-4 border-slate-800">
                {/* Monitor Screen Header Bar */}
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 px-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-500 ml-2 font-mono">dashboard.hostuner.com</span>
                </div>

                {/* Dashboard Screen Content */}
                <div className="bg-slate-950 rounded-xl p-4 mt-2 space-y-3 font-sans text-white">
                  {/* Top Stats in screen */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/40">
                      <span className="text-[10px] text-blue-300 block">CPU Load</span>
                      <span className="text-sm font-extrabold text-white">12% Normal</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">NVMe Speed</span>
                      <span className="text-sm font-extrabold text-emerald-400">7,200 MB/s</span>
                    </div>
                  </div>

                  {/* Active Cloud Server Visual inside screen */}
                  <div className="p-3 rounded-lg bg-gradient-to-r from-blue-900/60 to-indigo-900/40 border border-blue-700/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                        ☁️
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-none">Cloud Cluster Active</p>
                        <p className="text-[10px] text-blue-200 mt-1">HTTP/3 & TLS 1.3 Enabled</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Online
                    </span>
                  </div>

                  {/* Latency & Traffic Lines */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Network Throughput</span>
                      <span className="text-blue-400 font-bold">10 Gbps Port</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Monitor Stand */}
                <div className="w-16 h-4 bg-slate-700 mx-auto mt-2 rounded-t-sm" />
                <div className="w-28 h-2 bg-slate-600 mx-auto rounded-full shadow-md" />
              </div>

              {/* Floating Desk Plant on Left */}
              <div className="absolute -bottom-4 -left-4 z-20 bg-white p-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2">
                <span className="text-2xl">🪴</span>
                <div className="text-left">
                  <span className="text-[11px] font-bold text-slate-800 block leading-tight">Eco-friendly</span>
                  <span className="text-[9px] text-slate-500">Green Data Center</span>
                </div>
              </div>

              {/* Floating 3D Server Blocks on Right */}
              <div className="absolute -bottom-3 -right-3 z-20 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2">
                <span className="text-lg">📦</span>
                <div className="text-left">
                  <span className="text-xs font-bold block leading-tight">Instant Setup</span>
                  <span className="text-[9px] text-blue-100">Siap Pakai 1 Menit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
