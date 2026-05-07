import { useState } from 'react';
import { Upload, ZoomIn, RotateCw, Palette, Check, X } from 'lucide-react';
import { FOLDERS } from '../constants/folders';
import { getTapeTextColor } from '../lib/canvas';

export default function SectionArtwork({
  t, folderShape, setFolderShape,
  coverSrc, onFileUpload, onClearImage, fileInputRef,
  coverScale, setCoverScaleWithHistory,
  coverRotation, setCoverRotationWithHistory,
  folderColorOverride, setFolderColorOverrideWithHistory,
  customFolderColor, setCustomFolderColor,
  activeColorPalette, isCustomFolderColor,
  folderColorInputRef,
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const syntheticEvent = { target: { files: [file], value: '' } };
    onFileUpload(syntheticEvent);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase flex items-center gap-2">
        <span className="w-4 h-4 flex items-center justify-center opacity-70">🖼</span>
        {t.section1}
      </h2>

      {/* Folder style */}
      <div className="space-y-2">
        <label className="text-xs text-neutral-500">{t.folderStyle}</label>
        <div className="flex gap-2">
          {Object.values(FOLDERS).map(f => (
            <button key={f.id} onClick={() => setFolderShape(f.id)}
              className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                folderShape === f.id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                  : 'border-neutral-700/50 bg-[#09090b] text-neutral-400 hover:border-neutral-500'
              }`}>{f.name}</button>
          ))}
        </div>
      </div>

      {/* Upload area */}
      <div className="relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label
          className={`flex flex-col items-center justify-center w-full h-36 px-4 transition-all border border-dashed rounded-xl cursor-pointer group overflow-hidden relative ${
            isDraggingOver ? 'border-blue-400 scale-[1.01]' : ''
          }`}
          style={coverSrc && !isDraggingOver
            ? { backgroundImage: `url(${coverSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', borderColor: 'rgba(255,255,255,0.15)' }
            : isDraggingOver
              ? { backgroundColor: 'rgba(59,130,246,0.08)', borderColor: 'rgba(96,165,250,0.6)' }
              : { backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.15)' }}
        >
          {coverSrc && !isDraggingOver && <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />}
          {!coverSrc && !isDraggingOver && <div className="absolute inset-0 group-hover:bg-blue-500/5 transition-colors rounded-xl" />}
          <div className="relative z-10 flex flex-col items-center space-y-2 text-center">
            <div className={`p-3 rounded-full transition-colors ${
              isDraggingOver
                ? 'bg-blue-500/20'
                : coverSrc ? 'bg-white/10 group-hover:bg-white/20' : 'bg-neutral-800 group-hover:bg-blue-500/20'
            }`}>
              <Upload size={20} className={isDraggingOver ? 'text-blue-400' : coverSrc ? 'text-white' : 'text-neutral-400 group-hover:text-blue-400'} />
            </div>
            <span className={`font-medium text-sm ${isDraggingOver ? 'text-blue-300' : coverSrc ? 'text-white' : 'text-neutral-300'}`}>
              {isDraggingOver ? 'Rilascia qui' : coverSrc ? t.changeImage : t.uploadImage}
            </span>
            <span className={`text-xs ${isDraggingOver ? 'text-blue-400/70' : coverSrc ? 'text-white/60' : 'text-neutral-500'}`}>
              {isDraggingOver ? '— oppure clicca per sfogliare —' : t.uploadFormats}
            </span>
          </div>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={onFileUpload} />
        </label>
        {coverSrc && (
          <button onClick={onClearImage} title={t.removeImage}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-red-500/80 text-neutral-400 hover:text-white transition-all z-20">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Zoom + Rotation */}
      {coverSrc && (
        <div className="bg-[#09090b] p-4 rounded-xl border border-neutral-800/50 space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
              <span className="flex items-center gap-1"><ZoomIn size={14} /> {t.zoom}</span>
              <span>{Math.round(coverScale * 100)}%</span>
            </div>
            <input type="range" min="0.5" max="2.5" step="0.05" value={coverScale}
              onChange={e => setCoverScaleWithHistory(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
              <span className="flex items-center gap-1"><RotateCw size={14} /> {t.coverRotation}</span>
              <span>{coverRotation}°</span>
            </div>
            <input type="range" min="-180" max="180" step="1" value={coverRotation}
              onChange={e => setCoverRotationWithHistory(parseInt(e.target.value))}
              className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>
        </div>
      )}

      {/* Folder color */}
      {FOLDERS[folderShape].tintFolder && (
        <div className="space-y-2">
          <label className="text-xs text-neutral-500 flex items-center gap-1">
            <Palette size={13} /> {folderShape === 'cassette' ? t.cassetteColor : t.folderColor}
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => setFolderColorOverrideWithHistory(null)} title={t.defaultColor}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                folderColorOverride === null ? 'border-blue-500 scale-110' : 'border-neutral-600 hover:scale-105'
              }`}
              style={folderShape === 'cassette'
                ? { background: 'linear-gradient(135deg, #8B7355 0%, #5c4a32 50%, #3a2e1f 100%)' }
                : { background: 'linear-gradient(135deg, #6aadff 0%, #2171e8 100%)' }}>
              {folderColorOverride === null && <Check size={11} className="text-white" />}
            </button>
            {activeColorPalette.slice(1).map(color => (
              <button key={color.id} onClick={() => setFolderColorOverrideWithHistory(color.hex)} title={color.name}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  folderColorOverride === color.hex && !isCustomFolderColor ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                }`} style={{ backgroundColor: color.hex }}>
                {folderColorOverride === color.hex && !isCustomFolderColor && (
                  <Check size={11} style={{ color: getTapeTextColor(color.hex) }} />
                )}
              </button>
            ))}
            <button onClick={() => folderColorInputRef.current?.click()} title={t.customColor}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all hover:scale-105 ${
                isCustomFolderColor ? 'border-white scale-110' : 'border-dashed border-neutral-600 hover:border-neutral-400'
              }`} style={isCustomFolderColor ? { backgroundColor: folderColorOverride } : {}}>
              {isCustomFolderColor
                ? <Check size={11} style={{ color: '#fff', mixBlendMode: 'difference' }} />
                : <Palette size={11} className="text-neutral-400" />}
            </button>
            <input ref={folderColorInputRef} type="color"
              value={isCustomFolderColor ? folderColorOverride : customFolderColor}
              onChange={e => { setCustomFolderColor(e.target.value); setFolderColorOverrideWithHistory(e.target.value); }}
              className="sr-only" />
          </div>
        </div>
      )}
    </section>
  );
}
