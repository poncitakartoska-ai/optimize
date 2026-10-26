import React, { useState, useMemo } from 'react';
import { Search, Layers, Sliders, Terminal, RotateCcw } from 'lucide-react';
import {
  HUNDRED_TWENTY_FPS_TWEAKS,
  TWEAK_CATEGORIES,
  TweakCategory,
  getTweaksForProfile,
} from '../utils/hundredTweaksData';
import { OPTIMIZATION_MODES, OptimizationLevelId } from '../utils/boosterCodeData';

export const HundredTweaksCatalog: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<OptimizationLevelId>('max_fps');
  const [selectedCategory, setSelectedCategory] = useState<TweakCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const profileTweaks = useMemo(() => getTweaksForProfile(selectedProfile), [selectedProfile]);

  const filteredTweaks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return profileTweaks.filter((t) => {
      const matchCat = selectedCategory === 'ALL' || t.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.codeName.toLowerCase().includes(q) ||
        t.target.toLowerCase().includes(q) ||
        t.fpsImpact.toLowerCase().includes(q) ||
        String(t.id) === q
      );
    });
  }, [profileTweaks, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: profileTweaks.length };
    for (const cat of TWEAK_CATEGORIES) {
      counts[cat] = profileTweaks.filter((t) => t.category === cat).length;
    }
    return counts;
  }, [profileTweaks]);

  const getProfileLabel = (minProfile: 'minimal' | 'balanced' | 'max_fps') => {
    if (minProfile === 'minimal') return 'Все профили (Лайт+)';
    if (minProfile === 'balanced') return 'Баланс + Макс. FPS';
    return 'Только Максимальный FPS';
  };

  return (
    <div className="space-y-6">
      {/* Верхний блок обзора матрицы 120 фишек */}
      <div className="rounded-xl border border-slate-800 bg-[#0D131F] p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Layers className="w-4 h-4 shrink-0" />
              <span>МАТРИЦА ПАКЕТНОЙ ОПТИМИЗАЦИИ ПО ОДНОЙ КНОПКЕ (ONE-CLICK BOOST ENGINE)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display">
              Каталог 120 низкоуровневых фишек повышения FPS и снижения Input Lag
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Все 120 системных оптимизаций встроены в класс <code className="text-slate-200">SystemOptimizerEngine</code> в{' '}
              <code className="text-slate-200">main.py</code> и выполняются автоматически при нажатии главной кнопки{' '}
              <strong className="text-emerald-400">«BOOST / ОПТИМИЗИРОВАТЬ ВСЁ»</strong> с полным откатом по кнопке{' '}
              <strong className="text-slate-200">«Откатить изменения / Restore»</strong>.
            </p>
          </div>

          {/* Счетчики по профилям */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {OPTIMIZATION_MODES.map((m) => {
              const active = selectedProfile === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedProfile(m.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer border whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-[#111827] text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className="ml-2 font-mono tabular-nums opacity-90">({m.tweaksCount}/120)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Поиск и фильтр по 8 техническим категориям */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по 120 фишкам (например: HAGS, MPO, Nagle, MouseDataQueueSize, NVMe, BCD)..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="text-xs font-mono text-slate-400 tabular-nums">
              Отображено фишек: <strong className="text-emerald-400">{filteredTweaks.length}</strong> из{' '}
              <strong className="text-slate-200">{profileTweaks.length}</strong> (всего в базе: 120)
            </div>
          </div>

          {/* Кнопки категорий */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-[#111827] text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              Все категории ({categoryCounts.ALL})
            </button>

            {TWEAK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-[#111827] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat} ({categoryCounts[cat] || 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Сетка карточек 120 фишек */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5" data-testid="hundred-tweaks-grid">
        {filteredTweaks.map((tweak) => (
          <div
            key={tweak.id}
            className="p-4 rounded-xl bg-[#0D131F] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="text-emerald-400 font-semibold tabular-nums">#{tweak.id}</span>
                  <span className="mx-1.5">·</span>
                  <span className="text-slate-300">{tweak.category}</span>
                </div>
                <span className="text-slate-400">{getProfileLabel(tweak.minProfile)}</span>
              </div>

              <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                {tweak.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {tweak.fpsImpact}
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-start gap-1.5 text-slate-400 break-all">
                <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{tweak.target}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500">BOOST: </span>
                  <span className="text-emerald-400 font-semibold">{tweak.boostValue}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <RotateCcw className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>Откат: {tweak.restoreValue}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
