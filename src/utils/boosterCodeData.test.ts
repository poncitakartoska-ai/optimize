import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAIN_PY_SOURCE_CODE,
  KILLABLE_PROCESSES,
  PROTECTED_WHITELIST,
  GAME_PROFILES,
  OPTIMIZATION_MODES,
  buildPyInstallerCommand,
  calculateEstimatedRamSaved,
  getOptimizationModeById,
} from './boosterCodeData';
import {
  HUNDRED_TWENTY_FPS_TWEAKS,
  TWEAK_CATEGORIES,
  getTweaksForProfile,
} from './hundredTweaksData';

test('MAIN_PY_SOURCE_CODE contains all mandatory low-level Windows optimization functions and 120+ tweaks matrix', () => {
  // Check imports
  assert.ok(MAIN_PY_SOURCE_CODE.includes('import os'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('import subprocess'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('import winreg'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('import ctypes'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('import psutil'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('import shutil'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('import threading'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('import customtkinter as ctk'));

  // Check 3 optimization profiles in GUI and engine
  assert.ok(MAIN_PY_SOURCE_CODE.includes('PROFILE_MAX_FPS = "Максимальный FPS"'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('PROFILE_BALANCED = "Баланс"'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('PROFILE_MINIMAL = "Минимальное вмешательство"'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('CTkSegmentedButton'));

  // Check 120+ tweaks matrix and key hardware/kernel entries
  assert.ok(MAIN_PY_SOURCE_CODE.includes('REGISTRY_FPS_MATRIX'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('HwSchMode'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('OverlayTestMode'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('MouseDataQueueSize'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('KeyboardDataQueueSize'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('DisablePagingExecutive'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('FastSendDatagramThreshold'));

  // 1. Admin check and System Restore point
  assert.ok(MAIN_PY_SOURCE_CODE.includes('ctypes.windll.shell32.IsUserAnAdmin()'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('Wmic.exe /Namespace:\\\\root\\default Path SystemRestore'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('CreateRestorePoint'));

  // 2. Power scheme, Core Parking, Hibernation
  assert.ok(MAIN_PY_SOURCE_CODE.includes('e9a42b02-d5df-448d-aa00-03f14749eb61'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('powercfg -duplicatescheme'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('powercfg -h off'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('0cc5b647-c1df-4637-891a-dec35c318583'));

  // 3. RAM & Cache (NtSetSystemInformation)
  assert.ok(MAIN_PY_SOURCE_CODE.includes('NtSetSystemInformation'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('Prefetch'));

  // 4. Deep registry tweaks (GameDVR, MMCSS, Win32PrioritySeparation=38/0x26, Nagle, NetworkThrottlingIndex)
  assert.ok(MAIN_PY_SOURCE_CODE.includes('AppCaptureEnabled'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('GameDVR_Enabled'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('SystemResponsiveness'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('GPU Priority'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('Win32PrioritySeparation'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('TcpAckFrequency'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('TCPNoDelay'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('NetworkThrottlingIndex'));

  // 5. Background services & processes
  for (const svc of ['SysMain', 'DiagTrack', 'WSearch', 'Spooler', 'MapsBroker']) {
    assert.ok(MAIN_PY_SOURCE_CODE.includes(svc), `Missing service ${svc}`);
  }

  // 6. Specific game profiles (dota2.exe, project8.exe, SquadGame.exe, ArmaReforgerSteam.exe)
  assert.ok(MAIN_PY_SOURCE_CODE.includes('dota2.exe'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('project8.exe'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('squadgame.exe'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('armareforgersteam.exe'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('HIGH_PRIORITY_CLASS'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('cpu_affinity'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('-high -novid -nojoy +fps_max 0'));
  assert.ok(MAIN_PY_SOURCE_CODE.includes('D3DSCache'));
});

test('HUNDRED_TWENTY_FPS_TWEAKS contains at least 100 (specifically 120) unique low-level tweaks and filters by profile', () => {
  assert.equal(HUNDRED_TWENTY_FPS_TWEAKS.length, 120);
  assert.ok(HUNDRED_TWENTY_FPS_TWEAKS.length >= 100);
  assert.equal(TWEAK_CATEGORIES.length, 8);

  const uniqueIds = new Set(HUNDRED_TWENTY_FPS_TWEAKS.map((t) => t.id));
  assert.equal(uniqueIds.size, 120);

  const maxTweaks = getTweaksForProfile('max_fps');
  const balancedTweaks = getTweaksForProfile('balanced');
  const minimalTweaks = getTweaksForProfile('minimal');

  assert.equal(maxTweaks.length, 120);
  assert.equal(balancedTweaks.length, 92);
  assert.equal(minimalTweaks.length, 25);
});

test('OPTIMIZATION_MODES defines all 3 impact levels and RAM calculation respects minimal mode', () => {
  assert.equal(OPTIMIZATION_MODES.length, 3);
  assert.equal(getOptimizationModeById('max_fps').label, 'Максимальный FPS');
  assert.equal(getOptimizationModeById('max_fps').tweaksCount, 120);
  assert.equal(getOptimizationModeById('balanced').label, 'Баланс');
  assert.equal(getOptimizationModeById('balanced').tweaksCount, 92);
  assert.equal(getOptimizationModeById('minimal').label, 'Минимальное вмешательство');
  assert.equal(getOptimizationModeById('minimal').tweaksCount, 25);

  assert.equal(calculateEstimatedRamSaved(['chrome', 'msedge'], 'max_fps'), 1420 + 680);
  assert.equal(calculateEstimatedRamSaved(['chrome', 'msedge'], 'balanced'), 1420 + 680);
  assert.equal(calculateEstimatedRamSaved(['chrome', 'msedge'], 'minimal'), 0);
});

test('buildPyInstallerCommand generates valid PyInstaller CLI strings with required flags', () => {
  const cmd = buildPyInstallerCommand(['--noconfirm', '--onefile', '--noconsole', '--uac-admin'], 'UltimateGameBoosterPro', true);
  assert.ok(cmd.includes('pyinstaller'));
  assert.ok(cmd.includes('--onefile'));
  assert.ok(cmd.includes('--noconsole'));
  assert.ok(cmd.includes('--uac-admin'));
  assert.ok(cmd.includes('--collect-all customtkinter'));
  assert.ok(cmd.endsWith('main.py'));
});

test('calculateEstimatedRamSaved sums selected process memory accurately and respects whitelist', () => {
  const ram = calculateEstimatedRamSaved(['chrome', 'msedge']);
  assert.equal(ram, 1420 + 680);
  assert.ok(PROTECTED_WHITELIST.includes('steam.exe'));
  assert.ok(PROTECTED_WHITELIST.includes('Discord.exe'));
  assert.equal(GAME_PROFILES.length, 4);
  assert.ok(KILLABLE_PROCESSES.length >= 10);
});
