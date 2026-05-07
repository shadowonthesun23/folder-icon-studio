import { Bookmark, BookmarkPlus, ChevronDown, Info, Trash2 } from 'lucide-react';

export default function SectionPresets({
  t,
  presets, presetName, setPresetName,
  presetsOpen, setPresetsOpen,
  section3HintVisible, setSection3HintVisible,
  onSave, onApply, onDelete,
}) {
  return (
    <section className="space-y-4 pb-2">
      <div className="flex items-center gap-2">
        <button onClick={() => setPresetsOpen(o => !o)}
          className="flex-1 flex items-center justify-between text-sm font-semibold tracking-wide text-neutral-300 uppercase">
          <span className="flex items-center gap-2"><Bookmark size={16} /> {t.section3}</span>
          <ChevronDown size={15} className={`transition-transform text-neutral-500 ${presetsOpen ? 'rotate-180' : ''}`} />
        </button>
        <button onClick={() => setSection3HintVisible(v => !v)}
          className="text-neutral-600 hover:text-neutral-400 transition-colors shrink-0" title={t.section3Hint}>
          <Info size={14} />
        </button>
      </div>

      {section3HintVisible && (
        <p className="text-[11px] text-neutral-500 bg-neutral-800/40 border border-neutral-700/40 rounded-lg px-3 py-2 leading-relaxed">
          {t.section3Hint}
        </p>
      )}

      {presetsOpen && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input type="text" value={presetName} onChange={e => setPresetName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSave()}
              placeholder={t.presetNamePlaceholder} maxLength={30}
              className="flex-1 bg-[#09090b] border border-neutral-700/50 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none font-mono transition-all placeholder:text-neutral-600" />
            <button onClick={onSave}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-700/50 bg-[#09090b] text-neutral-300 hover:border-blue-500/60 hover:text-blue-300 transition-all text-xs font-medium shrink-0">
              <BookmarkPlus size={14} /> {t.savePreset}
            </button>
          </div>

          {presets.length === 0 ? (
            <p className="text-xs text-neutral-600 text-center py-3">{t.noPresets}</p>
          ) : (
            <div className="space-y-2">
              {presets.map(preset => (
                <div key={preset.id}
                  className="flex items-center gap-2.5 bg-[#09090b] border border-neutral-800/60 rounded-xl px-3 py-2 group hover:border-neutral-700/60 transition-colors">
                  {preset.thumbnail ? (
                    <img src={preset.thumbnail} alt={preset.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg shrink-0 border border-white/10 flex items-center justify-center"
                      style={{ backgroundColor: preset.tapeColor }}>
                      <Bookmark size={14} className="text-white/60" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs text-neutral-200 font-mono truncate">{preset.name}</span>
                    <span className="text-[10px] text-neutral-600">{preset.labelStyle}</span>
                  </div>
                  <button onClick={() => onApply(preset)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors shrink-0 px-1">
                    {t.applyPreset}
                  </button>
                  <button onClick={() => onDelete(preset.id)}
                    className="text-neutral-700 hover:text-red-400 transition-colors shrink-0">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
