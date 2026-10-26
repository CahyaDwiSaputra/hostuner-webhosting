import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/format';
import { Search, CheckCircle, AlertCircle, ShoppingCart, Globe, ArrowRight } from 'lucide-react';

export const DomainChecker: React.FC = () => {
  const { domainExtensions, startOrderWithDomain } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTld, setSelectedTld] = useState('.com');
  const [searchResult, setSearchResult] = useState<{
    searched: boolean;
    domain: string;
    isAvailable: boolean;
    price: number;
    tld: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const activeTlds = domainExtensions.filter((d) => d.isActive);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    // Clean domain input
    let clean = searchQuery.toLowerCase().trim().replace(/https?:\/\//, '').replace(/www\./, '');
    let tld = selectedTld;

    // Check if user already typed TLD
    const matchedTld = activeTlds.find((ext) => clean.endsWith(ext.tld));
    if (matchedTld) {
      tld = matchedTld.tld;
      clean = clean.slice(0, -tld.length);
    }
    // Remove non-alphanumeric/hyphen
    clean = clean.replace(/[^a-z0-9-]/g, '');

    const extObj = activeTlds.find((d) => d.tld === tld) || activeTlds[0];
    const fullDomain = `${clean}${extObj.tld}`;

    setTimeout(() => {
      // Simulate availability check (reserved words unavailable)
      const reserved = ['google', 'facebook', 'buanalogikautama', 'kemkes', 'tokopedia', 'bca'];
      const isAvailable = !reserved.includes(clean);

      setSearchResult({
        searched: true,
        domain: fullDomain,
        isAvailable,
        price: extObj.priceRegister,
        tld: extObj.tld,
      });
      setIsSearching(false);
    }, 450);
  };

  return (
    <section id="domain-search" className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-2.5 mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cari Nama Domain Anda
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Temukan nama domain terbaik untuk bisnis dan proyek website Anda dengan pilihan ekstensi lokal dan global.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="p-2 sm:p-2.5 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama domain Anda..."
                className="w-full pl-12 pr-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            {/* TLD Dropdown Selector */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <select
                value={selectedTld}
                onChange={(e) => setSelectedTld(e.target.value)}
                className="w-full sm:w-auto px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                {activeTlds.map((ext) => (
                  <option key={ext.id} value={ext.tld}>
                    {ext.tld} ({formatRupiah(ext.priceRegister)}/thn)
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center flex-shrink-0"
              >
                {isSearching ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Cari</span>
                )}
              </button>
            </div>
          </form>

          {/* Quick TLD Badges */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {activeTlds.map((ext) => (
              <button
                key={ext.id}
                type="button"
                onClick={() => {
                  setSelectedTld(ext.tld);
                  if (searchQuery) handleSearch();
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-2 ${
                  selectedTld === ext.tld
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="font-bold text-slate-900">{ext.tld}</span>
                <span className="text-slate-500">{formatRupiah(ext.priceRegister)}</span>
                {ext.isPromo && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700 font-bold">
                    PROMO
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Result Feedback */}
          {searchResult && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-3 duration-200">
              {searchResult.isAvailable ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-emerald-950 flex items-center gap-2 justify-center sm:justify-start">
                        <span>{searchResult.domain}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-800 font-bold">
                          Tersedia!
                        </span>
                      </h4>
                      <p className="text-xs text-emerald-800 font-medium">
                        Daftarkan sekarang sebelum diambil pihak lain.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-emerald-700 font-medium block">Biaya Tahun Pertama</span>
                      <span className="text-xl font-extrabold text-emerald-900">
                        {formatRupiah(searchResult.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => startOrderWithDomain(searchResult.domain, searchResult.tld, searchResult.price)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Pesan Sekarang</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-amber-950">
                        {searchResult.domain} sudah digunakan
                      </h4>
                      <p className="text-xs text-amber-800 font-medium">
                        Domain ini telah terdaftar. Coba gunakan variasi nama atau ekstensi domain lain seperti .id, .net, atau .biz.id.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTlds
                      .filter((ext) => ext.tld !== searchResult.tld)
                      .slice(0, 2)
                      .map((alt) => (
                        <button
                          key={alt.id}
                          onClick={() => {
                            setSelectedTld(alt.tld);
                            handleSearch();
                          }}
                          className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-bold text-amber-900 hover:bg-amber-100 transition"
                        >
                          Coba {alt.tld}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
