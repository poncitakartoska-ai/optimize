import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Cpu,
  HardDrive,
  Copy,
  Check,
  Sparkles,
  Trash2,
  Sliders,
  Layers,
} from 'lucide-react';
import {
  KILLABLE_PROCESSES,
  PROTECTED_WHITELIST,
  GAME_PROFILES,
  OPTIMIZATION_MODES,
  OptimizationLevelId,
  calculateEstimatedRamSaved,
  getOptimizationModeById,
} from '../utils/boosterCodeData';
import { TWEAK_CATEGORIES, getTweaksForProfile } from '../utils/hundredTweaksData';

interface LogEntry {
  id: number;
  time: string;
  tag: 'INFO' | 'OK' | 'WARN' | 'WATCHDOG' | 'START';
  text: string;
}

export const CustomTkinterSimulator: React.FC = () => {
  const [optimizationMode, setOptimizationMode] = useState<OptimizationLevelId>('max_fps');
  const [selectedProcs, setSelectedProcs] = useState<string[]>(
    KILLABLE_PROCESSES.filter((p) => p.defaultChecked).map((p) => p.id)
  );
  const [watchdogEnabled, setWatchdogEnabled] = useState<boolean>(true);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusLabel, setStatusLabel] = useState<string>('Готов к оптимизации (0% · 120 фишек в пакете)');
  const [copiedLaunch, setCopiedLaunch] = useState<boolean>(false);
  const [selectedProfileId, setSelectedProfileId] = useState<'dota2' | 'deadlock' | 'squad' | 'reforger'>('dota2');
  const [systemBoosted, setSystemBoosted] = useState<boolean>(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      time: '12:32:01',
      tag: 'INFO',
      text: 'ULTIMATE GAME BOOSTER PRO — 120+ СИСТЕМНЫХ ТВИКОВ FPS & INPUT LAG (Python 3.11.9 | customtkinter 5.2.2)',
    },
    {
      id: 2,
      time: '12:32:01',
      tag: 'OK',
      text: 'Проверка ctypes.windll.shell32.IsUserAnAdmin() -> True (Права Администратора подтверждены)',
    },
    {
      id: 3,
      time: '12:32:01',
      tag: 'INFO',
      text: 'Активный профиль: «Максимальный FPS» (Агрессивный · 120/120 фишек по одной кнопке)',
    },
    {
      id: 4,
      time: '12:32:02',
      tag: 'WATCHDOG',
      text: 'Фоновый поток psutil.process_iter активен: ожидание dota2.exe, project8.exe, SquadGame.exe, ArmaReforgerSteam.exe',
    },
  ]);

  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const nowStr = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  };

  const addLog = (tag: LogEntry['tag'], text: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: nowStr(),
        tag,
        text,
      },
    ]);
  };

  const handleSelectOptimizationMode = (modeId: OptimizationLevelId) => {
    if (isWorking) return;
    setOptimizationMode(modeId);
    const modeObj = getOptimizationModeById(modeId);
    addLog(
      'INFO',
      `Выбран профиль оптимизации: «${modeObj.label}» (${modeObj.shortTag}) — активировано ${modeObj.tweaksCount} из 120 фишек.`
    );
  };

  const toggleProcess = (id: string) => {
    setSelectedProcs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const runFullBoostSimulation = () => {
    if (isWorking) return;
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    setIsWorking(true);
    setProgress(5);
    setStatusLabel('Выполнение: 5%');

    const activeModeObj = getOptimizationModeById(optimizationMode);
    const ramToFreeMb = calculateEstimatedRamSaved(selectedProcs, optimizationMode);
    const activeCount = selectedProcs.length;

    let steps: { delay: number; prog: number; tag: LogEntry['tag']; msg: string }[] = [];

    if (optimizationMode === 'max_fps') {
      steps = [
        {
          delay: 120,
          prog: 8,
          tag: 'START',
          msg: `ЗАПУСК ПАКЕТА 120/120 ОПТИМИЗАЦИЙ WINDOWS (ПРОФИЛЬ: «${activeModeObj.label.toUpperCase()}»)...`,
        },
        {
          delay: 380,
          prog: 16,
          tag: 'OK',
          msg: '[1/8] Безопасность: Wmic.exe SystemRestore -> Точка «Ultimate Game Booster Pro Pre-Boost» успешно создана.',
        },
        {
          delay: 700,
          prog: 28,
          tag: 'OK',
          msg: '[2/8] Питание & CPU (15 фишек): Ultimate Performance активна, Core Parking=100% ядер, Turbo=Aggressive, PCIe ASPM=Off, USB Suspend=Off, NVMe Idle=Off, powercfg -h off.',
        },
        {
          delay: 1050,
          prog: 42,
          tag: 'OK',
          msg: '[3/8] Память & ФС (15 фишек): NtSetSystemInformation(WorkingSets=2, Modified=3, Standby=4,5) -> +3240 МБ ОЗУ. Очищены Temp/Prefetch (618 МБ). NTFS LastAccess=1, 8dot3=1, MFTZone=2.',
        },
        {
          delay: 1400,
          prog: 56,
          tag: 'OK',
          msg: '[4/8] GPU, DXGI, HAGS & MPO (15 фишек): HwSchMode=2 (HAGS), OverlayTestMode=5 (MPO Off), EnablePreemption=0, DXGKrnl FrameLatency=1, MaxFrameLatency=1, GameDVR=0, FSEBehaviorMode=2.',
        },
        {
          delay: 1750,
          prog: 70,
          tag: 'OK',
          msg: '[5/8] Ядро, MMCSS & HID Ввод (30 фишек): SystemResponsiveness=0, GPU Priority=8, Priority=6, Win32PrioritySeparation=0x26 (38 Dec), MouseDataQueueSize=20, KeyboardDataQueueSize=20, Raw Mouse Curve 1:1, BCD disabledynamictick=yes.',
        },
        {
          delay: 2100,
          prog: 84,
          tag: 'OK',
          msg: '[6/8] Сетевой стек TCP/IP & AFD (18 фишек): Nagle OFF (TcpAckFrequency=1, TCPNoDelay=1), NetworkThrottlingIndex=0xFFFFFFFF, QoS NonBestEffortLimit=0, AFD FastSendDatagramThreshold=1500, Netsh RSS/ECN/CTCP.',
        },
        {
          delay: 2450,
          prog: 94,
          tag: 'OK',
          msg: `[7/8] DWM, Телеметрия & Службы (27 фишек): DWM Transparency/Animations Off, VBS/HVCI Latency Tweak. Остановлены 9 служб (SysMain, DiagTrack, WSearch, Spooler, MapsBroker, PcaSvc, DPS, WerSvc, Fax). Выгружено ${activeCount} групп процессов (~${ramToFreeMb} МБ ОЗУ).`,
        },
        {
          delay: 2800,
          prog: 100,
          tag: 'OK',
          msg: `[8/8] ВСЕ 120 ФИШЕК ПРОФИЛЯ «${activeModeObj.label}» ВЫПОЛНЕНЫ ПО ОДНОЙ КНОПКЕ! Максимальный FPS и минимальный Input Lag активны.`,
        },
      ];
    } else if (optimizationMode === 'balanced') {
      steps = [
        {
          delay: 120,
          prog: 10,
          tag: 'START',
          msg: `ЗАПУСК ПАКЕТА 92/120 ОПТИМИЗАЦИЙ WINDOWS (ПРОФИЛЬ: «${activeModeObj.label.toUpperCase()}»)...`,
        },
        {
          delay: 420,
          prog: 22,
          tag: 'OK',
          msg: 'Точка восстановления «Ultimate Game Booster Pro Pre-Boost» создана.',
        },
        {
          delay: 750,
          prog: 38,
          tag: 'OK',
          msg: 'Питание & CPU: схема «Максимальная производительность», парковка ядер 0%, PCIe ASPM Off, USB Selective Suspend Off (гибернация сохранена).',
        },
        {
          delay: 1100,
          prog: 55,
          tag: 'OK',
          msg: 'Память & NTFS: очищены %TEMP% и Windows\\Temp, Standby List сброшен через NtSetSystemInformation (+2480 МБ ОЗУ), NTFS DisableLastAccess=1.',
        },
        {
          delay: 1450,
          prog: 74,
          tag: 'OK',
          msg: 'Матрица реестра (62 твика): HAGS=2, MPO Off, GameDVR=0, MMCSS SystemResponsiveness=10, GPU Priority=8, Win32PrioritySeparation=0x26, Mouse/Keyboard Queue=20, Nagle OFF.',
        },
        {
          delay: 1800,
          prog: 90,
          tag: 'OK',
          msg: `Остановлены службы телеметрии и индексации: DiagTrack, WSearch, MapsBroker, WerSvc (Spooler и SysMain сохранены). Завершено ${activeCount} групп процессов (~${ramToFreeMb} МБ ОЗУ).`,
        },
        {
          delay: 2150,
          prog: 100,
          tag: 'OK',
          msg: `ОПТИМИЗАЦИЯ ПО ПРОФИЛЮ «${activeModeObj.label}» (92/120 ФИШЕК) ЗАВЕРШЕНА! Сбалансированный игровой режим активен.`,
        },
      ];
    } else {
      steps = [
        {
          delay: 120,
          prog: 12,
          tag: 'START',
          msg: `ЗАПУСК ПАКЕТА 25/120 БЕЗОПАСНЫХ ОПТИМИЗАЦИЙ (ПРОФИЛЬ: «${activeModeObj.label.toUpperCase()}»)...`,
        },
        {
          delay: 420,
          prog: 28,
          tag: 'OK',
          msg: 'Точка восстановления «Ultimate Game Booster Pro Pre-Boost» создана.',
        },
        {
          delay: 780,
          prog: 48,
          tag: 'OK',
          msg: 'Активирована схема высокой производительности питания (без изменения реестра Core Parking и без отключения гибернации).',
        },
        {
          delay: 1140,
          prog: 68,
          tag: 'OK',
          msg: 'Очищена папка %TEMP%. Выполнен мягкий сброс Standby List через NtSetSystemInformation (+1640 МБ ОЗУ свободно) и ipconfig /flushdns.',
        },
        {
          delay: 1500,
          prog: 86,
          tag: 'OK',
          msg: 'Применены 16 безопасных твиков реестра: отключены GameDVR, Xbox Game Bar, StickyKeys/FilterKeys/ToggleKeys, реклама и советы Windows.',
        },
        {
          delay: 1850,
          prog: 100,
          tag: 'OK',
          msg: `ОПТИМИЗАЦИЯ ПО ПРОФИЛЮ «${activeModeObj.label}» (25/120 ФИШЕК) ЗАВЕРШЕНА! Фоновые приложения сохранены, авто-приоритет игр (psutil) активен.`,
        },
      ];
    }

    steps.forEach((st, idx) => {
      const tid = window.setTimeout(() => {
        setProgress(st.prog);
        setStatusLabel(
          `Выполнение (${activeModeObj.label} · ${activeModeObj.tweaksCount}/120 фишек): ${st.prog}%`
        );
        addLog(st.tag, st.msg);
        if (idx === steps.length - 1) {
          setIsWorking(false);
          setSystemBoosted(true);
        }
      }, st.delay);
      timersRef.current.push(tid);
    });
  };

  const runRestoreSimulation = () => {
    if (isWorking) return;
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    setIsWorking(true);
    setProgress(15);
    setStatusLabel('Откат 120 фишек: 15%');

    const steps: { delay: number; prog: number; tag: LogEntry['tag']; msg: string }[] = [
      {
        delay: 200,
        prog: 25,
        tag: 'INFO',
        msg: 'ЗАПУСК ПОЛНОГО ОТКАТА ВСЕХ 120+ ТВИКОВ К СТАНДАРТНЫМ ПАРАМЕТРАМ WINDOWS...',
      },
      {
        delay: 600,
        prog: 50,
        tag: 'OK',
        msg: 'Схема питания возвращена на «Сбалансированная» (381b4222-f694-41f0-9685-ff5bb260df2e), гибернация включена (powercfg -h on), динамический тик BCD восстановлен.',
      },
      {
        delay: 1000,
        prog: 75,
        tag: 'OK',
        msg: 'Откат матрицы REGISTRY_FPS_MATRIX (70+ параметров): GameDVR, MPO, MMCSS (SystemResponsiveness=20), Win32PrioritySeparation (0x02), буферы мыши/клавиатуры (100) и кривые мыши возвращены к дефолту.',
      },
      {
        delay: 1400,
        prog: 100,
        tag: 'OK',
        msg: 'Алгоритм Нагла восстановлен на всех сетевых адаптерах. Все 9 служб (SysMain, WSearch, Spooler, DiagTrack и др.) перезапущены. Полный откат выполнен!',
      },
    ];

    steps.forEach((st, idx) => {
      const tid = window.setTimeout(() => {
        setProgress(st.prog);
        setStatusLabel(
          idx === steps.length - 1
            ? 'Стандартные настройки Windows восстановлены (100%)'
            : `Откат 120 фишек: ${st.prog}%`
        );
        addLog(st.tag, st.msg);
        if (idx === steps.length - 1) {
          setIsWorking(false);
          setSystemBoosted(false);
        }
      }, st.delay);
      timersRef.current.push(tid);
    });
  };

  const runSource2ShaderClean = () => {
    if (isWorking) return;
    addLog('INFO', 'Очистка кэша шейдеров Steam для Dota 2 (AppID 570) и Deadlock (AppID 1422450)...');
    setProgress(100);
    setStatusLabel('Кэш Source 2 очищен (100%)');
    addLog(
      'OK',
      'Очищены папки steamapps\\shadercache\\570 и steamapps\\shadercache\\1422450 (освобождено 284.6 МБ).'
    );
  };

  const runSquadShaderClean = () => {
    if (isWorking) return;
    addLog('INFO', 'Безопасная очистка кэша шейдеров DirectX (D3DSCache) и %LocalAppData%\\SquadGame\\Saved...');
    setProgress(100);
    setStatusLabel('Кэш шейдеров Squad & DX очищен (100%)');
    addLog(
      'OK',
      'Удалены D3DSCache и SquadGame\\Saved\\ShaderCache (.ushaderprecache). Папка Config\\WindowsNoEditor\\Input.ini сохранена без изменений!'
    );
  };

  const simulateGameLaunchWatchdog = (profileId: 'dota2' | 'deadlock' | 'squad' | 'reforger') => {
    const profile = GAME_PROFILES.find((p) => p.id === profileId) || GAME_PROFILES[0];
    setSelectedProfileId(profileId);
    const fakePid = Math.floor(4200 + Math.random() * 9000);
    if (profileId === 'dota2' || profileId === 'deadlock') {
      addLog(
        'WATCHDOG',
        `Обнаружен процесс ${profile.exeName} (PID ${fakePid}): установлен HIGH_PRIORITY_CLASS + отключено Ядро 0 (CPU 0 Affinity mask: ядра 1..15).`
      );
    } else {
      addLog(
        'WATCHDOG',
        `Обнаружен процесс ${profile.exeName} (PID ${fakePid}): установлен высокий приоритет HIGH_PRIORITY_CLASS + очищен буфер Standby RAM.`
      );
    }
  };

  const activeProfile = GAME_PROFILES.find((g) => g.id === selectedProfileId) || GAME_PROFILES[0];
  const activeModeObj = getOptimizationModeById(optimizationMode);
  const estimatedRamSaved = calculateEstimatedRamSaved(selectedProcs, optimizationMode);
  const activeTweaksForProfile = getTweaksForProfile(optimizationMode);

  const handleCopyLaunchOptions = () => {
    navigator.clipboard.writeText(activeProfile.launchOptions);
    setCopiedLaunch(true);
    addLog('OK', `Параметры запуска для ${activeProfile.title} скопированы: ${activeProfile.launchOptions}`);
    setTimeout(() => setCopiedLaunch(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Окно имитации customtkinter */}
      <div className="rounded-xl border border-slate-800 bg-[#0D131F] overflow-hidden">
        {/* Нативная шапка окна Windows 11 */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#090D16] border-b border-slate-800/90 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium text-slate-200">
              Ultimate Game Booster Pro — 120+ One-Click FPS &amp; Input Lag Optimizer (Python 3.11 customtkinter GUI)
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-emerald-400">Administrator: True (UAC)</span>
            <span>·</span>
            <span className="text-slate-400">1160×820</span>
          </div>
        </div>

        {/* Тело окна GUI */}
        <div className="p-5 space-y-4">
          {/* Ряд 0: Верхний блок с главным действием BOOST (120+ фишек) и RESTORE */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl bg-[#111827] border border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-emerald-400 font-display">
                  ULTIMATE GAME BOOSTER PRO
                </h2>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  {systemBoosted
                    ? `Статус: ОПТИМИЗИРОВАНО (${activeModeObj.label} · ${activeModeObj.tweaksCount}/120 фишек)`
                    : `Пакет: ${activeModeObj.tweaksCount}/120 фишек готово к запуску`}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                120+ низкоуровневых твиков по 1 кнопке · Arma Reforger · Squad · Dota 2 · Deadlock · Полный откат Restore
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={runFullBoostSimulation}
                disabled={isWorking}
                className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>BOOST / ОПТИМИЗИРОВАТЬ ВСЁ ({activeModeObj.tweaksCount} ФИШЕК)</span>
              </button>

              <button
                type="button"
                onClick={runRestoreSimulation}
                disabled={isWorking}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-medium text-sm border border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Откатить изменения / Restore</span>
              </button>
            </div>
          </div>

          {/* Ряд 1: Селектор профиля оптимизации (CTkSegmentedButton) + распределение 120 фишек по 8 блокам */}
          <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-100">
                  Профиль оптимизации (выбор степени воздействия на систему):
                </span>
              </div>

              <div
                role="group"
                aria-label="Выбор профиля оптимизации"
                className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1 rounded-lg bg-[#192234] border border-slate-800 w-full md:w-auto"
              >
                {OPTIMIZATION_MODES.map((m) => {
                  const selected = optimizationMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      disabled={isWorking}
                      onClick={() => handleSelectOptimizationMode(m.id)}
                      className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        selected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-[#090D16] px-3.5 py-2.5 rounded-lg border border-slate-800/90">
              <span className="font-semibold text-emerald-400 mr-1.5">
                [{activeModeObj.label} — {activeModeObj.shortTag}]:
              </span>
              <span>{activeModeObj.description}</span>
            </div>

            {/* Распределение 120 фишек по 8 подсистемам ОС */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {TWEAK_CATEGORIES.map((cat) => {
                const countInProfile = activeTweaksForProfile.filter((t) => t.category === cat).length;
                return (
                  <div
                    key={cat}
                    className="px-3 py-2 rounded-lg bg-[#192234]/70 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <span className="text-slate-300 font-medium">{cat}</span>
                    <span className="text-emerald-400 font-mono font-semibold tabular-nums shrink-0">
                      {countInProfile} фишек
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ряд 2: Центральная сетка 2 колонки: слева чекбоксы Debloat, справа профили игр и лог */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Левая колонка: Debloat процессов и Watchdog */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-[#111827] border border-slate-800 p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-100">
                    Завершение фоновых процессов (Debloat)
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 tabular-nums">
                    {optimizationMode === 'minimal'
                      ? 'Пропуск (Лайт-профиль)'
                      : `~${estimatedRamSaved} МБ ОЗУ`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {optimizationMode === 'minimal' ? (
                    <span className="text-amber-300">
                      В профиле «Минимальное вмешательство» фоновые приложения НЕ закрываются принудительно.
                    </span>
                  ) : (
                    <>
                      Отметьте ресурсоемкие клиенты и браузеры для выгрузки перед игрой.{' '}
                      <strong className="text-slate-200">Steam и Discord</strong> защищены в белом списке:
                    </>
                  )}
                </p>

                {/* Список чекбоксов */}
                <div className="max-h-72 overflow-y-auto pr-1 space-y-1.5 rounded-lg bg-[#192234] p-3 border border-slate-800/80">
                  {KILLABLE_PROCESSES.map((proc) => {
                    const checked = selectedProcs.includes(proc.id);
                    return (
                      <label
                        key={proc.id}
                        className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-800/70 cursor-pointer transition-colors text-xs ${
                          optimizationMode === 'minimal' ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleProcess(proc.id)}
                            className="w-4 h-4 rounded accent-emerald-500 cursor-pointer shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-slate-200 font-medium">{proc.name}</span>
                            <span className="text-slate-400 ml-1.5 font-mono text-[11px]">
                              ({proc.exe})
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 tabular-nums shrink-0">
                          {proc.ramMb} МБ
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Защищенный белый список и переключатель psutil Watchdog */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Неприкосновенные процессы: </span>
                  <span className="font-mono">{PROTECTED_WHITELIST.slice(0, 6).join(' · ')}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#192234] border border-slate-800">
                  <div className="pr-2">
                    <div className="text-xs font-semibold text-slate-200">
                      Авто-мониторинг игр (psutil Watchdog)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      HIGH_PRIORITY_CLASS + отключение CPU 0 для Source 2
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={watchdogEnabled}
                    aria-label="Переключить авто-мониторинг игр"
                    onClick={() => {
                      const next = !watchdogEnabled;
                      setWatchdogEnabled(next);
                      addLog(
                        'INFO',
                        `Фоновый мониторинг процессов игр (psutil Watchdog): ${next ? 'ВКЛЮЧЕН' : 'ПАУЗА'}.`
                      );
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0 ${
                      watchdogEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {watchdogEnabled ? 'АКТИВЕН' : 'ВЫКЛ'}
                  </button>
                </div>
              </div>
            </div>

            {/* Правая колонка: Профили игр + Живой лог выполнения */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-[#111827] border border-slate-800 p-4 space-y-4">
              {/* Специфическая оптимизация под игры */}
              <div className="p-3.5 rounded-lg bg-[#192234] border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Целевые игровые профили (кликните для проверки psutil-профиля):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {GAME_PROFILES.map((prof) => (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => simulateGameLaunchWatchdog(prof.id)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          selectedProfileId === prof.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {prof.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Быстрые кнопки очистки шейдеров */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={runSource2ShaderClean}
                    disabled={isWorking}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Очистить кэш шейдеров Dota 2 &amp; Deadlock</span>
                  </button>

                  <button
                    type="button"
                    onClick={runSquadShaderClean}
                    disabled={isWorking}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Очистить кэш шейдеров Squad &amp; DirectX</span>
                  </button>
                </div>

                {/* Рекомендуемые параметры запуска Steam */}
                <div className="flex items-center justify-between gap-2 p-2 rounded bg-[#0D131F] border border-slate-800">
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-slate-400">
                      Параметры запуска Steam ({activeProfile.title} — {activeProfile.engine}):
                    </div>
                    <div className="font-mono text-xs text-emerald-300 truncate">
                      {activeProfile.launchOptions}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLaunchOptions}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {copiedLaunch ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Скопировано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Копировать</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Поле вывода лога выполнения действий в реальном времени */}
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    Журнал выполнения действий в реальном времени (CTkTextbox Log):
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setLogs([
                        {
                          id: Date.now(),
                          time: nowStr(),
                          tag: 'INFO',
                          text: 'Журнал очищен пользователем. Готов к выполнению 120+ фишек.',
                        },
                      ])
                    }
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Очистить лог
                  </button>
                </div>

                <div
                  ref={logContainerRef}
                  data-testid="execution-log-box"
                  className="h-64 overflow-y-auto rounded-lg bg-[#070A10] border border-slate-800 p-3 font-mono text-xs space-y-1.5"
                >
                  {logs.map((entry) => {
                    let tagColor = 'text-emerald-400';
                    if (entry.tag === 'INFO') tagColor = 'text-sky-400';
                    if (entry.tag === 'WARN') tagColor = 'text-amber-400';
                    if (entry.tag === 'WATCHDOG') tagColor = 'text-purple-400';
                    if (entry.tag === 'START') tagColor = 'text-emerald-300 font-semibold';

                    return (
                      <div key={entry.id} className="leading-relaxed break-words">
                        <span className="text-slate-500 select-none">[{entry.time}] </span>
                        <span className={`${tagColor} font-semibold`}>[{entry.tag}] </span>
                        <span className="text-slate-200">{entry.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Ряд 3: Нижняя строка прогресс-бара */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#111827] border border-slate-800">
            <div className="flex-1 bg-slate-800 h-3.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-transform duration-200 origin-left"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
            <div className="font-mono text-xs font-semibold text-slate-200 tabular-nums shrink-0">
              {statusLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Сводная таблица выполняемых низкоуровневых операций */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Матрица 120+ фишек по 1 кнопке</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Единый пакет <code className="text-slate-200">REGISTRY_FPS_MATRIX</code> применяет до 120 твиков: HAGS, отключение MPO,
            кванты <code className="text-slate-200">0x26</code>, линейный ввод мыши 1:1, очереди HID=20, PCIe ASPM Off и Nagle OFF.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>CPU 0 Affinity &amp; MMCSS</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Выставление кванта <code className="text-slate-200">Win32PrioritySeparation = 0x26</code> (38 Dec), отключение парковки ядер и снятие нагрузки с Ядра 0 в{' '}
            <code className="text-slate-200">dota2.exe</code> и <code className="text-slate-200">project8.exe</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Standby RAM &amp; D3DSCache</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Системный вызов <code className="text-slate-200">ntdll.NtSetSystemInformation</code> освобождает кэшированную память Standby List перед запуском Squad и Arma Reforger.
          </p>
        </div>
      </div>
    </div>
  );
};
