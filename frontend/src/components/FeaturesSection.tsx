import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Server,
  Shield,
  Zap,
  RefreshCw,
  Headphones,
  Globe,
  Cpu,
  Database,
  CheckCircle,
} from 'lucide-react';

const iconMap = {
  Server,
  Shield,
  Zap,
  RefreshCw,
  Headphones,
  Globe,
  Cpu,
  Database,
};

export const FeaturesSection: React.FC = () => {
  const { featureCards } = useApp();

  const activeFeatures = featureCards.filter((f) => f.isActive);

  return (
    <section id="features" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Infrastruktur server berkinerja tinggi dengan teknologi terkini untuk menjamin kecepatan, keamanan, dan ketersediaan website Anda setiap saat.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeFeatures.map((card) => {
            const IconComponent = iconMap[card.iconName] || Server;

            return (
              <div
                key={card.id}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition flex items-center justify-center shadow-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {card.badge && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                      {card.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
