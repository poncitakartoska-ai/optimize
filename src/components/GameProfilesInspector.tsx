import React, { useState } from 'react';
import { Cpu, Copy, Check, FolderOpen, Zap, Shield } from 'lucide-react';
import { GAME_PROFILES, GameProfile } from '../utils/boosterCodeData';

export const GameProfilesInspector: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLaunch = (profile: GameProfile) => {
    navigator.clipboard.writeText(profile.launchOptions);
    setCopiedId(profile.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-[#111827] border border-slate-800 space-y-2">
        <h2 className="text-lg font-bold text-slate-100 font-display">
          Инженерные профили оптимизации под целевые игровые движки
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
          Детальная спецификация низкоуровневых настроек, применяемых <code className="text-slate-200">main.py</code> для{' '}
          <strong className="text-slate-200">Source 2</strong> (Dota 2, Deadlock),{' '}
          <strong className="text-slate-200">Unreal Engine 4/5</strong> (Squad) и{' '}
          <strong className="text-slate-200">Enfusion Engine</strong> (Arma Reforger).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {GAME_PROFILES.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col justify-between p-5 rounded-xl bg-[#111827] border border-slate-800 space-y-4"
          >
            <div className="space-y-3">
              {/* Заголовок карточки без пилюль — строгая типографика */}
              <div className="flex items-baseline justify-between gap-4 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-display">
                    {profile.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    <span>{profile.engine}</span>
                    <span className="mx-1.5">·</span>
                    <span className="font-mono text-emerald-400">{profile.exeName}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 shrink-0">
                  HIGH_PRIORITY_CLASS
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{profile.description}</p>

              {/* Твик ядер и приоритета */}
              <div className="p-3 rounded-lg bg-[#192234] border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  <span>Политика планировщика ядер и psutil:</span>
                </div>
                <div className="text-xs text-slate-200 font-mono">{profile.affinityTweak}</div>
              </div>

              {/* Пути очистки кэша шейдеров */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Директории безопасной очистки кэша шейдеров:</span>
                </div>
                <div className="space-y-1">
                  {profile.shaderCachePaths.map((p, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-800 font-mono text-[11px] text-slate-300 break-all"
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Таблица параметров */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Ключевые системные параметры профиля:</span>
                </div>
                <div className="rounded-lg border border-slate-800 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#090D16] text-slate-400 border-b border-slate-800">
                        <th className="py-2 px-3 font-medium">Параметр</th>
                        <th className="py-2 px-3 font-medium">Значение</th>
                        <th className="py-2 px-3 font-medium text-right">Эффект</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {profile.recommendedSettings.map((s, idx) => (
                        <tr key={idx} className="bg-[#131B2E]/50">
                          <td className="py-2 px-3 text-slate-300">{s.param}</td>
                          <td className="py-2 px-3 font-mono text-slate-100">{s.value}</td>
                          <td className="py-2 px-3 text-right font-mono text-emerald-400 tabular-nums">
                            {s.impact}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Параметры запуска Steam */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  Рекомендуемые параметры запуска Steam:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyLaunch(profile)}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  {copiedId === profile.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать строку</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080B12] border border-slate-800 font-mono text-xs text-emerald-300 break-all">
                {profile.launchOptions}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Памятка по безопасности биндов Squad */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#111827] border border-slate-800 text-xs text-slate-300">
        <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <div className="font-semibold text-slate-100">
            Гарантия сохранности настроек управления в Squad (%LocalAppData%\SquadGame):
          </div>
          <p className="text-slate-400">
            В отличие от обычных батников, которые целиком удаляют папку <code className="text-slate-200">%LocalAppData%\SquadGame\Saved</code> и сбрасывают все бинды клавиш и чувствительность мыши, функция{' '}
            <code className="text-emerald-400">clean_squad_and_dx_shader_cache()</code> в нашем <code className="text-slate-200">main.py</code> обходит стороной директорию{' '}
            <code className="text-slate-200">Saved\Config\WindowsNoEditor</code> (<code className="text-slate-200">Input.ini</code>,{' '}
            <code className="text-slate-200">GameUserSettings.ini</code>) и удаляет исключительно скомпилированные кэши шейдеров (<code className="text-slate-200">D3DSCache</code>,{' '}
            <code className="text-slate-200">ShaderCache</code>, <code className="text-slate-200">PipelineCaches</code> и файлы <code className="text-slate-200">.ushaderprecache</code>).
          </p>
        </div>
      </div>
    </div>
  );
};
