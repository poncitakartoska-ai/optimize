import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Search, FileCode2, Filter } from 'lucide-react';
import { MAIN_PY_SOURCE_CODE } from '../utils/boosterCodeData';

const CODE_SECTIONS = [
  { id: 'all', label: 'Весь файл main.py', searchMarker: '' },
  { id: 'uac', label: '1. Права Админа & UAC', searchMarker: '2. ПРОВЕРКА ПРАВ АДМИНИСТРАТОРА' },
  { id: 'power', label: '2. Питание & CPU Parking', searchMarker: 'БЛОК 2: Электропитание' },
  { id: 'ram', label: '3. Память & NtSetSystemInformation', searchMarker: 'БЛОК 3: Очистка Temp' },
  { id: 'reg', label: '4. Реестр, MMCSS & Nagle', searchMarker: 'БЛОК 4: Глубокие твики реестра' },
  { id: 'debloat', label: '5. Службы & Процессы', searchMarker: 'БЛОК 5: Остановка фоновых служб' },
  { id: 'games', label: '6. Source 2, Squad & Watchdog', searchMarker: 'БЛОК 6: Очистка кэша шейдеров' },
  { id: 'gui', label: '7. Интерфейс customtkinter', searchMarker: '4. ГРАФИЧЕСКИЙ ИНТЕРФЕЙС CUSTOMTKINTER' },
];

export const PythonCodeViewer: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('all');

  const lines = useMemo(() => MAIN_PY_SOURCE_CODE.split('\n'), []);

  const filteredLines = useMemo(() => {
    if (!searchQuery.trim()) {
      return lines.map((line, index) => ({ lineNumber: index + 1, content: line }));
    }
    const q = searchQuery.toLowerCase();
    return lines
      .map((line, index) => ({ lineNumber: index + 1, content: line }))
      .filter((item) => item.content.toLowerCase().includes(q));
  }, [lines, searchQuery]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(MAIN_PY_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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

  const handleJumpToSection = (sectionId: string, marker: string) => {
    setActiveSection(sectionId);
    setSearchQuery('');
    if (!marker) {
      const container = document.getElementById('python-code-scroll-container');
      if (container) container.scrollTop = 0;
      return;
    }
    const targetIdx = lines.findIndex((l) => l.includes(marker));
    if (targetIdx !== -1) {
      const rowEl = document.getElementById(`py-line-${targetIdx + 1}`);
      if (rowEl) {
        rowEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Панель управления кодом */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-[#111827] border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <FileCode2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <h2 className="text-base font-bold text-slate-100 font-display">
              Полный исходный код <code className="text-emerald-400 font-mono">main.py</code> (Единый файл без заглушек)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Python 3.11+ · <code className="text-slate-300">customtkinter</code> ·{' '}
            <code className="text-slate-300">psutil</code> · <code className="text-slate-300">winreg</code> ·{' '}
            <code className="text-slate-300">ctypes (ntdll.dll / shell32.dll)</code> · Многопоточность{' '}
            <code className="text-slate-300">threading</code> · Всего строк:{' '}
            <span className="font-mono text-slate-200 tabular-nums">{lines.length}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Поиск по коду */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск функции или ключа реестра..."
              aria-label="Поиск функции или ключа реестра в main.py"
              className="pl-8 pr-3 py-2 rounded-lg bg-[#090D16] border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-64"
            />
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Код скопирован!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Скопировать весь main.py</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadMainPy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Скачать main.py</span>
          </button>
        </div>
      </div>

      {/* Быстрая навигация по архитектурным блокам файла main.py */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="flex items-center gap-1 text-xs text-slate-400 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Перейти к модулю:</span>
        </span>
        {CODE_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => handleJumpToSection(sec.id, sec.searchMarker)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === sec.id
                ? 'bg-emerald-600 text-white'
                : 'bg-[#111827] text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Окно просмотра кода с номерами строк */}
      <div className="rounded-xl border border-slate-800 bg-[#080B12] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#0D131F] border-b border-slate-800 text-xs font-mono text-slate-400">
          <span>main.py — UTF-8 — Python 3.11+</span>
          <span>
            Отображено строк: {filteredLines.length} из {lines.length}
          </span>
        </div>

        <div
          id="python-code-scroll-container"
          className="max-h-[640px] overflow-y-auto p-4 font-mono text-xs leading-relaxed select-text"
        >
          {filteredLines.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              По запросу «{searchQuery}» строк не найдено.{' '}
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-emerald-400 underline ml-2 cursor-pointer"
              >
                Сбросить фильтр
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <tbody>
                {filteredLines.map((row) => {
                  const isComment = row.content.trim().startsWith('#');
                  const isDefOrClass =
                    row.content.trim().startsWith('def ') || row.content.trim().startsWith('class ');
                  return (
                    <tr
                      key={row.lineNumber}
                      id={`py-line-${row.lineNumber}`}
                      className="hover:bg-slate-900/80"
                    >
                      <td className="w-12 pr-4 text-right text-slate-600 select-none align-top tabular-nums">
                        {row.lineNumber}
                      </td>
                      <td
                        className={`whitespace-pre-wrap break-all ${
                          isComment
                            ? 'text-slate-400 italic'
                            : isDefOrClass
                            ? 'text-emerald-300 font-semibold'
                            : 'text-slate-200'
                        }`}
                      >
                        {row.content || ' '}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
