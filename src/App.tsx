import React, { useState } from 'react';
import { Download, Monitor, Code2, PackageCheck, Cpu, Layers } from 'lucide-react';
import { MAIN_PY_SOURCE_CODE } from './utils/boosterCodeData';
import { CustomTkinterSimulator } from './components/CustomTkinterSimulator';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { PyInstallerBuilder } from './components/PyInstallerBuilder';
import { GameProfilesInspector } from './components/GameProfilesInspector';
import { HundredTweaksCatalog } from './components/HundredTweaksCatalog';

type ActiveTab = 'simulator' | 'tweaks120' | 'code' | 'profiles' | 'pyinstaller';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');

  const handleDownloadMainPy = () => {
    const blob = new Blob([MAIN_PY_SOURCE_CODE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (5 single-line nav links) — Zone 3 (1 primary CTA) */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/90 bg-[#090D16]/90 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('simulator');
          }}
          className="text-lg font-bold tracking-tight text-slate-100 font-display whitespace-nowrap shrink-0"
        >
          Ultimate Game Booster Pro
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeTab === 'simulator'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : ''
            }`}
          >
            Симулятор GUI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tweaks120')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeTab === 'tweaks120'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : ''
            }`}
          >
            Каталог 120+ фишек
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeTab === 'code'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : ''
            }`}
          >
            Исходный код main.py
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profiles')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeTab === 'profiles'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : ''
            }`}
          >
            Профили игр
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pyinstaller')}
            className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeTab === 'pyinstaller'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : ''
            }`}
          >
            Сборка .exe
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadMainPy}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Скачать main.py</span>
          </button>
        </div>
      </header>

      {/* Основной контейнер рабочей области */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Краткая инженерная сводка + Переключатель режимов рабочей области */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-xs text-slate-400 font-mono">
              <span>Python 3.11+</span>
              <span className="mx-2">·</span>
              <span>120+ фишек по 1 кнопке</span>
              <span className="mx-2">·</span>
              <span>WinAPI ntdll.dll &amp; winreg</span>
              <span className="mx-2">·</span>
              <span>psutil Process Watchdog</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-display"
              style={{ textWrap: 'balance' }}
            >
              Низкоуровневая оптимизация Windows 10/11 для киберспорта и тяжелых симуляторов
            </h1>
          </div>

          {/* Сегментированный переключатель вкладок */}
          <div
            role="tablist"
            aria-label="Разделы инженерной среды"
            className="flex items-center gap-1 p-1 rounded-xl bg-[#111827] border border-slate-800 overflow-x-auto shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'simulator'}
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Интерактивный GUI</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'tweaks120'}
              onClick={() => setActiveTab('tweaks120')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'tweaks120'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>120+ фишек FPS</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'code'}
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Код main.py (Полный)</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'profiles'}
              onClick={() => setActiveTab('profiles')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'profiles'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Профили Source 2 / UE / Enfusion</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'pyinstaller'}
              onClick={() => setActiveTab('pyinstaller')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'pyinstaller'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Компиляция в .exe (PyInstaller)</span>
            </button>
          </div>
        </section>

        {/* Активная вкладка */}
        <section>
          {activeTab === 'simulator' && <CustomTkinterSimulator />}
          {activeTab === 'tweaks120' && <HundredTweaksCatalog />}
          {activeTab === 'code' && <PythonCodeViewer />}
          {activeTab === 'profiles' && <GameProfilesInspector />}
          {activeTab === 'pyinstaller' && <PyInstallerBuilder />}
        </section>
      </main>

      {/* Чистый лаконичный футер */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1360px] w-full mx-auto">
        <div>
          Ultimate Game Booster Pro — 120+ системных фишек FPS по одной кнопке (Python 3.11+, customtkinter, psutil, winreg, ctypes)
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('tweaks120')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Каталог 120+ фишек
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Открыть исходный код main.py
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setActiveTab('pyinstaller')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Инструкция PyInstaller
          </button>
        </div>
      </footer>
    </div>
  );
}
