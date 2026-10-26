import React, { useState } from 'react';
import { Package, Copy, Check, Download, Terminal, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PYINSTALLER_FLAGS, buildPyInstallerCommand } from '../utils/boosterCodeData';

export const PyInstallerBuilder: React.FC = () => {
  const [selectedFlags, setSelectedFlags] = useState<string[]>(
    PYINSTALLER_FLAGS.filter((f) => f.enabledByDefault).map((f) => f.flag)
  );
  const [exeName, setExeName] = useState<string>('UltimateGameBoosterPro');
  const [collectCustomTkinter, setCollectCustomTkinter] = useState<boolean>(true);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [copiedPip, setCopiedPip] = useState<boolean>(false);

  const pipInstallCommand = 'pip install --upgrade pip customtkinter psutil pyinstaller';
  const pyinstallerCommand = buildPyInstallerCommand(
    selectedFlags,
    exeName,
    collectCustomTkinter
  );

  const toggleFlag = (flag: string) => {
    setSelectedFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(pyinstallerCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyPip = () => {
    navigator.clipboard.writeText(pipInstallCommand);
    setCopiedPip(true);
    setTimeout(() => setCopiedPip(false), 2000);
  };

  const handleDownloadBuildBat = () => {
    const batContent = `@echo off
chcp 65001 >nul
echo ============================================================================
echo СБОРКА ULTIMATE GAME BOOSTER PRO В АВТОНОМНЫЙ .EXE (С ПРАВАМИ АДМИНИСТРАТОРА)
echo ============================================================================
echo [1/3] Установка и проверка зависимостей (customtkinter, psutil, pyinstaller)...
python -m pip install --upgrade pip customtkinter psutil pyinstaller
if %errorlevel% neq 0 (
    echo [ERROR] Ошибка установки пакетов Python. Убедитесь, что Python 3.11+ добавлен в PATH.
    pause
    exit /b 1
)

echo.
echo [2/3] Запуск компиляции через PyInstaller...
${pyinstallerCommand}

echo.
echo [3/3] Готово! Скомпилированный файл находится в папке: dist\\${exeName || 'UltimateGameBoosterPro'}.exe
pause
`;
    const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build_exe.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Интерактивный конфигуратор флагов PyInstaller */}
      <div className="p-5 rounded-xl bg-[#111827] border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Package className="w-5 h-5 text-emerald-400 shrink-0" />
              <h2 className="text-lg font-bold text-slate-100 font-display">
                Конструктор сборки автономного <code className="text-emerald-400 font-mono">.exe</code> через PyInstaller
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Настройте параметры компиляции с вшитым UAC-манифестом Администратора (<code className="text-slate-300">--uac-admin</code>) и упаковкой темы <code className="text-slate-300">customtkinter</code>.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadBuildBat}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Скачать авто-скрипт build_exe.bat</span>
          </button>
        </div>

        {/* Поле имени выходного .exe и флагов */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label
                htmlFor="exe-name-input"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Имя выходного исполняемого файла (.exe):
              </label>
              <input
                id="exe-name-input"
                type="text"
                value={exeName}
                onChange={(e) => setExeName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#090D16] border border-slate-700 text-sm font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-[#192234] border border-slate-800 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collectCustomTkinter}
                  onChange={() => setCollectCustomTkinter(!collectCustomTkinter)}
                  className="w-4 h-4 mt-0.5 rounded accent-emerald-500 cursor-pointer shrink-0"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-200">
                    Включить ресурсы темы customtkinter (--collect-all customtkinter)
                  </div>
                  <div className="text-slate-400 mt-0.5 leading-relaxed">
                    Обязательно для корректной упаковки JSON-тем и шрифтов <code className="text-slate-300">customtkinter</code> внутри единого <code className="text-slate-300">--onefile</code> архива.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-2">
            <div className="text-xs font-semibold text-slate-300 mb-1.5">
              Флаги компиляции PyInstaller:
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PYINSTALLER_FLAGS.map((item) => {
                const checked = selectedFlags.includes(item.flag);
                return (
                  <label
                    key={item.flag}
                    className="flex items-start gap-3 p-3 rounded-lg bg-[#192234] border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFlag(item.flag)}
                      className="w-4 h-4 mt-0.5 rounded accent-emerald-500 cursor-pointer shrink-0"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-100 font-mono">{item.label}</div>
                      <div className="text-slate-400 mt-0.5">{item.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Итоговая сгенерированная команда PyInstaller */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-300">
            Итоговая команда сборки для терминала (CMD / PowerShell):
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#080B12] border border-slate-800">
            <code
              data-testid="pyinstaller-command-output"
              className="font-mono text-xs text-emerald-400 break-all"
            >
              {pyinstallerCommand}
            </code>
            <button
              type="button"
              onClick={handleCopyCommand}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {copiedCmd ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Скопировано</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Копировать команду</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Пошаговая инструкция по компиляции в .exe */}
      <div className="p-5 rounded-xl bg-[#111827] border border-slate-800 space-y-5">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-emerald-400 shrink-0" />
          <h3 className="text-base font-bold text-slate-100 font-display">
            Пошаговая инструкция: как скомпилировать <code className="text-emerald-400 font-mono">main.py</code> в один автономный <code className="text-emerald-400 font-mono">.exe</code> файл
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#192234] border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400">
              01. Установка Python 3.11+ и создание рабочей папки
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Убедитесь, что у вас установлен <strong>Python 3.11 или 3.12</strong> с отмеченной галочкой{' '}
              <code className="text-slate-100">Add python.exe to PATH</code>. Создайте отдельную папку, например{' '}
              <code className="text-slate-100">C:\GameBooster</code>, и сохраните туда файл{' '}
              <code className="text-emerald-300">main.py</code>.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#192234] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                02. Установка зависимостей через pip
              </span>
              <button
                type="button"
                onClick={handleCopyPip}
                className="text-[11px] text-slate-300 hover:text-white underline cursor-pointer"
              >
                {copiedPip ? 'Скопировано!' : 'Копировать pip'}
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Откройте командную строку (<code className="text-slate-100">cmd.exe</code>) или PowerShell в папке с проектом и установите необходимые пакеты:
            </p>
            <pre className="p-2 rounded bg-[#080B12] text-emerald-300 font-mono text-[11px] overflow-x-auto">
              {pipInstallCommand}
            </pre>
          </div>

          <div className="p-4 rounded-lg bg-[#192234] border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400">
              03. Компиляция в единый .exe с правами Администратора UAC
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Выполните команду упаковки PyInstaller с флагами <code className="text-slate-100">--onefile</code>,{' '}
              <code className="text-slate-100">--noconsole</code>, <code className="text-slate-100">--uac-admin</code> и{' '}
              <code className="text-slate-100">--collect-all customtkinter</code>:
            </p>
            <pre className="p-2 rounded bg-[#080B12] text-emerald-300 font-mono text-[11px] overflow-x-auto">
              pyinstaller --noconfirm --onefile --noconsole --uac-admin --clean --collect-all customtkinter --name &quot;UltimateGameBoosterPro&quot; main.py
            </pre>
          </div>

          <div className="p-4 rounded-lg bg-[#192234] border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400">
              04. Проверка готового исполняемого файла
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              После завершения сборки (обычно 25–40 секунд) откройте папку <code className="text-slate-100">dist\</code>. Внутри будет лежать автономный файл{' '}
              <code className="text-emerald-300">UltimateGameBoosterPro.exe</code> со щитом UAC на иконке, не требующий установленного Python на целевом ПК.
            </p>
          </div>
        </div>

        {/* Технические примечания */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100">Почему важен --collect-all customtkinter:</strong> библиотека{' '}
              <code className="text-slate-200">customtkinter</code> хранит темы оформления (<code className="text-slate-200">green.json</code>,{' '}
              <code className="text-slate-200">dark-blue.json</code>) как не-кодовые файлы. Флаг{' '}
              <code className="text-slate-200">--collect-all customtkinter</code> гарантирует их включение внутрь однофайлового <code className="text-slate-200">.exe</code>.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-slate-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100">Двойная защита прав Администратора:</strong> флаг{' '}
              <code className="text-slate-200">--uac-admin</code> запрашивает повышение прав на уровне загрузчика Windows PE, а функция{' '}
              <code className="text-slate-200">elevate_privileges_if_needed()</code> в самом коде страхует при прямом запуске{' '}
              <code className="text-slate-200">python main.py</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
