import { Type, Palette, Check, Move, RotateCw, RotateCcw, Droplet, Maximize2, Circle } from 'lucide-react';
import { FONT_OPTIONS } from '../constants/fonts';
import { TAPE_COLORS } from '../constants/colors';
import { makeSnapshot } from '../lib/presets';

export default function SectionLabel({
  t, folderShape,
  label, setLabelWithHistory,
  labelStyle, setLabelStyleWithHistory,
  fontFamily, setFontFamilyWithHistory,
  fontSizeMultiplier, setFontSizeMultiplierWithHistory,
  tapeScale, setTapeScaleWithHistory,
  tapeRotation, setTapeRotationWithHistory,
  badgeSize, setBadgeSizeWithHistory,
  tapeOffset, setTapeOffset,
  badgeOffset, setBadgeOffset,
  tapeColor, setTapeColorWithHistory,
  tapeOpacity, setTapeOpacityWithHistory,
  tapeColorInputRef, isPresetColor,
  pushHistory, stateRef,
}) {
  return (
    <section className="rounded-xl border border-white/[0.07] bg-[#09090b] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5">
        <div className="w-6 h-6 rounded-md bg-violet-500/15 flex items-center justify-center text-violet-400" aria-hidden="true">
          <Type size={13} />
        </div>
        <h2 className="text-xs font-semibold tracking-wide text-neutral-300 uppercase">{t.section2}</h2>
      </div>
      <div className="p-4 space-y-4">

        {/* Style selector */}
        <div className="flex gap-2">
          {['dymo', 'banner', 'badge'].map(style => {
            const isDisabled = (style === 'banner' || style === 'badge') && folderShape === 'cassette';
            return (
              <button key={style} onClick={() => !isDisabled && setLabelStyleWithHistory(style)} disabled={isDisabled}
                className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                  isDisabled
                    ? 'border-neutral-800/30 bg-[#09090b]/40 text-neutral-700 cursor-not-allowed'
                    : labelStyle === style
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                      : 'border-neutral-700/50 bg-[#121214] text-neutral-400 hover:border-neutral-500'
                }`}>
                {t[`style${style.charAt(0).toUpperCase()}${style.slice(1)}`]}
              </button>
            );
          })}
        </div>

        {/* Label text */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-500">{t.labelText}</label>
          <input type="text" value={label} maxLength={30} onChange={e => setLabelWithHistory(e.target.value)}
            className="w-full bg-[#121214] border border-neutral-700/50 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none font-mono transition-all text-sm"
            placeholder={t.labelPlaceholder} />
        </div>

        {label.trim() !== '' && (
          <>
            {/* Font */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-500">{t.font}</label>
              <div className="grid grid-cols-4 gap-2">
                {FONT_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => setFontFamilyWithHistory(opt.family)}
                    className={`py-2 px-1 rounded-lg border text-xs transition-all ${
                      fontFamily === opt.family
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                        : 'border-neutral-700/50 bg-[#121214] text-neutral-400 hover:border-neutral-500'
                    }`} style={{ fontFamily: opt.family }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div>
              <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                <span className="flex items-center gap-1"><Type size={12} /> {t.fontSize}</span>
                <span>{Math.round(fontSizeMultiplier * 100)}%</span>
              </div>
              <input type="range" min="0.4" max="1.6" step="0.05" value={fontSizeMultiplier}
                onChange={e => setFontSizeMultiplierWithHistory(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>

            {/* Dymo-specific */}
            {labelStyle === 'dymo' && (
              <>
                <div>
                  <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1"><Maximize2 size={12} /> {t.tapeSize}</span>
                    <div className="flex items-center gap-1">
                      <span>{Math.round(tapeScale * 100)}%</span>
                      {tapeScale !== 1 && (
                        <button onClick={() => { setTapeScaleWithHistory(1); pushHistory(makeSnapshot({ ...stateRef.current, tapeScale: 1 })); }}
                          className="text-neutral-600 hover:text-neutral-300 transition-colors ml-1" title={t.resetTip}>
                          <RotateCcw size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                  <input type="range" min="0.4" max="2" step="0.05" value={tapeScale}
                    onChange={e => setTapeScaleWithHistory(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1"><RotateCw size={12} /> {t.tapeAngle}</span>
                    <div className="flex items-center gap-1">
                      <span>{tapeRotation.toFixed(1)}°</span>
                      {tapeRotation !== -2.3 && (
                        <button onClick={() => { setTapeRotationWithHistory(-2.3); pushHistory(makeSnapshot({ ...stateRef.current, tapeRotation: -2.3 })); }}
                          className="text-neutral-600 hover:text-neutral-300 transition-colors ml-1" title={t.resetTip}>
                          <RotateCcw size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                  <input type="range" min="-15" max="15" step="0.5" value={tapeRotation}
                    onChange={e => setTapeRotationWithHistory(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
              </>
            )}

            {/* Badge size */}
            {labelStyle === 'badge' && (
              <div>
                <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                  <span className="flex items-center gap-1"><Circle size={12} /> {t.badgeSize}</span>
                  <div className="flex items-center gap-1">
                    <span>{badgeSize}px</span>
                    {badgeSize !== 160 && (
                      <button onClick={() => { setBadgeSizeWithHistory(160); pushHistory(makeSnapshot({ ...stateRef.current, badgeSize: 160 })); }}
                        className="text-neutral-600 hover:text-neutral-300 transition-colors ml-1" title={t.resetTip}>
                        <RotateCcw size={10} />
                      </button>
                    )}
                  </div>
                </div>
                <input type="range" min="60" max="220" step="5" value={badgeSize}
                  onChange={e => setBadgeSizeWithHistory(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
            )}

            {/* Drag hint */}
            {(labelStyle === 'dymo' || labelStyle === 'badge') && (
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                  <Move size={11} className="shrink-0" /> {t.dragHint}
                </p>
                {((labelStyle === 'dymo' && (tapeOffset.x !== 0 || tapeOffset.y !== 0)) ||
                  (labelStyle === 'badge' && (badgeOffset.x !== 0 || badgeOffset.y !== 0))) && (
                  <button
                    onClick={() => {
                      if (labelStyle === 'dymo') { setTapeOffset({ x: 0, y: 0 }); pushHistory(makeSnapshot({ ...stateRef.current, tapeOffset: { x: 0, y: 0 } })); }
                      else { setBadgeOffset({ x: 0, y: 0 }); pushHistory(makeSnapshot({ ...stateRef.current, badgeOffset: { x: 0, y: 0 } })); }
                    }}
                    className="flex items-center gap-1 text-[10px] text-neutral-600 hover:text-neutral-300 transition-colors ml-2 shrink-0">
                    <RotateCcw size={10} /> {t.resetBtn}
                  </button>
                )}
              </div>
            )}

            {/* Color */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-500 flex items-center gap-1">
                <Palette size={13} />
                {labelStyle === 'banner' ? t.colorBanner : labelStyle === 'badge' ? t.colorBadge : t.colorTape}
              </label>
              <div className="flex gap-3 items-center">
                {TAPE_COLORS.map(color => (
                  <button key={color.id} onClick={() => setTapeColorWithHistory(color.hex)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      tapeColor === color.hex ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'
                    }`} style={{ backgroundColor: color.hex }} title={t.colorNames[color.id] ?? color.name}>
                    {tapeColor === color.hex && (
                      <Check size={14} className={color.id === 'white' || color.id === 'vintage' ? 'text-black' : 'text-white'} />
                    )}
                  </button>
                ))}
                <button onClick={() => tapeColorInputRef.current?.click()} title={t.customColor}
                  className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-105 ${
                    !isPresetColor ? 'border-blue-500 scale-110' : 'border-dashed border-neutral-600 hover:border-neutral-400'
                  }`} style={!isPresetColor ? { backgroundColor: tapeColor } : {}}>
                  {isPresetColor
                    ? <Palette size={12} className="text-neutral-400" />
                    : <Check size={14} style={{ color: '#fff', mixBlendMode: 'difference' }} />}
                </button>
                <input ref={tapeColorInputRef} type="color" value={tapeColor}
                  onChange={e => setTapeColorWithHistory(e.target.value)} className="sr-only" />
              </div>
            </div>

            {/* Opacity */}
            <div className="pt-3 border-t border-white/5">
              <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                <span className="flex items-center gap-1"><Droplet size={13} /> {t.opacity}</span>
                <span>{Math.round(tapeOpacity * 100)}%</span>
              </div>
              <input type="range" min="0.1" max="1" step="0.05" value={tapeOpacity}
                onChange={e => setTapeOpacityWithHistory(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>
          </>
        )}

      </div>
    </section>
  );
}
