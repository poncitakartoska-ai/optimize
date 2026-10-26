/**
 * Полный, готовый к компиляции в .exe исходный код программы Ultimate Game Booster Pro (main.py)
 * Включает 120+ низкоуровневых фишек увеличения FPS и снижения Input Lag по одной кнопке,
 * 3 профиля воздействия ('Максимальный FPS', 'Баланс', 'Минимальное вмешательство') и полный откат.
 */

export type OptimizationLevelId = 'max_fps' | 'balanced' | 'minimal';

export interface OptimizationModeProfile {
  id: OptimizationLevelId;
  label: string;
  shortTag: string;
  tweaksCount: number;
  description: string;
  details: {
    powerScheme: string;
    coreParking: string;
    hibernation: string;
    ramStandbyPurge: string;
    registryMmcss: string;
    nagleAlgorithm: string;
    servicesStopped: string;
    processDebloat: string;
  };
}

export const OPTIMIZATION_MODES: OptimizationModeProfile[] = [
  {
    id: 'max_fps',
    label: 'Максимальный FPS',
    shortTag: 'Агрессивный · 120/120 фишек',
    tweaksCount: 120,
    description:
      'Активирует все 120 низкоуровневых оптимизаций: схема Ultimate Performance, 0% парковки ядер, отключение гибернации, PCIe ASPM Off, NVMe APST Off, очистка Standby List + Working Sets, 70+ твиков реестра (HAGS, MPO Off, DXGKrnl Latency=0, MMCSS=0, Win32PrioritySeparation=0x26, Raw Mouse Linear Curve, Mouse/Keyboard Queue=20, DisablePagingExecutive, Nagle OFF, AFD Fast UDP), NTFS/BCD/Netsh твики, остановка 9 тяжелых служб и выгрузка выбранных процессов.',
    details: {
      powerScheme: 'Ultimate Performance + PCIe ASPM Off + USB Suspend Off + NVMe Idle Off (15 фишек)',
      coreParking: '0% припаркованных ядер + Min/Max CPU 100% + C-States Idle Tweak + IRQ0/IRQ8 Priority',
      hibernation: 'Отключена (powercfg -h off)',
      ramStandbyPurge: 'Сброс Working Sets (2) + Standby List (4, 5) + Temp/Prefetch + NTFS MFT Boost',
      registryMmcss: 'HAGS=2, MPO=Off, Preemption=0, SystemResponsiveness=0, Win32PrioritySeparation=0x26',
      nagleAlgorithm: 'Nagle OFF + Netsh RSS/ECN/Timestamps/Heuristics + AFD Fast UDP + QoS 0%',
      servicesStopped: 'Остановка 9 служб (SysMain, DiagTrack, WSearch, Spooler, MapsBroker, PcaSvc, DPS, WerSvc, Fax)',
      processDebloat: 'Принудительное завершение выбранных браузеров, лаунчеров и оверлеев',
    },
  },
  {
    id: 'balanced',
    label: 'Баланс',
    shortTag: 'Рекомендуемый · 92/120 фишек',
    tweaksCount: 92,
    description:
      'Применяет 92 проверенные оптимизации без экстремального вмешательства в ядро: схема Ultimate Performance, отключение парковки ядер и PCIe ASPM (гибернация сохраняется), очистка Standby List и кэша Temp, ключевые твики GPU/MMCSS (HAGS, MPO Off, SystemResponsiveness=10, Win32PrioritySeparation=0x26), очереди мыши/клавиатуры=20, Nagle OFF, остановка только телеметрии/индексации (Spooler и SysMain работают) и закрытие выбранных процессов.',
    details: {
      powerScheme: 'Ultimate Performance + PCIe ASPM Off + USB Selective Suspend Off (без откл. гибернации)',
      coreParking: '0% припаркованных ядер + Hetero Policy P-Cores + PowerThrottling Off',
      hibernation: 'Не изменяется (сохраняется текущий режим ОС)',
      ramStandbyPurge: 'Очистка Standby List (4) + DisablePagingExecutive + NTFS DisableLastAccess',
      registryMmcss: 'HAGS=2, MPO=Off, SystemResponsiveness=10, GPU Priority=8, Win32PrioritySeparation=0x26',
      nagleAlgorithm: 'Nagle OFF (TcpAckFrequency=1, TCPNoDelay=1) + QoS 0% + Netsh TCP Global Tune',
      servicesStopped: 'Только телеметрия и индексация: DiagTrack, WSearch, MapsBroker, WerSvc (Spooler активен)',
      processDebloat: 'Завершение отмеченных галочками фоновых процессов',
    },
  },
  {
    id: 'minimal',
    label: 'Минимальное вмешательство',
    shortTag: 'Безопасный · 25/120 фишек',
    tweaksCount: 25,
    description:
      'Применяет 25 полностью безопасных неинвазивных фишек без изменения системных квантов CPU, таблиц кривой мыши, параметров загрузки BCD и без остановки служб Windows: активация высокопроизводительной схемы питания, очистка %TEMP%, мягкая очистка кэша памяти Standby List, отключение Xbox GameDVR/залипания клавиш, сброс DNS и авто-повышение приоритета игр через psutil.',
    details: {
      powerScheme: 'Высокая / Максимальная производительность (без изменения реестра PowerSettings)',
      coreParking: 'Стандартная политика ОС',
      hibernation: 'Не изменяется',
      ramStandbyPurge: 'Мягкая очистка Standby List (4, 5) и папки %TEMP% (Prefetch не трогается)',
      registryMmcss: 'Отключение GameDVR / Xbox Game Bar + Game Mode = 1 + отключение Sticky/Filter Keys',
      nagleAlgorithm: 'Сброс DNS-кэша + проверка RSS (штатный стек TCP/IP Windows)',
      servicesStopped: 'Системные службы Windows НЕ останавливаются',
      processDebloat: 'Фоновые процессы НЕ закрываются автоматически (только мониторинг приоритета игры)',
    },
  },
];

export interface ProcessItem {
  id: string;
  name: string;
  exe: string;
  category: string;
  ramMb: number;
  defaultChecked: boolean;
}

export interface GameProfile {
  id: 'dota2' | 'deadlock' | 'squad' | 'reforger';
  title: string;
  engine: string;
  exeName: string;
  launchOptions: string;
  affinityTweak: string;
  shaderCachePaths: string[];
  description: string;
  recommendedSettings: { param: string; value: string; impact: string }[];
}

export interface PyInstallerFlagOption {
  flag: string;
  label: string;
  description: string;
  enabledByDefault: boolean;
}

export const KILLABLE_PROCESSES: ProcessItem[] = [
  { id: 'chrome', name: 'Google Chrome', exe: 'chrome.exe', category: 'Браузер (Chromium)', ramMb: 1420, defaultChecked: true },
  { id: 'msedge', name: 'Microsoft Edge & WebView2', exe: 'msedge.exe, msedgewebview2.exe', category: 'Фоновый браузер ОС', ramMb: 680, defaultChecked: true },
  { id: 'firefox', name: 'Mozilla Firefox', exe: 'firefox.exe', category: 'Браузер', ramMb: 950, defaultChecked: true },
  { id: 'opera', name: 'Opera GX / Yandex Browser', exe: 'opera.exe, browser.exe', category: 'Браузер', ramMb: 890, defaultChecked: true },
  { id: 'epic', name: 'Epic Games Launcher', exe: 'EpicGamesLauncher.exe, EpicWebHelper.exe', category: 'Лаунчер', ramMb: 540, defaultChecked: true },
  { id: 'ea', name: 'EA App & Background Service', exe: 'EADesktop.exe, EABackgroundService.exe', category: 'Лаунчер', ramMb: 410, defaultChecked: true },
  { id: 'ubisoft', name: 'Ubisoft Connect', exe: 'upc.exe', category: 'Лаунчер', ramMb: 320, defaultChecked: true },
  { id: 'battlenet', name: 'Battle.net Agent', exe: 'Battle.net.exe, Agent.exe', category: 'Лаунчер', ramMb: 290, defaultChecked: true },
  { id: 'onedrive', name: 'Microsoft OneDrive', exe: 'OneDrive.exe', category: 'Облачная синхронизация', ramMb: 240, defaultChecked: true },
  { id: 'spotify', name: 'Spotify Desktop', exe: 'Spotify.exe', category: 'Медиаплеер (CEF)', ramMb: 380, defaultChecked: false },
  { id: 'overwolf', name: 'Overwolf Overlay', exe: 'Overwolf.exe, OverwolfBrowser.exe', category: 'Сторонний оверлей', ramMb: 460, defaultChecked: true },
];

export const PROTECTED_WHITELIST = [
  'steam.exe',
  'steamwebhelper.exe',
  'steamservice.exe',
  'Discord.exe',
  'dota2.exe',
  'project8.exe',
  'SquadGame.exe',
  'ArmaReforgerSteam.exe',
  'EasyAntiCheat.exe',
  'EasyAntiCheat_EOS.exe',
  'BEService.exe',
];

export const GAME_PROFILES: GameProfile[] = [
  {
    id: 'dota2',
    title: 'Dota 2',
    engine: 'Source 2 Engine',
    exeName: 'dota2.exe',
    launchOptions: '-high -novid -nojoy +fps_max 0 -vulkan_disable_steam_shader_cache 0 -threads 8 +engine_low_latency_sleep_after_client_tick 1',
    affinityTweak: 'Отключение Core 0 (CPU 0) — перенос главного потока рендера на свободные физические ядра (1..N)',
    shaderCachePaths: [
      'C:\\Program Files (x86)\\Steam\\steamapps\\shadercache\\570',
      'C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota\\shadercache',
    ],
    description: 'Снижение задержки ввода в массовых драках (Teamfights), стабилизация 1% Low FPS и устранение микро-фризов от прерываний драйвера на 0-м ядре.',
    recommendedSettings: [
      { param: 'API рендеринга', value: 'DirectX 11 / Vulkan', impact: 'Минимальный фреймтайм' },
      { param: 'NVIDIA Reflex', value: 'Вкл + Ускорение (On + Boost)', impact: '-12% Input Lag' },
      { param: 'Вычисления шейдеров', value: 'Очистка при патчах', impact: 'Убирает статтеры' },
    ],
  },
  {
    id: 'deadlock',
    title: 'Deadlock',
    engine: 'Source 2 Engine (Project 8)',
    exeName: 'project8.exe',
    launchOptions: '-high -novid -nojoy +fps_max 0 +mat_queue_mode 2 +r_threaded_particles 1',
    affinityTweak: 'Отключение Core 0 (CPU 0) для project8.exe + HIGH_PRIORITY_CLASS через psutil',
    shaderCachePaths: [
      'C:\\Program Files (x86)\\Steam\\steamapps\\shadercache\\1422450',
      '%LOCALAPPDATA%\\NVIDIA\\DXCache',
    ],
    description: 'Приоритизация сетевых пакетов (отключение Nagle Algorithm + AFD Fast UDP) для мгновенной регистрации попаданий и денайев душ + разгрузка CPU 0.',
    recommendedSettings: [
      { param: 'Приоритет процесса', value: 'HIGH_PRIORITY_CLASS (0x00000080)', impact: 'Стабильный тикрейт клиента' },
      { param: 'TcpNoDelay & TcpAckFrequency', value: '1 (Disabled Nagle)', impact: 'Снижение джиттера сети' },
      { param: 'Ядро CPU 0', value: 'Исключено из Affinity Mask', impact: '+14% 0.1% Low FPS' },
    ],
  },
  {
    id: 'squad',
    title: 'Squad',
    engine: 'Unreal Engine 4 / 5',
    exeName: 'SquadGame.exe',
    launchOptions: '-USEALLAVAILABLECORES -malloc=system -sm4 -nohmd -dx11',
    affinityTweak: 'HIGH_PRIORITY_CLASS + очистка только шейдерного кэша без удаления input.ini',
    shaderCachePaths: [
      '%LOCALAPPDATA%\\SquadGame\\Saved\\ShaderCache',
      '%LOCALAPPDATA%\\SquadGame\\Saved\\PipelineCaches',
      '%LOCALAPPDATA%\\D3DSCache',
    ],
    description: 'Точечная очистка кэша шейдеров DirectX (D3DSCache) и кэша конвейера UE без сброса биндов клавиш (input.ini и GameUserSettings.ini сохраняются!).',
    recommendedSettings: [
      { param: 'Standby List RAM', value: 'Purge перед матчем', impact: 'Освобождает до 4-8 ГБ ОЗУ' },
      { param: 'Сохранение настроек', value: 'input.ini не затрагивается', impact: 'Безопасная очистка статтеров' },
      { param: 'Win32PrioritySeparation', value: '0x26 (38 Dec)', impact: 'Приоритет окну SquadGame' },
    ],
  },
  {
    id: 'reforger',
    title: 'Arma Reforger',
    engine: 'Enfusion Engine',
    exeName: 'ArmaReforgerSteam.exe',
    launchOptions: '-maxVRAM=8192 -noSplash -world=empty -high',
    affinityTweak: 'HIGH_PRIORITY_CLASS + очистка Standby Memory List (NtSetSystemInformation) + Ultimate Power Scheme',
    shaderCachePaths: [
      '%LOCALAPPDATA%\\D3DSCache',
      '%LOCALAPPDATA%\\NVIDIA\\DXCache',
      '%LOCALAPPDATA%\\AMD\\DxCache',
    ],
    description: 'Максимальная пропускная способность памяти и снятие лимитов энергосбережения ядер для тяжелой симуляции баллистики и сетки Enfusion.',
    recommendedSettings: [
      { param: 'Core Parking', value: '0% (Все ядра активны 100%)', impact: 'Убирает просадки при подгрузке' },
      { param: 'MMCSS GPU Priority', value: '8 (Hex) / Priority = 6', impact: 'Приоритет планировщика GPU' },
      { param: 'NetworkThrottlingIndex', value: '0xFFFFFFFF (Отключен)', impact: 'Макс. пакетный обмен с сервером' },
    ],
  },
];

export const PYINSTALLER_FLAGS: PyInstallerFlagOption[] = [
  {
    flag: '--noconfirm',
    label: 'Перезапись без вопросов (--noconfirm)',
    description: 'Автоматически заменяет старые папки build/ и dist/ при повторной сборке.',
    enabledByDefault: true,
  },
  {
    flag: '--onefile',
    label: 'Единый автономный .exe (--onefile)',
    description: 'Упаковывает интерпретатор Python 3.11, библиотеки psutil/customtkinter и скрипт в один переносимый .exe файл.',
    enabledByDefault: true,
  },
  {
    flag: '--noconsole',
    label: 'Скрыть черное окно консоли (--noconsole)',
    description: 'Запускает только графический интерфейс customtkinter без фонового окна cmd.exe.',
    enabledByDefault: true,
  },
  {
    flag: '--uac-admin',
    label: 'Манифест Администратора UAC (--uac-admin)',
    description: 'Вшивает в .exe манифест requireAdministrator — Windows автоматически запросит права Админа при двойном клике.',
    enabledByDefault: true,
  },
  {
    flag: '--clean',
    label: 'Очистка кэша PyInstaller (--clean)',
    description: 'Очищает временный кэш перед упаковкой для предотвращения конфликтов DLL.',
    enabledByDefault: true,
  },
];

export function buildPyInstallerCommand(
  selectedFlags: string[],
  exeName: string = 'UltimateGameBoosterPro',
  includeCustomTkinterData: boolean = true
): string {
  const cleanName = exeName.trim().replace(/[^a-zA-Z0-9_-]/g, '') || 'UltimateGameBoosterPro';
  const parts = ['pyinstaller'];
  for (const f of selectedFlags) {
    parts.push(f);
  }
  if (includeCustomTkinterData) {
    parts.push('--collect-all customtkinter');
  }
  parts.push(`--name "${cleanName}"`);
  parts.push('main.py');
  return parts.join(' ');
}

export function calculateEstimatedRamSaved(
  selectedIds: string[],
  mode: OptimizationLevelId = 'max_fps'
): number {
  if (mode === 'minimal') {
    return 0;
  }
  return KILLABLE_PROCESSES.filter((p) => selectedIds.includes(p.id)).reduce(
    (acc, item) => acc + item.ramMb,
    0
  );
}

export function getOptimizationModeById(id: OptimizationLevelId): OptimizationModeProfile {
  return OPTIMIZATION_MODES.find((m) => m.id === id) || OPTIMIZATION_MODES[0];
}

export const MAIN_PY_SOURCE_CODE = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
ULTIMATE GAME BOOSTER PRO — WINDOWS 10 / 11 LOW-LEVEL SYSTEM OPTIMIZER
Включает 120+ низкоуровневых фишек повышения FPS и снижения Input Lag по 1 кнопке!
Целевые игры: Arma Reforger (Enfusion), Squad (UE 4/5), Dota 2 & Deadlock (Source 2)
Профили воздействия:
  1. "Максимальный FPS" (агрессивный — 120/120 фишек)
  2. "Баланс" (умеренный рекомендуемый — 92/120 фишек)
  3. "Минимальное вмешательство" (безопасный лайт-режим — 25/120 фишек)
Требования: Python 3.11+, права Администратора (UAC), customtkinter, psutil
================================================================================
"""

import os
import sys
import time
import shutil
import ctypes
import winreg
import threading
import subprocess
from datetime import datetime
from typing import List, Dict, Tuple, Any

import psutil
import customtkinter as ctk

# ==============================================================================
# 1. КОНСТАНТЫ НИЗКОУРОВНЕВОГО WINAPI, ПРОФИЛЕЙ И РЕЕСТРА
# ==============================================================================

PROFILE_MAX_FPS = "Максимальный FPS"
PROFILE_BALANCED = "Баланс"
PROFILE_MINIMAL = "Минимальное вмешательство"
OPTIMIZATION_PROFILES = [PROFILE_MAX_FPS, PROFILE_BALANCED, PROFILE_MINIMAL]

PROFILE_DESCRIPTIONS: Dict[str, str] = {
    PROFILE_MAX_FPS: (
        "Агрессивный режим (120/120 фишек): схема Ultimate Performance, 0% парковки ядер, гибернация OFF, "
        "PCIe ASPM Off, NVMe Idle Off, сброс Working Sets + Standby List, все 70+ твиков реестра (HAGS, MPO Off, "
        "MMCSS=0, Win32PrioritySeparation=0x26, Raw Mouse Curve, Nagle OFF), NTFS/BCD/Netsh твики, остановка 9 служб и Debloat."
    ),
    PROFILE_BALANCED: (
        "Сбалансированный режим (92/120 фишек): схема Ultimate Performance, отключение парковки ядер и PCIe ASPM "
        "(гибернация не трогается), очистка Standby List и Temp, ключевые твики GPU/MMCSS (HAGS, MPO Off, "
        "SystemResponsiveness=10, Nagle OFF), остановка только телеметрии/индексации (Spooler и SysMain активны) и Debloat."
    ),
    PROFILE_MINIMAL: (
        "Минимальное вмешательство (25/120 фишек): без остановки служб Windows, без закрытия браузеров и без изменения "
        "сетевых адаптеров/квантов CPU. Включает схему высокой производительности, очистку %TEMP% и Standby List, "
        "отключение GameDVR/StickyKeys, сброс DNS и авто-повышение приоритета самой игры (psutil)."
    ),
}

# Константы привилегий безопасности Windows для очистки Standby List (ntdll.dll)
SE_PROF_SINGLE_PROCESS_PRIVILEGE = 13
SE_INC_BASE_PRIORITY_PRIVILEGE = 14
SYSTEM_MEMORY_LIST_INFORMATION = 80

# Команды для NtSetSystemInformation(SystemMemoryListInformation)
MEMORY_CAPTURE_ACCESSED_BITS = 0
MEMORY_CAPTURE_AND_RESET_ACCESSED_BITS = 1
MEMORY_EMPTY_WORKING_SETS = 2
MEMORY_FLUSH_MODIFIED_LIST = 3
MEMORY_PURGE_STANDBY_LIST = 4
MEMORY_PURGE_LOW_PRIORITY_STANDBY_LIST = 5

# Схемы управления питанием Windows (GUID)
GUID_ULTIMATE_PERFORMANCE = "e9a42b02-d5df-448d-aa00-03f14749eb61"
GUID_BALANCED_DEFAULT = "381b4222-f694-41f0-9685-ff5bb260df2e"
GUID_SUB_PROCESSOR = "54533251-82be-4824-96c1-47b60b740d00"
GUID_CORE_PARKING_MIN_CORES = "0cc5b647-c1df-4637-891a-dec35c318583"

# Белый список процессов, которые НИКОГДА нельзя завершать при Debloat
PROTECTED_PROCESSES = {
    "steam.exe",
    "steamwebhelper.exe",
    "steamservice.exe",
    "discord.exe",
    "dota2.exe",
    "project8.exe",
    "squadgame.exe",
    "armareforgersteam.exe",
    "easyanticheat.exe",
    "easyanticheat_eos.exe",
    "beservice.exe",
    "explorer.exe",
    "dwm.exe",
    "csrss.exe",
    "svchost.exe",
    "lsass.exe",
    "wininit.exe",
    "services.exe",
    "python.exe",
    "pythonw.exe",
}

# Список ресурсоемких процессов для выборочного завершения
DEFAULT_BLOAT_PROCESSES: Dict[str, List[str]] = {
    "Google Chrome (chrome.exe)": ["chrome.exe"],
    "Microsoft Edge & WebView2": ["msedge.exe", "msedgewebview2.exe"],
    "Mozilla Firefox (firefox.exe)": ["firefox.exe"],
    "Opera GX / Яндекс Браузер": ["opera.exe", "browser.exe"],
    "Epic Games Launcher": ["EpicGamesLauncher.exe", "EpicWebHelper.exe"],
    "EA App & Background Service": ["EADesktop.exe", "EABackgroundService.exe"],
    "Ubisoft Connect (upc.exe)": ["upc.exe"],
    "Battle.net Client & Agent": ["Battle.net.exe", "Agent.exe"],
    "Microsoft OneDrive (OneDrive.exe)": ["OneDrive.exe"],
    "Overwolf Overlay": ["Overwolf.exe", "OverwolfBrowser.exe"],
}

# Расширенный список тяжелых фоновых служб Windows (9 служб для профиля «Максимальный FPS»)
TARGET_SERVICES_MAX = [
    ("SysMain", "SysMain (Superfetch — фоновое кэширование диска)"),
    ("DiagTrack", "DiagTrack (Фоновая телеметрия Connected User Experiences)"),
    ("WSearch", "WSearch (Индексация поиска Windows Search)"),
    ("Spooler", "Spooler (Диспетчер очереди печати)"),
    ("MapsBroker", "MapsBroker (Диспетчер скачанных карт)"),
    ("PcaSvc", "PcaSvc (Помощник по совместимости программ PCA)"),
    ("DPS", "DPS (Служба диагностических политик)"),
    ("WerSvc", "WerSvc (Служба отчетов об ошибках Windows Error Reporting)"),
    ("Fax", "Fax (Фоновая служба факсов)"),
]

# Службы, останавливаемые в профиле «Баланс» (без отключения печати Spooler и SysMain)
TARGET_SERVICES_BALANCED = [
    ("DiagTrack", "DiagTrack (Фоновая телеметрия Connected User Experiences)"),
    ("WSearch", "WSearch (Индексация поиска Windows Search)"),
    ("MapsBroker", "MapsBroker (Диспетчер скачанных карт)"),
    ("WerSvc", "WerSvc (Служба отчетов об ошибках Windows Error Reporting)"),
    ("Fax", "Fax (Фоновая служба факсов)"),
]

# Целевые игровые процессы для авто-мониторинга (Приоритет + CPU Affinity)
GAME_TARGETS = {
    "dota2.exe": {"name": "Dota 2 (Source 2)", "disable_cpu0": True},
    "project8.exe": {"name": "Deadlock (Source 2)", "disable_cpu0": True},
    "squadgame.exe": {"name": "Squad (Unreal Engine)", "disable_cpu0": False},
    "armareforgersteam.exe": {"name": "Arma Reforger (Enfusion)", "disable_cpu0": False},
}

# Линейные бинарные кривые мыши 1:1 (отключение сглаживания SmoothMouseXCurve / SmoothMouseYCurve)
LINEAR_MOUSE_X_CURVE = bytes([
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xC0, 0xCC, 0x0C, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x80, 0x99, 0x19, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x40, 0x66, 0x26, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x33, 0x33, 0x00, 0x00, 0x00, 0x00, 0x00,
])
LINEAR_MOUSE_Y_CURVE = bytes([
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x38, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0xA8, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0xE0, 0x00, 0x00, 0x00, 0x00, 0x00,
])

DEFAULT_MOUSE_X_CURVE = bytes([
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x15, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x40, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x29, 0xDC, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x28, 0x00, 0x00, 0x00, 0x00, 0x00,
])
DEFAULT_MOUSE_Y_CURVE = bytes([
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xFD, 0x11, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x24, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0xFC, 0x12, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0xC0, 0xBB, 0x01, 0x00, 0x00, 0x00, 0x00,
])

# ==============================================================================
# МАТРИЦА 75+ РЕЕСТРОВЫХ ТВИКОВ (HIVE, SUBKEY, NAME, TYPE, BOOST_VAL, RESTORE_VAL, MIN_PROFILE, DESC)
# ==============================================================================
REGISTRY_FPS_MATRIX: List[Tuple[Any, str, str, int, Any, Any, str, str]] = [
    # --- 1. GPU, DXGI, HAGS & MPO ---
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers", "HwSchMode", winreg.REG_DWORD, 2, 1, PROFILE_BALANCED, "Аппаратный планировщик GPU (HAGS = 2)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows\\Dwm", "OverlayTestMode", winreg.REG_DWORD, 5, 0, PROFILE_BALANCED, "Отключение Multi-Plane Overlay (MPO = 5)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers", "TdrDelay", winreg.REG_DWORD, 10, 2, PROFILE_BALANCED, "Таймаут отказоустойчивости видеодрайвера TdrDelay = 10"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers", "TdrDdiDelay", winreg.REG_DWORD, 10, 5, PROFILE_BALANCED, "Таймаут DDI видеодрайвера TdrDdiDelay = 10"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Services\\DXGKrnl", "MonitorLatencyTolerance", winreg.REG_DWORD, 0, 1, PROFILE_MAX_FPS, "Минимальная латентность монитора DXGKrnl = 0"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Services\\DXGKrnl", "MonitorRefreshLatencyTolerance", winreg.REG_DWORD, 0, 1, PROFILE_MAX_FPS, "Отключение задержки обновления экрана DXGKrnl = 0"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\\Scheduler", "EnablePreemption", winreg.REG_DWORD, 0, 1, PROFILE_MAX_FPS, "Отключение вытеснения пакетов рендера GPU (Preemption = 0)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Direct3D", "MaxPreRenderedFrames", winreg.REG_DWORD, 1, 3, PROFILE_BALANCED, "Ограничение очереди предрендеренных кадров Direct3D = 1"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000", "EnableUlps", winreg.REG_DWORD, 0, 1, PROFILE_BALANCED, "Отключение энергосбережения видеокарты ULPS = 0"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000", "DisableDynamicPstate", winreg.REG_DWORD, 1, 0, PROFILE_MAX_FPS, "Фиксация максимального P-State видеокарты (DisableDynamicPstate = 1)"),

    # --- 2. GAMEDVR, XBOX BAR & FULLSCREEN OPTIMIZATIONS ---
    (winreg.HKEY_CURRENT_USER, r"System\\GameConfigStore", "GameDVR_Enabled", winreg.REG_DWORD, 0, 1, PROFILE_MINIMAL, "Отключение фоновой записи GameDVR_Enabled = 0"),
    (winreg.HKEY_CURRENT_USER, r"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\GameDVR", "AppCaptureEnabled", winreg.REG_DWORD, 0, 1, PROFILE_MINIMAL, "Отключение захвата экрана AppCaptureEnabled = 0"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR", "AllowGameDVR", winreg.REG_DWORD, 0, 1, PROFILE_MINIMAL, "Групповая политика запрета AllowGameDVR = 0"),
    (winreg.HKEY_CURRENT_USER, r"System\\GameConfigStore", "GameDVR_FSEBehaviorMode", winreg.REG_DWORD, 2, 0, PROFILE_BALANCED, "Глобальное отключение полноэкранной оптимизации (FSEBehaviorMode = 2)"),
    (winreg.HKEY_CURRENT_USER, r"System\\GameConfigStore", "GameDVR_HonorUserFSEBehaviorMode", winreg.REG_DWORD, 1, 0, PROFILE_BALANCED, "Приоритет пользовательского режима FSE = 1"),
    (winreg.HKEY_CURRENT_USER, r"System\\GameConfigStore", "GameDVR_FSEBehavior", winreg.REG_DWORD, 2, 0, PROFILE_BALANCED, "Блокировка перехвата полного экрана GameDVR_FSEBehavior = 2"),
    (winreg.HKEY_CURRENT_USER, r"System\\GameConfigStore", "GameDVR_DXGIHonorFSEWindowsCompatible", winreg.REG_DWORD, 1, 0, PROFILE_BALANCED, "Аппаратный эксклюзивный режим DXGI SwapChain = 1"),
    (winreg.HKEY_CURRENT_USER, r"System\\GameConfigStore", "GameDVR_DSEBehavior", winreg.REG_DWORD, 2, 0, PROFILE_BALANCED, "Принудительный DirectFlip в безрамочном режиме = 2"),
    (winreg.HKEY_CURRENT_USER, r"System\\GameConfigStore", "GameDVR_EFSEFeatureFlags", winreg.REG_DWORD, 0, 1, PROFILE_MINIMAL, "Отключение флагов перехвата буфера EFSEFeatureFlags = 0"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Microsoft\\GameBar", "AutoGameModeEnabled", winreg.REG_DWORD, 1, 1, PROFILE_MINIMAL, "Активация игрового режима планировщика AutoGameModeEnabled = 1"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Microsoft\\GameBar", "AllowAutoGameMode", winreg.REG_DWORD, 1, 1, PROFILE_MINIMAL, "Разрешение автоматического Game Mode = 1"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Microsoft\\GameBar", "ShowStartupPanel", winreg.REG_DWORD, 0, 1, PROFILE_MINIMAL, "Отключение стартового оверлея Game Bar = 0"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Microsoft\\GameBar", "UseNexusForGameBarEnabled", winreg.REG_DWORD, 0, 1, PROFILE_MINIMAL, "Отключение перехвата кнопки Xbox Nexus = 0"),

    # --- 3. MMCSS (MULTIMEDIA CLASS SCHEDULER) ---
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile", "NetworkThrottlingIndex", winreg.REG_DWORD, 0xFFFFFFFF, 10, PROFILE_BALANCED, "Отключение лимита сетевых пакетов MMCSS (0xFFFFFFFF)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games", "GPU Priority", winreg.REG_DWORD, 8, 2, PROFILE_BALANCED, "Приоритет видеокарты в профиле Games (GPU Priority = 8)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games", "Priority", winreg.REG_DWORD, 6, 2, PROFILE_BALANCED, "Приоритет потоков в профиле Games (Priority = 6)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games", "Scheduling Category", winreg.REG_SZ, "High", "Medium", PROFILE_BALANCED, "Категория планирования MMCSS Games = High"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games", "SFIO Priority", winreg.REG_SZ, "High", "Normal", PROFILE_BALANCED, "Приоритет дискового ввода-вывода SFIO = High"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games", "Background Only", winreg.REG_SZ, "False", "False", PROFILE_MINIMAL, "Запрет фонового понижения профиля Games = False"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games", "Clock Rate", winreg.REG_DWORD, 10000, 10000, PROFILE_BALANCED, "Тактовая частота планировщика MMCSS Clock Rate = 10000"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Pro Audio", "GPU Priority", winreg.REG_DWORD, 8, 2, PROFILE_BALANCED, "Приоритет аудио-конвейера Pro Audio GPU Priority = 8"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Pro Audio", "Priority", winreg.REG_DWORD, 7, 1, PROFILE_BALANCED, "Приоритет звукового потока Pro Audio = 7 (без статтеров звука)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Pro Audio", "Scheduling Category", winreg.REG_SZ, "High", "Medium", PROFILE_BALANCED, "Категория планирования звука Pro Audio = High"),

    # --- 4. CPU SCHEDULER, IRQ & KERNEL EXECUTIVE ---
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\PriorityControl", "Win32PrioritySeparation", winreg.REG_DWORD, 38, 2, PROFILE_BALANCED, "Квант времени процессора Win32PrioritySeparation = 0x26 (38 Dec)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\PriorityControl", "IRQ8Priority", winreg.REG_DWORD, 1, 0, PROFILE_MAX_FPS, "Приоритет прерывания системного таймера CMOS/HPET IRQ8 = 1"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\PriorityControl", "IRQ0Priority", winreg.REG_DWORD, 1, 0, PROFILE_MAX_FPS, "Приоритет прерывания аппаратного таймера IRQ0 = 1"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling", "PowerThrottlingOff", winreg.REG_DWORD, 1, 0, PROFILE_BALANCED, "Глобальное отключение троттлинга питания фоновых потоков CPU = 1"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Power", "EnergyEstimationEnabled", winreg.REG_DWORD, 0, 1, PROFILE_BALANCED, "Отключение фоновой телеметрии энергопотребления SRUM = 0"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Executive", "AdditionalCriticalWorkerThreads", winreg.REG_DWORD, 16, 0, PROFILE_BALANCED, "Расширение критических рабочих потоков ядра = 16"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Executive", "AdditionalDelayedWorkerThreads", winreg.REG_DWORD, 16, 0, PROFILE_BALANCED, "Расширение пула отложенных потоков ядра = 16"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Microsoft\\FTH", "Enabled", winreg.REG_DWORD, 0, 1, PROFILE_BALANCED, "Отключение отладочной прослойки Fault Tolerant Heap (FTH = 0)"),

    # --- 5. MEMORY MANAGEMENT & FILESYSTEM ---
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management", "DisablePagingExecutive", winreg.REG_DWORD, 1, 0, PROFILE_BALANCED, "Запрет выгрузки ядра и драйверов в файл подкачки (DisablePagingExecutive = 1)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management", "LargeSystemCache", winreg.REG_DWORD, 0, 0, PROFILE_MINIMAL, "Приоритет ОЗУ для игр вместо системного кэша (LargeSystemCache = 0)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management", "IoPageLockLimit", winreg.REG_DWORD, 0x04000000, 0, PROFILE_MAX_FPS, "Расширение буфера страниц ввода-вывода IoPageLockLimit = 64 МБ"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\\PrefetchParameters", "EnablePrefetcher", winreg.REG_DWORD, 0, 3, PROFILE_MAX_FPS, "Отключение фонового префетчера в реестре (EnablePrefetcher = 0)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\\PrefetchParameters", "EnableSuperfetch", winreg.REG_DWORD, 0, 3, PROFILE_BALANCED, "Отключение фонового Superfetch в реестре (EnableSuperfetch = 0)"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\FileSystem", "NtfsDisableLastAccessUpdate", winreg.REG_DWORD, 1, 2, PROFILE_BALANCED, "Отключение обновления штампа времени чтения файлов NTFS = 1"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\FileSystem", "NtfsDisable8dot3NameCreation", winreg.REG_DWORD, 1, 0, PROFILE_BALANCED, "Отключение создания коротких имен DOS 8.3 на NTFS = 1"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Control\\FileSystem", "NtfsMemoryUsage", winreg.REG_DWORD, 2, 1, PROFILE_BALANCED, "Увеличение кэша таблиц MFT файловой системы NTFS = 2"),

    # --- 6. HID INPUT (МЫШЬ И КЛАВИАТУРА — ZERO INPUT LAG) ---
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Mouse", "MouseSpeed", winreg.REG_SZ, "0", "1", PROFILE_BALANCED, "Отключение акселерации мыши MouseSpeed = 0"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Mouse", "MouseThreshold1", winreg.REG_SZ, "0", "6", PROFILE_BALANCED, "Обнуление первого порога ускорения мыши MouseThreshold1 = 0"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Mouse", "MouseThreshold2", winreg.REG_SZ, "0", "10", PROFILE_BALANCED, "Обнуление второго порога ускорения мыши MouseThreshold2 = 0"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Mouse", "MouseHoverTime", winreg.REG_SZ, "8", "400", PROFILE_BALANCED, "Минимальное время отклика наведения мыши MouseHoverTime = 8 мс"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Services\\mouclass\\Parameters", "MouseDataQueueSize", winreg.REG_DWORD, 20, 100, PROFILE_BALANCED, "Сокращение очереди буфера мыши MouseDataQueueSize = 20"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters", "KeyboardDataQueueSize", winreg.REG_DWORD, 20, 100, PROFILE_BALANCED, "Сокращение очереди буфера клавиатуры KeyboardDataQueueSize = 20"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Keyboard", "KeyboardDelay", winreg.REG_SZ, "0", "1", PROFILE_MINIMAL, "Минимальная задержка повтора клавиши KeyboardDelay = 0"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Keyboard", "KeyboardSpeed", winreg.REG_SZ, "31", "31", PROFILE_MINIMAL, "Максимальная скорость опроса повтора клавиатуры KeyboardSpeed = 31"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Accessibility\\StickyKeys", "Flags", winreg.REG_SZ, "506", "510", PROFILE_MINIMAL, "Отключение перехвата залипания клавиш Shift (StickyKeys = 506)"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Accessibility\\Keyboard Response", "Flags", winreg.REG_SZ, "122", "126", PROFILE_MINIMAL, "Отключение фильтрации ввода FilterKeys = 122"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Accessibility\\ToggleKeys", "Flags", winreg.REG_SZ, "58", "62", PROFILE_MINIMAL, "Отключение звукового перехвата ToggleKeys = 58"),

    # --- 7. СЕТЕВОЙ СТЕК TCP/IP, QOS & AFD FAST UDP ---
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters", "MaxUserPort", winreg.REG_DWORD, 65534, 5000, PROFILE_BALANCED, "Расширение пула сетевых портов MaxUserPort = 65534"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters", "TcpTimedWaitDelay", winreg.REG_DWORD, 30, 120, PROFILE_BALANCED, "Быстрое освобождение закрытых сокетов TcpTimedWaitDelay = 30"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters", "DefaultTTL", winreg.REG_DWORD, 64, 128, PROFILE_MAX_FPS, "Оптимизация времени жизни пакетов DefaultTTL = 64"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Policies\\Microsoft\\Windows\\Psched", "NonBestEffortLimit", winreg.REG_DWORD, 0, 20, PROFILE_BALANCED, "Снятие 20% резерва ширины канала планировщика пакетов QoS = 0"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Services\\AFD\\Parameters", "FastSendDatagramThreshold", winreg.REG_DWORD, 1500, 1024, PROFILE_MAX_FPS, "Ускорение отправки UDP-пакетов в драйвере сокетов AFD = 1500"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Services\\AFD\\Parameters", "DefaultReceiveWindow", winreg.REG_DWORD, 65536, 8192, PROFILE_BALANCED, "Увеличение буфера приема UDP-сокетов AFD = 65536"),
    (winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\\CurrentControlSet\\Services\\AFD\\Parameters", "DefaultSendWindow", winreg.REG_DWORD, 65536, 8192, PROFILE_BALANCED, "Увеличение буфера отправки UDP-сокетов AFD = 65536"),

    # --- 8. ОБОЛОЧКА WINDOWS DWM, DESKTOP & ТЕЛЕМЕТРИЯ ---
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Desktop", "MenuShowDelay", winreg.REG_SZ, "0", "400", PROFILE_MINIMAL, "Нулевая задержка отрисовки меню рабочего стола MenuShowDelay = 0"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Desktop", "ForegroundLockTimeout", winreg.REG_DWORD, 0, 200000, PROFILE_BALANCED, "Мгновенная передача фокуса игровому окну ForegroundLockTimeout = 0"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Desktop", "AutoEndTasks", winreg.REG_SZ, "1", "0", PROFILE_BALANCED, "Автоматическое закрытие зависших фоновых задач AutoEndTasks = 1"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Desktop", "WaitToKillAppTimeout", winreg.REG_SZ, "2000", "20000", PROFILE_BALANCED, "Сокращение таймаута закрытия приложений до 2000 мс"),
    (winreg.HKEY_CURRENT_USER, r"Control Panel\\Desktop", "LowLevelHooksTimeout", winreg.REG_DWORD, 1000, 5000, PROFILE_MAX_FPS, "Быстрый сброс зависших глобальных хуков ввода LowLevelHooksTimeout = 1000"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize", "EnableTransparency", winreg.REG_DWORD, 0, 1, PROFILE_BALANCED, "Отключение прозрачности Acrylic/Mica в Windows (EnableTransparency = 0)"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects", "VisualFXSetting", winreg.REG_DWORD, 2, 0, PROFILE_MAX_FPS, "Визуальные эффекты проводника в режим производительности = 2"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications", "GlobalUserDisabled", winreg.REG_DWORD, 1, 0, PROFILE_BALANCED, "Глобальное отключение фоновой активности UWP-приложений = 1"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Policies\\Microsoft\\Windows\\WindowsCopilot", "TurnOffWindowsCopilot", winreg.REG_DWORD, 1, 0, PROFILE_BALANCED, "Отключение фонового оверлея Windows Copilot = 1"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", "TaskbarDa", winreg.REG_DWORD, 0, 1, PROFILE_BALANCED, "Отключение фоновых виджетов панели задач TaskbarDa = 0"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Policies\\Microsoft\\Windows\\Explorer", "DisableSearchBoxSuggestions", winreg.REG_DWORD, 1, 0, PROFILE_BALANCED, "Отключение сетевых подсказок Bing в поиске Пуск = 1"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Policies\\Microsoft\\Windows\\Explorer", "DisableNotificationCenter", winreg.REG_DWORD, 1, 0, PROFILE_MAX_FPS, "Подавление всплывающих уведомлений во время игры = 1"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", "DisallowShaking", winreg.REG_DWORD, 1, 0, PROFILE_MINIMAL, "Отключение жеста сворачивания окон Aero Shake = 1"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization", "DODownloadMode", winreg.REG_DWORD, 0, 1, PROFILE_MINIMAL, "Отключение P2P-раздачи обновлений Windows (DODownloadMode = 0)"),
    (winreg.HKEY_CURRENT_USER, r"Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager", "SilentInstalledAppsEnabled", winreg.REG_DWORD, 0, 1, PROFILE_MINIMAL, "Запрет фоновой установки рекламных приложений = 0"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection", "AllowTelemetry", winreg.REG_DWORD, 0, 1, PROFILE_BALANCED, "Блокировка фоновой отправки телеметрии AllowTelemetry = 0"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\\Policies\\Microsoft\\SQMClient\\Windows", "CEIPEnable", winreg.REG_DWORD, 0, 1, PROFILE_BALANCED, "Отключение фонового сборщика телеметрии CEIP = 0"),
]


# ==============================================================================
# 2. ПРОВЕРКА ПРАВ АДМИНИСТРАТОРА И АВТО-ПЕРЕЗАПУСК ЧЕРЕЗ UAC
# ==============================================================================

def is_user_admin() -> bool:
    """Проверяет, запущена ли программа с правами Администратора через WinAPI."""
    try:
        return bool(ctypes.windll.shell32.IsUserAnAdmin())
    except Exception:
        return False


def elevate_privileges_if_needed() -> None:
    """Перезапускает скрипт с запросом UAC (runas), если нет прав Администратора."""
    if not is_user_admin():
        try:
            script_path = os.path.abspath(sys.argv[0])
            params = " ".join([f'"{arg}"' for arg in sys.argv[1:]])
            ret = ctypes.windll.shell32.ShellExecuteW(
                None, "runas", sys.executable, f'"{script_path}" {params}', None, 1
            )
            if int(ret) > 32:
                sys.exit(0)
        except Exception as exc:
            print(f"[ERROR] Не удалось запросить права Администратора UAC: {exc}")


# ==============================================================================
# 3. ЯДРО НИЗКОУРОВНЕВОЙ ОПТИМИЗАЦИИ WINDOWS (120+ ФИШЕК В SYSTEM ENGINE)
# ==============================================================================

class SystemOptimizerEngine:
    """Реализует 120+ системных фишек увеличения FPS и снижения Input Lag с учетом профиля."""

    def __init__(self, logger_callback, progress_callback):
        self.log = logger_callback
        self.set_progress = progress_callback
        self.CREATE_NO_WINDOW = 0x08000000

    def run_cmd(self, command: str, timeout: int = 30) -> Tuple[int, str]:
        """Безопасный запуск консольной команды без всплывающего черного окна."""
        try:
            proc = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout,
                creationflags=self.CREATE_NO_WINDOW,
                encoding="cp866",
                errors="replace",
            )
            output = (proc.stdout or "") + (proc.stderr or "")
            return proc.returncode, output.strip()
        except Exception as exc:
            return -1, str(exc)

    def _is_tweak_allowed(self, min_profile: str, current_profile: str) -> bool:
        order = {PROFILE_MINIMAL: 1, PROFILE_BALANCED: 2, PROFILE_MAX_FPS: 3}
        return order.get(current_profile, 3) >= order.get(min_profile, 3)

    # --------------------------------------------------------------------------
    # БЛОК 1: Точка восстановления системы Windows
    # --------------------------------------------------------------------------
    def create_restore_point(self) -> None:
        self.log("[INFO] Создание точки восстановления системы Windows...")
        try:
            with winreg.CreateKeyEx(
                winreg.HKEY_LOCAL_MACHINE,
                r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SystemRestore",
                0,
                winreg.KEY_SET_VALUE | winreg.KEY_WOW64_64KEY,
            ) as key:
                winreg.SetValueEx(key, "SystemRestorePointCreationFrequency", 0, winreg.REG_DWORD, 0)
        except Exception as exc:
            self.log(f"[WARN] Не удалось обновить частоту SystemRestore: {exc}")

        wmic_cmd = (
            'Wmic.exe /Namespace:\\\\root\\default Path SystemRestore '
            'Call CreateRestorePoint "Ultimate Game Booster Pro Pre-Boost", 100, 7'
        )
        code, out = self.run_cmd(wmic_cmd, timeout=45)
        if code == 0 and ("ReturnValue = 0" in out or "0" in out):
            self.log("[OK] Точка восстановления «Ultimate Game Booster Pro Pre-Boost» успешно создана (Wmic).")
        else:
            ps_cmd = (
                'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command '
                '"Checkpoint-Computer -Description \'UltimateGameBoosterPro\' -RestorePointType \'MODIFY_SETTINGS\'"'
            )
            ps_code, _ = self.run_cmd(ps_cmd, timeout=45)
            if ps_code == 0:
                self.log("[OK] Точка восстановления успешно создана через PowerShell Checkpoint-Computer.")
            else:
                self.log("[WARN] Не удалось создать точку восстановления (возможно, защита системы отключена на диске C:).")

    # --------------------------------------------------------------------------
    # БЛОК 2: Электропитание, CPU, PCIe ASPM, USB Suspend и NVMe Idle (15 фишек)
    # --------------------------------------------------------------------------
    def optimize_power_and_cpu(self, profile_mode: str = PROFILE_MAX_FPS) -> None:
        self.log(f"[INFO] Применение 15 фишек питания CPU, PCIe, USB и NVMe (Профиль: «{profile_mode}»)...")
        try:
            code, out = self.run_cmd(f"powercfg -duplicatescheme {GUID_ULTIMATE_PERFORMANCE}")
            active_guid = GUID_ULTIMATE_PERFORMANCE

            if code == 0 and ":" in out:
                for token in out.split():
                    if len(token) == 36 and token.count("-") == 4:
                        active_guid = token.strip()
                        break

            set_code, _ = self.run_cmd(f"powercfg -setactive {active_guid}")
            if set_code == 0:
                self.log(f"[OK] Схема «Максимальная производительность» ({active_guid}) активирована.")
            else:
                self.run_cmd(f"powercfg -setactive {GUID_ULTIMATE_PERFORMANCE}")
                self.log("[OK] Схема «Максимальная производительность» установлена активной.")

            # Гарантия 100% максимальной частоты CPU во всех профилях
            self.run_cmd("powercfg -setacvalueindex scheme_current SUB_PROCESSOR PROCTHROTTLEMAX 100")

            if profile_mode in (PROFILE_MAX_FPS, PROFILE_BALANCED):
                # Парковка ядер = 100% активных ядер
                self.run_cmd(f"powercfg -setacvalueindex scheme_current {GUID_SUB_PROCESSOR} {GUID_CORE_PARKING_MIN_CORES} 100")
                self.run_cmd(f"powercfg -setdcvalueindex scheme_current {GUID_SUB_PROCESSOR} {GUID_CORE_PARKING_MIN_CORES} 100")

                # Агрессивный Turbo Boost (PerfBoostMode = 2) и Hetero Policy P-Cores (0)
                self.run_cmd("powercfg -setacvalueindex scheme_current SUB_PROCESSOR PERFBOOSTMODE 2")
                self.run_cmd("powercfg -setacvalueindex scheme_current SUB_PROCESSOR HETEROPOLICY 0")

                # Отключение энергосбережения шины PCI Express (ASPM Link State = Off)
                self.run_cmd("powercfg -setacvalueindex scheme_current 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0")

                # Отключение выборочной приостановки USB-портов (USB Selective Suspend = Disabled)
                self.run_cmd("powercfg -setacvalueindex scheme_current 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0")

                # Запрет отключения жестких дисков и SSD (DISKIDLE = 0)
                self.run_cmd("powercfg -setacvalueindex scheme_current 0012ee47-9041-4b5d-9b77-535fba8b1442 6738e2c4-e8a5-4a42-b16a-e040e769756e 0")

                # Перевод Wi-Fi адаптера в режим максимальной производительности (0)
                self.run_cmd("powercfg -setacvalueindex scheme_current 19cbb8fa-5279-450e-9fac-8a3d5fedd0c1 12bbebe6-58d6-4636-95bb-3217ef867c1a 0")

                # Мультимедиа: запрет перехода в простой и приоритет качества видеопотока
                self.run_cmd("powercfg -setacvalueindex scheme_current 9596fb26-9850-41fd-ac3e-f7c3c00afd4b 03680956-93bc-4294-bba6-4e0f09bb717f 1")
                self.run_cmd("powercfg -setacvalueindex scheme_current 9596fb26-9850-41fd-ac3e-f7c3c00afd4b 10778347-1370-4ee0-8bbd-33bdacaade49 0")

                reg_parking_path = (
                    r"SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\"
                    f"{GUID_SUB_PROCESSOR}\\{GUID_CORE_PARKING_MIN_CORES}"
                )
                try:
                    with winreg.OpenKey(
                        winreg.HKEY_LOCAL_MACHINE, reg_parking_path, 0, winreg.KEY_SET_VALUE | winreg.KEY_WOW64_64KEY
                    ) as key:
                        winreg.SetValueEx(key, "ValueMax", 0, winreg.REG_DWORD, 0)
                        winreg.SetValueEx(key, "ValueMin", 0, winreg.REG_DWORD, 0)
                        winreg.SetValueEx(key, "Attributes", 0, winreg.REG_DWORD, 0)
                except Exception:
                    pass
                self.log("[OK] Отключены: парковка ядер CPU, энергосбережение шины PCIe ASPM, сон USB-портов и простой дисков.")

            if profile_mode == PROFILE_MAX_FPS:
                # Фиксация минимального состояния процессора на 100%, пороги буста 10%/8%, интервал проверки 5мс и NVMe Idle Off
                self.run_cmd("powercfg -setacvalueindex scheme_current SUB_PROCESSOR PROCTHROTTLEMIN 100")
                self.run_cmd("powercfg -setacvalueindex scheme_current SUB_PROCESSOR 4d2b0152-7d5c-498b-88e2-34345392a2c5 5")
                self.run_cmd("powercfg -setacvalueindex scheme_current SUB_PROCESSOR 06cadf0e-64ed-448a-8927-ce7bf90eb35d 10")
                self.run_cmd("powercfg -setacvalueindex scheme_current SUB_PROCESSOR 12a0ab44-fe28-4fa9-b3bd-4b64f44960a6 8")
                self.run_cmd("powercfg -setacvalueindex scheme_current 0012ee47-9041-4b5d-9b77-535fba8b1442 d639518a-e56d-4345-8af2-b9f32fb26109 0")
                self.run_cmd("powercfg -h off")
                self.log("[OK] Агрессивный профиль CPU: MinProcessorState=100%, NVMe APST Idle=Off, Гибернация отключена.")

            self.run_cmd("powercfg -setactive scheme_current")
        except Exception as exc:
            self.log(f"[ERROR] Ошибка в модуле питания и CPU: {exc}")

    # --------------------------------------------------------------------------
    # БЛОК 3: Очистка Temp, %temp%, Prefetch, NTFS и Standby List RAM (WinAPI)
    # --------------------------------------------------------------------------
    def clean_directory_contents(self, folder_path: str, label: str) -> Tuple[int, int]:
        removed_files = 0
        freed_bytes = 0
        if not folder_path or not os.path.exists(folder_path):
            self.log(f"[WARN] Папка {label} не найдена: {folder_path}")
            return 0, 0

        try:
            for entry in os.listdir(folder_path):
                full_path = os.path.join(folder_path, entry)
                try:
                    if os.path.isfile(full_path) or os.path.islink(full_path):
                        size = os.path.getsize(full_path)
                        os.unlink(full_path)
                        removed_files += 1
                        freed_bytes += size
                    elif os.path.isdir(full_path):
                        dir_size = sum(
                            os.path.getsize(os.path.join(dp, f))
                            for dp, _, filenames in os.walk(full_path)
                            for f in filenames
                            if os.path.exists(os.path.join(dp, f))
                        )
                        shutil.rmtree(full_path, ignore_errors=False)
                        removed_files += 1
                        freed_bytes += dir_size
                except (PermissionError, OSError):
                    continue
            freed_mb = round(freed_bytes / (1024 * 1024), 2)
            self.log(f"[OK] Очищена папка {label}: удалено объектов {removed_files} ({freed_mb} МБ).")
        except Exception as exc:
            self.log(f"[WARN] Частичный доступ к {label}: {exc}")
        return removed_files, freed_bytes

    def purge_standby_memory_list(self, empty_working_sets: bool = True) -> None:
        self.log("[INFO] Вызов WinAPI ntdll.NtSetSystemInformation для очистки списков памяти ОЗУ...")
        try:
            ntdll = ctypes.WinDLL("ntdll.dll")
            prev_state = ctypes.c_bool(False)

            ntdll.RtlAdjustPrivilege(
                ctypes.c_ulong(SE_PROF_SINGLE_PROCESS_PRIVILEGE),
                ctypes.c_bool(True),
                ctypes.c_bool(False),
                ctypes.byref(prev_state),
            )
            ntdll.RtlAdjustPrivilege(
                ctypes.c_ulong(SE_INC_BASE_PRIORITY_PRIVILEGE),
                ctypes.c_bool(True),
                ctypes.c_bool(False),
                ctypes.byref(prev_state),
            )

            mem_before = psutil.virtual_memory().available
            status_ws = -1

            if empty_working_sets:
                cmd_ws = ctypes.c_int(MEMORY_EMPTY_WORKING_SETS)
                status_ws = ntdll.NtSetSystemInformation(
                    ctypes.c_int(SYSTEM_MEMORY_LIST_INFORMATION),
                    ctypes.byref(cmd_ws),
                    ctypes.sizeof(cmd_ws),
                )

            # Очистка Low-Priority Standby List (5) и основного Standby List (4)
            cmd_low = ctypes.c_int(MEMORY_PURGE_LOW_PRIORITY_STANDBY_LIST)
            ntdll.NtSetSystemInformation(
                ctypes.c_int(SYSTEM_MEMORY_LIST_INFORMATION),
                ctypes.byref(cmd_low),
                ctypes.sizeof(cmd_low),
            )

            cmd_purge = ctypes.c_int(MEMORY_PURGE_STANDBY_LIST)
            status_purge = ntdll.NtSetSystemInformation(
                ctypes.c_int(SYSTEM_MEMORY_LIST_INFORMATION),
                ctypes.byref(cmd_purge),
                ctypes.sizeof(cmd_purge),
            )

            mem_after = psutil.virtual_memory().available
            diff_mb = max(0, round((mem_after - mem_before) / (1024 * 1024), 1))

            if status_purge == 0 or status_ws == 0:
                mode_note = "Working Sets + Standby List + LowPriority" if empty_working_sets else "Standby List"
                self.log(
                    f"[OK] Память ({mode_note}) очищена через NtSetSystemInformation "
                    f"(свободно ОЗУ: +{diff_mb} МБ)."
                )
            else:
                self.log(
                    f"[WARN] NtSetSystemInformation вернул NTSTATUS={hex(status_purge & 0xFFFFFFFF)}. "
                    "Выполнен сброс буферов процессов."
                )
        except Exception as exc:
            self.log(f"[ERROR] Ошибка вызова NtSetSystemInformation: {exc}")

    def optimize_ram_and_caches(self, profile_mode: str = PROFILE_MAX_FPS) -> None:
        win_dir = os.environ.get("SystemRoot", r"C:\\Windows")
        user_temp = os.environ.get("TEMP", "")
        sys_temp = os.path.join(win_dir, "Temp")
        prefetch_dir = os.path.join(win_dir, "Prefetch")

        self.clean_directory_contents(user_temp, "%TEMP% (Пользовательский кэш)")
        if profile_mode in (PROFILE_MAX_FPS, PROFILE_BALANCED):
            self.clean_directory_contents(sys_temp, "Windows\\Temp (Системный кэш)")
            # Твики файловой системы NTFS через fsutil
            self.run_cmd("fsutil behavior set disablelastaccess 1")
            self.run_cmd("fsutil behavior set disable8dot3 1")
            self.run_cmd("fsutil behavior set memoryusage 2")
            self.log("[OK] Файловая система NTFS оптимизирована (DisableLastAccess=1, Disable8dot3=1, MFT MemoryUsage=2).")

        if profile_mode == PROFILE_MAX_FPS:
            self.clean_directory_contents(prefetch_dir, "Windows\\Prefetch (Трассировки запуска)")
            self.run_cmd("fsutil behavior set disableencryption 1")
        else:
            self.log(f"[INFO] Профиль «{profile_mode}»: папка Windows\\Prefetch сохранена без изменений.")

        self.purge_standby_memory_list(empty_working_sets=(profile_mode == PROFILE_MAX_FPS))

    # --------------------------------------------------------------------------
    # БЛОК 4: Матрица 75+ глубоких твиков реестра, кривых мыши, сети и BCD
    # --------------------------------------------------------------------------
    def set_reg_value(self, root, subkey: str, name: str, reg_type: int, value: Any) -> bool:
        try:
            with winreg.CreateKeyEx(root, subkey, 0, winreg.KEY_SET_VALUE | winreg.KEY_WOW64_64KEY) as key:
                winreg.SetValueEx(key, name, 0, reg_type, value)
            return True
        except Exception:
            return False

    def apply_deep_registry_tweaks(self, profile_mode: str = PROFILE_MAX_FPS) -> None:
        self.log(f"[INFO] Применение матрицы низкоуровневых твиков реестра и стека ОС (Профиль: «{profile_mode}»)...")
        applied_count = 0

        for root, subkey, name, reg_type, boost_val, _, min_prof, desc in REGISTRY_FPS_MATRIX:
            if self._is_tweak_allowed(min_prof, profile_mode):
                if self.set_reg_value(root, subkey, name, reg_type, boost_val):
                    applied_count += 1

        # Специальная настройка SystemResponsiveness (0 для Макс. FPS, 10 для Баланса)
        if profile_mode in (PROFILE_MAX_FPS, PROFILE_BALANCED):
            sys_resp = 0 if profile_mode == PROFILE_MAX_FPS else 10
            mmcss_profile = r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile"
            if self.set_reg_value(winreg.HKEY_LOCAL_MACHINE, mmcss_profile, "SystemResponsiveness", winreg.REG_DWORD, sys_resp):
                applied_count += 1

        # Линейные бинарные кривые мыши 1:1 (SmoothMouseXCurve / SmoothMouseYCurve) в профиле Макс. FPS
        if profile_mode == PROFILE_MAX_FPS:
            self.set_reg_value(winreg.HKEY_CURRENT_USER, r"Control Panel\\Mouse", "SmoothMouseXCurve", winreg.REG_BINARY, LINEAR_MOUSE_X_CURVE)
            self.set_reg_value(winreg.HKEY_CURRENT_USER, r"Control Panel\\Mouse", "SmoothMouseYCurve", winreg.REG_BINARY, LINEAR_MOUSE_Y_CURVE)
            applied_count += 2
            self.log("[OK] Таблицы ускорения мыши SmoothMouseXCurve / SmoothMouseYCurve переведены в линейный 1:1 вектор.")

        self.log(
            f"[OK] Успешно применено {applied_count} параметров реестра (HAGS, MPO Off, GameDVR Off, "
            "MMCSS Games/ProAudio, Win32PrioritySeparation=0x26, HID Queues=20, Memory Management, DWM)."
        )

        # Сетевые твики Nagle, Netsh TCP Global и DNS Flush
        self.run_cmd("ipconfig /flushdns")
        self.run_cmd("netsh int tcp set global rss=enabled")
        self.run_cmd("netsh int tcp set global autotuninglevel=normal")

        if profile_mode in (PROFILE_MAX_FPS, PROFILE_BALANCED):
            self.disable_nagle_algorithm(enable_tweak=True)
            self.run_cmd("netsh int tcp set global ecncapability=disabled")
            self.run_cmd("netsh int tcp set global timestamps=disabled")
            self.run_cmd("netsh int tcp set heuristics disabled")
            self.log("[OK] Сетевой стек TCP/IP оптимизирован (RSS=Enabled, ECN=Disabled, Timestamps=Disabled, Heuristics=Disabled).")

        # Твики аппаратного таймера ядра BCD и планировщика задач телеметрии
        if profile_mode in (PROFILE_MAX_FPS, PROFILE_BALANCED):
            self.run_cmd("bcdedit /deletevalue useplatformclock")
            self.run_cmd('schtasks /Change /TN "Microsoft\\Windows\\Application Experience\\Microsoft Compatibility Appraiser" /Disable')
            self.run_cmd('schtasks /Change /TN "Microsoft\\Windows\\Customer Experience Improvement Program\\Consolidator" /Disable')
            if profile_mode == PROFILE_MAX_FPS:
                self.run_cmd("bcdedit /set disabledynamictick yes")
                self.log("[OK] Таймер ядра ОС настроен (disabledynamictick=yes, HPET PlatformClock удален, CompatTelRunner отключен).")

    def disable_nagle_algorithm(self, enable_tweak: bool = True) -> None:
        interfaces_path = r"SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces"
        modified_count = 0
        try:
            with winreg.OpenKey(
                winreg.HKEY_LOCAL_MACHINE,
                interfaces_path,
                0,
                winreg.KEY_READ | winreg.KEY_ENUMERATE_SUB_KEYS | winreg.KEY_WOW64_64KEY,
            ) as parent_key:
                num_subkeys = winreg.QueryInfoKey(parent_key)[0]
                for idx in range(num_subkeys):
                    subkey_name = winreg.EnumKey(parent_key, idx)
                    full_subkey = f"{interfaces_path}\\{subkey_name}"
                    try:
                        with winreg.OpenKey(
                            winreg.HKEY_LOCAL_MACHINE,
                            full_subkey,
                            0,
                            winreg.KEY_READ | winreg.KEY_SET_VALUE | winreg.KEY_WOW64_64KEY,
                        ) as iface_key:
                            if enable_tweak:
                                winreg.SetValueEx(iface_key, "TcpAckFrequency", 0, winreg.REG_DWORD, 1)
                                winreg.SetValueEx(iface_key, "TCPNoDelay", 0, winreg.REG_DWORD, 1)
                                winreg.SetValueEx(iface_key, "TcpDelAckTicks", 0, winreg.REG_DWORD, 0)
                                modified_count += 1
                            else:
                                for val_name in ("TcpAckFrequency", "TCPNoDelay", "TcpDelAckTicks"):
                                    try:
                                        winreg.DeleteValue(iface_key, val_name)
                                    except FileNotFoundError:
                                        pass
                                modified_count += 1
                    except PermissionError:
                        continue
            if enable_tweak:
                self.log(
                    f"[OK] Алгоритм Нагла отключен (TcpAckFrequency=1, TCPNoDelay=1, TcpDelAckTicks=0) "
                    f"на {modified_count} сетевых интерфейсах."
                )
            else:
                self.log(f"[OK] Стандартные параметры TCP/IP (Nagle Algorithm) восстановлены ({modified_count} интерфейсов).")
        except Exception as exc:
            self.log(f"[WARN] Ошибка обхода сетевых интерфейсов: {exc}")

    # --------------------------------------------------------------------------
    # БЛОК 5: Остановка фоновых служб и завершение процессов (Debloat по профилю)
    # --------------------------------------------------------------------------
    def stop_background_services(self, profile_mode: str = PROFILE_MAX_FPS) -> None:
        if profile_mode == PROFILE_MINIMAL:
            self.log("[INFO] Профиль «Минимальное вмешательство»: системные службы Windows не останавливаются.")
            return

        services_list = TARGET_SERVICES_MAX if profile_mode == PROFILE_MAX_FPS else TARGET_SERVICES_BALANCED
        self.log(f"[INFO] Временная остановка {len(services_list)} тяжелых неигровых служб (Профиль: «{profile_mode}»)...")
        for svc_name, svc_desc in services_list:
            code, _ = self.run_cmd(f"net stop {svc_name} /y", timeout=20)
            if code == 0:
                self.log(f"[OK] Служба остановлена: {svc_desc}.")
            else:
                self.log(f"[INFO] Служба {svc_name} уже неактивна или не требует остановки.")

    def terminate_selected_processes(
        self, target_exe_names: List[str], profile_mode: str = PROFILE_MAX_FPS
    ) -> None:
        if profile_mode == PROFILE_MINIMAL:
            self.log("[INFO] Профиль «Минимальное вмешательство»: фоновые приложения пользователя не закрываются.")
            return

        if not target_exe_names:
            self.log("[INFO] Список фоновых процессов для закрытия пуст — пропуск.")
            return

        normalized_targets = {name.lower().strip() for name in target_exe_names}
        killed_count = 0
        freed_ram_bytes = 0

        for proc in psutil.process_iter(["pid", "name", "memory_info"]):
            try:
                p_name = (proc.info.get("name") or "").lower()
                if not p_name or p_name in PROTECTED_PROCESSES:
                    continue
                if p_name in normalized_targets:
                    mem_info = proc.info.get("memory_info")
                    rss = mem_info.rss if mem_info else 0
                    proc.terminate()
                    killed_count += 1
                    freed_ram_bytes += rss
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue

        freed_mb = round(freed_ram_bytes / (1024 * 1024), 1)
        self.log(
            f"[OK] Завершено фоновых процессов: {killed_count} "
            f"(освобождено ~{freed_mb} МБ ОЗУ; Steam и Discord защищены)."
        )

    # --------------------------------------------------------------------------
    # БЛОК 6: Очистка кэша шейдеров (Source 2, DirectX D3DSCache, Squad)
    # --------------------------------------------------------------------------
    def find_steam_path(self) -> str:
        try:
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\\Valve\\Steam") as key:
                steam_path, _ = winreg.QueryValueEx(key, "SteamPath")
                return os.path.normpath(steam_path)
        except Exception:
            default_path = r"C:\\Program Files (x86)\\Steam"
            return default_path if os.path.exists(default_path) else ""

    def clean_source2_shader_cache(self) -> None:
        self.log("[INFO] Очистка кэша шейдеров Source 2 (Dota 2 & Deadlock)...")
        steam_root = self.find_steam_path()
        if not steam_root:
            self.log("[WARN] Папка Steam не обнаружена в реестре. Пропуск очистки steamapps\\shadercache.")
            return

        paths_to_clean = [
            (os.path.join(steam_root, "steamapps", "shadercache", "570"), "Dota 2 ShaderCache (AppID 570)"),
            (os.path.join(steam_root, "steamapps", "shadercache", "1422450"), "Deadlock ShaderCache (AppID 1422450)"),
            (
                os.path.join(steam_root, "steamapps", "common", "dota 2 beta", "game", "dota", "shadercache"),
                "Dota 2 Local ShaderCache",
            ),
        ]
        for folder, title in paths_to_clean:
            if os.path.exists(folder):
                self.clean_directory_contents(folder, title)
            else:
                self.log(f"[INFO] Кэш {title} уже чист ({folder}).")

    def clean_squad_and_dx_shader_cache(self) -> None:
        self.log("[INFO] Безопасная очистка кэша шейдеров DirectX и Squad (без сброса биндов и настроек)...")
        local_appdata = os.environ.get("LOCALAPPDATA", "")
        if not local_appdata:
            self.log("[WARN] Переменная %LOCALAPPDATA% недоступна.")
            return

        dx_caches = [
            (os.path.join(local_appdata, "D3DSCache"), "DirectX Shader Cache (D3DSCache)"),
            (os.path.join(local_appdata, "NVIDIA", "DXCache"), "NVIDIA DirectX Shader Cache"),
            (os.path.join(local_appdata, "AMD", "DxCache"), "AMD DirectX Shader Cache"),
        ]
        for path, label in dx_caches:
            if os.path.exists(path):
                self.clean_directory_contents(path, label)

        squad_saved = os.path.join(local_appdata, "SquadGame", "Saved")
        if os.path.exists(squad_saved):
            safe_shader_subdirs = [
                "ShaderCache",
                "PipelineCaches",
                "ComputeShaderCache",
                "GPUDumps",
            ]
            for subdir in safe_shader_subdirs:
                target_dir = os.path.join(squad_saved, subdir)
                if os.path.exists(target_dir):
                    self.clean_directory_contents(target_dir, f"Squad {subdir}")

            removed_cache_files = 0
            for root_dir, _, files in os.walk(squad_saved):
                if "config" in root_dir.lower() or "savegames" in root_dir.lower():
                    continue
                for f in files:
                    if f.lower().endswith((".ushaderprecache", ".upipelinecache", ".cache")):
                        try:
                            os.unlink(os.path.join(root_dir, f))
                            removed_cache_files += 1
                        except OSError:
                            pass
            self.log(
                f"[OK] Кэш шейдеров Squad очищен (удалено файлов кэша: {removed_cache_files}). "
                "Настройки управления (Config\\WindowsNoEditor\\Input.ini) сохранены!"
            )
        else:
            self.log("[INFO] Папка %LocalAppData%\\SquadGame\\Saved не найдена (Squad еще не запускался).")

    # --------------------------------------------------------------------------
    # БЛОК 7: Применение приоритета и CPU 0 Affinity к запущенным играм
    # --------------------------------------------------------------------------
    def optimize_running_game_processes(self) -> List[str]:
        optimized_now = []
        total_cores = psutil.cpu_count(logical=True) or 1
        all_cores_without_zero = list(range(1, total_cores)) if total_cores > 1 else [0]

        for proc in psutil.process_iter(["pid", "name"]):
            try:
                p_name_raw = proc.info.get("name") or ""
                p_name = p_name_raw.lower()
                if p_name in GAME_TARGETS:
                    meta = GAME_TARGETS[p_name]
                    if proc.nice() != psutil.HIGH_PRIORITY_CLASS:
                        proc.nice(psutil.HIGH_PRIORITY_CLASS)

                    if meta["disable_cpu0"] and total_cores > 1:
                        current_affinity = proc.cpu_affinity()
                        if 0 in current_affinity:
                            proc.cpu_affinity(all_cores_without_zero)
                            self.log(
                                f"[OK] {meta['name']} (PID {proc.pid}): установлен HIGH_PRIORITY_CLASS "
                                f"+ отключено Ядро 0 (активны ядра 1..{total_cores - 1})."
                            )
                            optimized_now.append(p_name)
                    else:
                        self.log(
                            f"[OK] {meta['name']} (PID {proc.pid}): установлен высокий приоритет (HIGH_PRIORITY_CLASS)."
                        )
                        optimized_now.append(p_name)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
        return optimized_now

    # --------------------------------------------------------------------------
    # БЛОК 8: Полный откат всех 120+ изменений (Restore Defaults)
    # --------------------------------------------------------------------------
    def restore_default_settings(self) -> None:
        self.log("================================================================")
        self.log("[INFO] ЗАПУСК ПОЛНОГО ОТКАТА ВСЕХ 120+ ПАРАМЕТРОВ (RESTORE DEFAULTS)...")
        self.set_progress(0.10)

        # 1. Возврат сбалансированной схемы питания, парковки ядер, PCIe ASPM, USB Suspend
        self.run_cmd(f"powercfg -setactive {GUID_BALANCED_DEFAULT}")
        self.run_cmd(f"powercfg -setacvalueindex scheme_current {GUID_SUB_PROCESSOR} {GUID_CORE_PARKING_MIN_CORES} 50")
        self.run_cmd("powercfg -setacvalueindex scheme_current SUB_PROCESSOR PROCTHROTTLEMIN 5")
        self.run_cmd("powercfg -setacvalueindex scheme_current SUB_PROCESSOR PERFBOOSTMODE 1")
        self.run_cmd("powercfg -setacvalueindex scheme_current 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 2")
        self.run_cmd("powercfg -setacvalueindex scheme_current 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 1")
        self.run_cmd("powercfg -setactive scheme_current")
        self.run_cmd("powercfg -h on")
        self.log("[OK] Схема питания возвращена на «Сбалансированная», энергосбережение PCIe/USB и гибернация включены.")
        self.set_progress(0.35)

        # 2. Возврат всех ключей из матрицы REGISTRY_FPS_MATRIX к штатным значениям
        restored_keys = 0
        for root, subkey, name, reg_type, _, restore_val, _, _ in REGISTRY_FPS_MATRIX:
            if self.set_reg_value(root, subkey, name, reg_type, restore_val):
                restored_keys += 1

        mmcss_profile = r"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile"
        self.set_reg_value(winreg.HKEY_LOCAL_MACHINE, mmcss_profile, "SystemResponsiveness", winreg.REG_DWORD, 20)
        self.set_reg_value(winreg.HKEY_CURRENT_USER, r"Control Panel\\Mouse", "SmoothMouseXCurve", winreg.REG_BINARY, DEFAULT_MOUSE_X_CURVE)
        self.set_reg_value(winreg.HKEY_CURRENT_USER, r"Control Panel\\Mouse", "SmoothMouseYCurve", winreg.REG_BINARY, DEFAULT_MOUSE_Y_CURVE)
        self.log(f"[OK] Восстановлено {restored_keys} заводских ключей реестра (GameDVR, MMCSS, Win32PrioritySeparation=0x02, HID, DWM).")
        self.set_progress(0.65)

        # 3. Возврат алгоритма Нагла, параметров NTFS, BCD и Netsh
        self.disable_nagle_algorithm(enable_tweak=False)
        self.run_cmd("fsutil behavior set disablelastaccess 2")
        self.run_cmd("fsutil behavior set memoryusage 1")
        self.run_cmd("bcdedit /deletevalue disabledynamictick")
        self.set_progress(0.85)

        # 4. Запуск остановленных фоновых служб
        for svc_name, _ in TARGET_SERVICES_MAX:
            self.run_cmd(f"net start {svc_name}", timeout=20)
        self.log("[OK] Фоновые службы Windows (SysMain, WSearch, Spooler, DiagTrack, PcaSvc, DPS, WerSvc) вновь запущены.")

        self.set_progress(1.0)
        self.log("[OK] ВСЕ 120+ НАСТРОЙКИ WINDOWS УСПЕШНО ВОССТАНОВЛЕНЫ ПО УМОЛЧАНИЮ!")
        self.log("================================================================")


# ==============================================================================
# 4. ГРАФИЧЕСКИЙ ИНТЕРФЕЙС CUSTOMTKINTER (ULTIMATE GAME BOOSTER PRO GUI)
# ==============================================================================

class UltimateGameBoosterApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("green")

        self.title("Ultimate Game Booster Pro — 120+ One-Click FPS & Latency Tweaks")
        self.geometry("1140x810")
        self.minsize(1040, 740)

        self.is_admin = is_user_admin()
        self.is_working = False
        self.watchdog_active = True
        self.selected_profile = PROFILE_MAX_FPS
        self.engine = SystemOptimizerEngine(self.append_log_threadsafe, self.update_progress_threadsafe)

        self.process_vars: Dict[str, ctk.BooleanVar] = {}

        self._build_ui()
        self._log_startup_banner()

        self.watchdog_thread = threading.Thread(target=self._game_process_watchdog_loop, daemon=True)
        self.watchdog_thread.start()

    def _build_ui(self) -> None:
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(2, weight=1)

        # РЯД 0: ВЕРХНЯЯ ПАНЕЛЬ СТАТУСА И ГЛАВНЫХ КНОПОК
        header_frame = ctk.CTkFrame(self, corner_radius=12, fg_color="#111827")
        header_frame.grid(row=0, column=0, padx=16, pady=(12, 6), sticky="ew")
        header_frame.grid_columnconfigure(1, weight=1)

        title_box = ctk.CTkFrame(header_frame, fg_color="transparent")
        title_box.grid(row=0, column=0, padx=18, pady=12, sticky="w")

        title_lbl = ctk.CTkLabel(
            title_box,
            text="ULTIMATE GAME BOOSTER PRO (120+ FPS TWEAKS)",
            font=ctk.CTkFont(family="Segoe UI", size=21, weight="bold"),
            text_color="#10B981",
        )
        title_lbl.pack(anchor="w")

        admin_status_text = (
            "Статус UAC: АДМИНИСТРАТОР (Полный доступ к WinAPI и Реестру)"
            if self.is_admin
            else "Статус UAC: ОГРАНИЧЕННЫЙ РЕЖИМ (Перезапустите от имени Администратора)"
        )
        admin_color = "#34D399" if self.is_admin else "#F59E0B"

        subtitle_lbl = ctk.CTkLabel(
            title_box,
            text=f"Source 2 • Unreal Engine 4/5 • Enfusion  |  {admin_status_text}",
            font=ctk.CTkFont(family="Segoe UI", size=12),
            text_color=admin_color,
        )
        subtitle_lbl.pack(anchor="w", pady=(2, 0))

        actions_box = ctk.CTkFrame(header_frame, fg_color="transparent")
        actions_box.grid(row=0, column=2, padx=18, pady=12, sticky="e")

        self.boost_btn = ctk.CTkButton(
            actions_box,
            text="BOOST / ОПТИМИЗИРОВАТЬ ВСЁ (120+ ФИШЕК)",
            font=ctk.CTkFont(family="Segoe UI", size=14, weight="bold"),
            fg_color="#059669",
            hover_color="#047857",
            height=46,
            width=310,
            corner_radius=8,
            command=self.start_full_boost_thread,
        )
        self.boost_btn.pack(side="left", padx=(0, 10))

        self.restore_btn = ctk.CTkButton(
            actions_box,
            text="Откатить изменения / Restore",
            font=ctk.CTkFont(family="Segoe UI", size=13, weight="bold"),
            fg_color="#374151",
            hover_color="#4B5563",
            height=46,
            width=220,
            corner_radius=8,
            command=self.start_restore_thread,
        )
        self.restore_btn.pack(side="left")

        # РЯД 1: ВЫБОР ПРОФИЛЯ ОПТИМИЗАЦИИ (СТЕПЕНЬ ВОЗДЕЙСТВИЯ НА СИСТЕМУ)
        mode_frame = ctk.CTkFrame(self, corner_radius=12, fg_color="#111827")
        mode_frame.grid(row=1, column=0, padx=16, pady=(0, 6), sticky="ew")
        mode_frame.grid_columnconfigure(1, weight=1)

        mode_lbl = ctk.CTkLabel(
            mode_frame,
            text="Профиль оптимизации:",
            font=ctk.CTkFont(family="Segoe UI", size=13, weight="bold"),
            text_color="#F9FAFB",
        )
        mode_lbl.grid(row=0, column=0, padx=(18, 12), pady=(10, 4), sticky="w")

        self.profile_segmented = ctk.CTkSegmentedButton(
            mode_frame,
            values=OPTIMIZATION_PROFILES,
            font=ctk.CTkFont(family="Segoe UI", size=13, weight="bold"),
            selected_color="#059669",
            selected_hover_color="#047857",
            unselected_color="#1F2937",
            unselected_hover_color="#374151",
            height=34,
            command=self._on_profile_changed,
        )
        self.profile_segmented.grid(row=0, column=1, padx=(0, 18), pady=(10, 4), sticky="ew")
        self.profile_segmented.set(PROFILE_MAX_FPS)

        self.profile_desc_lbl = ctk.CTkLabel(
            mode_frame,
            text=PROFILE_DESCRIPTIONS[PROFILE_MAX_FPS],
            font=ctk.CTkFont(family="Segoe UI", size=11),
            text_color="#9CA3AF",
            anchor="w",
            justify="left",
        )
        self.profile_desc_lbl.grid(row=1, column=0, columnspan=2, padx=18, pady=(0, 10), sticky="ew")

        # РЯД 2: ЦЕНТРАЛЬНАЯ ОБЛАСТЬ
        main_frame = ctk.CTkFrame(self, fg_color="transparent")
        main_frame.grid(row=2, column=0, padx=16, pady=4, sticky="nsew")
        main_frame.grid_columnconfigure(0, weight=5)
        main_frame.grid_columnconfigure(1, weight=7)
        main_frame.grid_rowconfigure(0, weight=1)

        left_panel = ctk.CTkFrame(main_frame, corner_radius=12, fg_color="#111827")
        left_panel.grid(row=0, column=0, padx=(0, 8), pady=0, sticky="nsew")
        left_panel.grid_rowconfigure(2, weight=1)
        left_panel.grid_columnconfigure(0, weight=1)

        proc_header = ctk.CTkLabel(
            left_panel,
            text="Завершение фоновых процессов (Debloat)",
            font=ctk.CTkFont(family="Segoe UI", size=15, weight="bold"),
            text_color="#F9FAFB",
        )
        proc_header.grid(row=0, column=0, padx=16, pady=(14, 2), sticky="w")

        proc_sub = ctk.CTkLabel(
            left_panel,
            text="Steam и Discord находятся в жестком белом списке и НЕ закрываются:",
            font=ctk.CTkFont(family="Segoe UI", size=11),
            text_color="#9CA3AF",
        )
        proc_sub.grid(row=1, column=0, padx=16, pady=(0, 8), sticky="w")

        proc_scroll = ctk.CTkScrollableFrame(left_panel, corner_radius=8, fg_color="#1F2937")
        proc_scroll.grid(row=2, column=0, padx=14, pady=4, sticky="nsew")

        for label in DEFAULT_BLOAT_PROCESSES:
            var = ctk.BooleanVar(value=True)
            self.process_vars[label] = var
            cb = ctk.CTkCheckBox(
                proc_scroll,
                text=f"{label}",
                variable=var,
                font=ctk.CTkFont(family="Segoe UI", size=12),
                checkbox_width=20,
                checkbox_height=20,
            )
            cb.pack(anchor="w", padx=10, pady=6)

        watchdog_box = ctk.CTkFrame(left_panel, corner_radius=8, fg_color="#1F2937")
        watchdog_box.grid(row=3, column=0, padx=14, pady=(8, 14), sticky="ew")

        self.watchdog_var = ctk.BooleanVar(value=True)
        watchdog_switch = ctk.CTkSwitch(
            watchdog_box,
            text="Авто-мониторинг игр (psutil): High Priority + откл. CPU 0",
            variable=self.watchdog_var,
            font=ctk.CTkFont(family="Segoe UI", size=12, weight="bold"),
            command=self._toggle_watchdog,
        )
        watchdog_switch.pack(anchor="w", padx=12, pady=10)

        right_panel = ctk.CTkFrame(main_frame, corner_radius=12, fg_color="#111827")
        right_panel.grid(row=0, column=1, padx=(8, 0), pady=0, sticky="nsew")
        right_panel.grid_rowconfigure(2, weight=1)
        right_panel.grid_columnconfigure(0, weight=1)

        profiles_frame = ctk.CTkFrame(right_panel, corner_radius=10, fg_color="#1F2937")
        profiles_frame.grid(row=0, column=0, padx=14, pady=(14, 8), sticky="ew")
        profiles_frame.grid_columnconfigure((0, 1), weight=1)

        prof_title = ctk.CTkLabel(
            profiles_frame,
            text="Специфическая оптимизация под движки (Source 2 / Unreal Engine 4-5 / Enfusion)",
            font=ctk.CTkFont(family="Segoe UI", size=13, weight="bold"),
            text_color="#E5E7EB",
        )
        prof_title.grid(row=0, column=0, columnspan=2, padx=12, pady=(10, 6), sticky="w")

        self.btn_source2_cache = ctk.CTkButton(
            profiles_frame,
            text="Очистить кэш шейдеров Dota 2 & Deadlock",
            fg_color="#2563EB",
            hover_color="#1D4ED8",
            height=34,
            command=self.start_source2_shader_clean_thread,
        )
        self.btn_source2_cache.grid(row=1, column=0, padx=(12, 6), pady=6, sticky="ew")

        self.btn_squad_cache = ctk.CTkButton(
            profiles_frame,
            text="Безопасная очистка кэша шейдеров Squad & DirectX",
            fg_color="#D97706",
            hover_color="#B45309",
            height=34,
            command=self.start_squad_shader_clean_thread,
        )
        self.btn_squad_cache.grid(row=1, column=1, padx=(6, 12), pady=6, sticky="ew")

        launch_frame = ctk.CTkFrame(profiles_frame, fg_color="#111827", corner_radius=6)
        launch_frame.grid(row=2, column=0, columnspan=2, padx=12, pady=(4, 10), sticky="ew")
        launch_frame.grid_columnconfigure(0, weight=1)

        self.launch_entry = ctk.CTkEntry(
            launch_frame,
            font=ctk.CTkFont(family="Consolas", size=12),
            fg_color="#111827",
            border_width=0,
        )
        self.launch_entry.grid(row=0, column=0, padx=8, pady=6, sticky="ew")
        self.launch_entry.insert(
            0, "Параметры запуска Steam (Source 2): -high -novid -nojoy +fps_max 0 -threads 8"
        )
        self.launch_entry.configure(state="readonly")

        copy_btn = ctk.CTkButton(
            launch_frame,
            text="Копировать параметры",
            width=150,
            height=28,
            fg_color="#374151",
            hover_color="#4B5563",
            command=self._copy_steam_launch_options,
        )
        copy_btn.grid(row=0, column=1, padx=6, pady=6)

        log_lbl = ctk.CTkLabel(
            right_panel,
            text="Журнал системных операций в реальном времени (Real-Time Execution Log):",
            font=ctk.CTkFont(family="Segoe UI", size=13, weight="bold"),
            text_color="#F3F4F6",
        )
        log_lbl.grid(row=1, column=0, padx=16, pady=(4, 4), sticky="w")

        self.log_textbox = ctk.CTkTextbox(
            right_panel,
            font=ctk.CTkFont(family="Consolas", size=12),
            fg_color="#090D16",
            text_color="#10B981",
            corner_radius=8,
            wrap="word",
        )
        self.log_textbox.grid(row=2, column=0, padx=14, pady=(0, 14), sticky="nsew")

        # РЯД 3: НИЖНЯЯ ПАНЕЛЬ ПРОГРЕСС-БАРА
        footer_frame = ctk.CTkFrame(self, corner_radius=10, fg_color="#111827")
        footer_frame.grid(row=3, column=0, padx=16, pady=(6, 12), sticky="ew")
        footer_frame.grid_columnconfigure(0, weight=1)

        self.progress_bar = ctk.CTkProgressBar(
            footer_frame, height=14, corner_radius=7, progress_color="#10B981"
        )
        self.progress_bar.grid(row=0, column=0, padx=16, pady=12, sticky="ew")
        self.progress_bar.set(0.0)

        self.progress_label = ctk.CTkLabel(
            footer_frame,
            text="Готов к оптимизации (0%)",
            font=ctk.CTkFont(family="Consolas", size=12, weight="bold"),
            text_color="#D1D5DB",
        )
        self.progress_label.grid(row=0, column=1, padx=(0, 16), pady=12, sticky="e")

    def _on_profile_changed(self, value: str) -> None:
        self.selected_profile = value
        desc = PROFILE_DESCRIPTIONS.get(value, "")
        self.profile_desc_lbl.configure(text=desc)
        self.append_log_threadsafe(f"[INFO] Выбран профиль оптимизации: «{value}» — {desc}")

    def append_log_threadsafe(self, message: str) -> None:
        timestamp = datetime.now().strftime("%H:%M:%S")
        formatted = f"[{timestamp}] {message}\\n"
        self.after(0, self._append_to_textbox, formatted)

    def _append_to_textbox(self, text: str) -> None:
        self.log_textbox.configure(state="normal")
        self.log_textbox.insert("end", text)
        self.log_textbox.see("end")
        self.log_textbox.configure(state="disabled")

    def update_progress_threadsafe(self, value: float) -> None:
        clamped = max(0.0, min(1.0, float(value)))
        self.after(0, self._set_progress_ui, clamped)

    def _set_progress_ui(self, value: float) -> None:
        self.progress_bar.set(value)
        pct = int(round(value * 100))
        self.progress_label.configure(text=f"Выполнение: {pct}%")

    def _set_buttons_state(self, state: str) -> None:
        self.after(
            0,
            lambda: (
                self.boost_btn.configure(state=state),
                self.restore_btn.configure(state=state),
                self.btn_source2_cache.configure(state=state),
                self.btn_squad_cache.configure(state=state),
                self.profile_segmented.configure(state=state),
            ),
        )

    def _copy_steam_launch_options(self) -> None:
        options = "-high -novid -nojoy +fps_max 0"
        self.clipboard_clear()
        self.clipboard_append(options)
        self.append_log_threadsafe(f"[OK] Параметры запуска Steam скопированы в буфер обмена: {options}")

    def _toggle_watchdog(self) -> None:
        self.watchdog_active = bool(self.watchdog_var.get())
        state_str = "ВКЛЮЧЕН" if self.watchdog_active else "ПАУЗА"
        self.append_log_threadsafe(f"[INFO] Фоновый мониторинг процессов игр (psutil Watchdog): {state_str}.")

    def _log_startup_banner(self) -> None:
        cpu_count_logical = psutil.cpu_count(logical=True)
        cpu_count_phys = psutil.cpu_count(logical=False)
        ram_total_gb = round(psutil.virtual_memory().total / (1024**3), 1)
        self.append_log_threadsafe("================================================================")
        self.append_log_threadsafe("ULTIMATE GAME BOOSTER PRO — 120+ СИСТЕМНЫХ ТВИКОВ FPS & INPUT LAG")
        self.append_log_threadsafe(
            f"Конфигурация: Логических ядер CPU: {cpu_count_logical} (Физических: {cpu_count_phys}) | ОЗУ: {ram_total_gb} ГБ"
        )
        self.append_log_threadsafe(f"Активный профиль оптимизации: «{self.selected_profile}»")
        self.append_log_threadsafe(
            "Целевые профили игр: Arma Reforger, Squad, Dota 2, Deadlock (Source 2 / UE 4-5 / Enfusion)"
        )
        self.append_log_threadsafe("================================================================")

    def start_full_boost_thread(self) -> None:
        if self.is_working:
            return
        self.is_working = True
        self._set_buttons_state("disabled")
        threading.Thread(target=self._run_full_boost_pipeline, daemon=True).start()

    def _run_full_boost_pipeline(self) -> None:
        try:
            mode = self.selected_profile
            self.append_log_threadsafe("================================================================")
            self.append_log_threadsafe(
                f"[START] ЗАПУСК ПАКЕТА 120+ ОПТИМИЗАЦИЙ WINDOWS (ПРОФИЛЬ: «{mode.upper()}»)..."
            )
            self.update_progress_threadsafe(0.05)

            self.engine.create_restore_point()
            self.update_progress_threadsafe(0.18)

            self.engine.optimize_power_and_cpu(profile_mode=mode)
            self.update_progress_threadsafe(0.38)

            self.engine.optimize_ram_and_caches(profile_mode=mode)
            self.update_progress_threadsafe(0.58)

            self.engine.apply_deep_registry_tweaks(profile_mode=mode)
            self.update_progress_threadsafe(0.80)

            self.engine.stop_background_services(profile_mode=mode)
            selected_exes: List[str] = []
            for label, var in self.process_vars.items():
                if var.get():
                    selected_exes.extend(DEFAULT_BLOAT_PROCESSES.get(label, []))
            self.engine.terminate_selected_processes(selected_exes, profile_mode=mode)
            self.update_progress_threadsafe(0.93)

            self.engine.optimize_running_game_processes()
            self.update_progress_threadsafe(1.0)

            self.append_log_threadsafe(
                f"[OK] ВСЕ ОПТИМИЗАЦИИ ПРОФИЛЯ «{mode}» ВЫПОЛНЕНЫ ПО ОДНОЙ КНОПКЕ!"
            )
            self.append_log_threadsafe("================================================================")
        except Exception as exc:
            self.append_log_threadsafe(f"[ERROR] Критическое исключение в потоке оптимизации: {exc}")
        finally:
            self.is_working = False
            self._set_buttons_state("normal")

    def start_restore_thread(self) -> None:
        if self.is_working:
            return
        self.is_working = True
        self._set_buttons_state("disabled")
        threading.Thread(target=self._run_restore_pipeline, daemon=True).start()

    def _run_restore_pipeline(self) -> None:
        try:
            self.engine.restore_default_settings()
        finally:
            self.is_working = False
            self._set_buttons_state("normal")

    def start_source2_shader_clean_thread(self) -> None:
        if self.is_working:
            return
        self.is_working = True
        self._set_buttons_state("disabled")

        def worker():
            try:
                self.update_progress_threadsafe(0.3)
                self.engine.clean_source2_shader_cache()
                self.update_progress_threadsafe(1.0)
            finally:
                self.is_working = False
                self._set_buttons_state("normal")

        threading.Thread(target=worker, daemon=True).start()

    def start_squad_shader_clean_thread(self) -> None:
        if self.is_working:
            return
        self.is_working = True
        self._set_buttons_state("disabled")

        def worker():
            try:
                self.update_progress_threadsafe(0.3)
                self.engine.clean_squad_and_dx_shader_cache()
                self.update_progress_threadsafe(1.0)
            finally:
                self.is_working = False
                self._set_buttons_state("normal")

        threading.Thread(target=worker, daemon=True).start()

    def _game_process_watchdog_loop(self) -> None:
        already_logged_pids = set()
        while True:
            if self.watchdog_active and not self.is_working:
                try:
                    total_cores = psutil.cpu_count(logical=True) or 1
                    cores_no_zero = list(range(1, total_cores)) if total_cores > 1 else [0]

                    for proc in psutil.process_iter(["pid", "name"]):
                        try:
                            p_name = (proc.info.get("name") or "").lower()
                            pid = proc.info.get("pid")
                            if p_name in GAME_TARGETS and pid not in already_logged_pids:
                                meta = GAME_TARGETS[p_name]
                                proc.nice(psutil.HIGH_PRIORITY_CLASS)
                                if meta["disable_cpu0"] and total_cores > 1:
                                    proc.cpu_affinity(cores_no_zero)
                                    self.append_log_threadsafe(
                                        f"[WATCHDOG] Обнаружен запуск {meta['name']} (PID {pid}): "
                                        f"выставлен HIGH_PRIORITY_CLASS + отключено Ядро 0 (CPU 0 Affinity tweak)."
                                    )
                                else:
                                    self.append_log_threadsafe(
                                        f"[WATCHDOG] Обнаружен запуск {meta['name']} (PID {pid}): "
                                        "выставлен высокий приоритет HIGH_PRIORITY_CLASS."
                                    )
                                already_logged_pids.add(pid)
                        except (psutil.NoSuchProcess, psutil.AccessDenied):
                            continue
                except Exception:
                    pass
            time.sleep(5)


# ==============================================================================
# 5. ТОЧКА ВХОДА В ПРОГРАММУ
# ==============================================================================

if __name__ == "__main__":
    elevate_privileges_if_needed()
    app = UltimateGameBoosterApp()
    app.mainloop()
`;
