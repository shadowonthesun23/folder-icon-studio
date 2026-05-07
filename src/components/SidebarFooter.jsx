import { Download, ChevronDown, Undo2, Redo2, Coffee } from 'lucide-react';
import { IconX, IconInstagram } from '../icons';

export default function SidebarFooter({
  t,
  canUndo, canRedo, onUndo, onRedo,
  isExporting,
  downloadMenuOpen, setDownloadMenuOpen, downloadMenuRef,
  onDownloadPng, onDownloadIcns, onDownloadIco,
}) {
  return (
    <div className="sidebar-footer shrink-0 p-6 lg:p-8 pt-5 bg-[#121214]">
      {/* Undo / Redo */}
      <div className="flex gap-2 mb-4">
        <button onClick={onUndo} disabled={!canUndo} title={`${t.undo} (Cmd+Z)`}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${
            canUndo
              ? 'border-neutral-700/50 bg-[#09090b] text-neutral-300 hover:border-neutral-500 hover:text-white'
              : 'border-neutral-800/30 bg-[#09090b]/40 text-neutral-600 cursor-not-allowed'
          }`}>
          <Undo2 size={13} /> {t.undo}
        </button>
        <button onClick={onRedo} disabled={!canRedo} title={`${t.redo} (Cmd+Shift+Z)`}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${
            canRedo
              ? 'border-neutral-700/50 bg-[#09090b] text-neutral-300 hover:border-neutral-500 hover:text-white'
              : 'border-neutral-800/30 bg-[#09090b]/40 text-neutral-600 cursor-not-allowed'
          }`}>
          <Redo2 size={13} /> {t.redo}
        </button>
      </div>

      {/* Download */}
      <div ref={downloadMenuRef} className="relative w-full mb-6">
        <div className="flex w-full">
          <button onClick={onDownloadPng} disabled={isExporting}
            className="liquid-glass-btn flex-1 font-medium py-3.5 px-4 rounded-l-xl flex items-center justify-center gap-2">
            {isExporting
              ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              : <Download size={18} />}
            {t.download} PNG
          </button>
          <button onClick={() => setDownloadMenuOpen(o => !o)} disabled={isExporting}
            className="liquid-glass-btn font-medium py-3.5 px-3 rounded-r-xl border-l border-white/10 flex items-center justify-center">
            <ChevronDown size={16} className={`transition-transform ${downloadMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {downloadMenuOpen && (
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#1c1c1e] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
            <button onClick={onDownloadPng} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-200 hover:bg-white/5 transition-colors text-left">
              <Download size={15} className="text-neutral-400 shrink-0" />
              <div><div className="font-medium">{t.downloadPng}</div><div className="text-[11px] text-neutral-500">Universale, massima qualità</div></div>
            </button>
            <div className="h-px bg-white/5" />
            <button onClick={onDownloadIcns} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-200 hover:bg-white/5 transition-colors text-left">
              <Download size={15} className="text-neutral-400 shrink-0" />
              <div><div className="font-medium">{t.downloadIcns}</div><div className="text-[11px] text-neutral-500">11 risoluzioni + Retina @2x</div></div>
            </button>
            <div className="h-px bg-white/5" />
            <button onClick={onDownloadIco} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-200 hover:bg-white/5 transition-colors text-left">
              <Download size={15} className="text-neutral-400 shrink-0" />
              <div><div className="font-medium">{t.downloadIco}</div><div className="text-[11px] text-neutral-500">6 risoluzioni (16→256px)</div></div>
            </button>
          </div>
        )}
      </div>

      {/* Credits */}
      <div className="flex flex-col items-center gap-3 pt-6 border-t border-white/5">
        <span className="text-[10px] text-neutral-500 font-mono tracking-widest lowercase">made with love by antonello :)</span>
        <div className="flex items-center gap-5 text-neutral-400">
          <a href="https://x.com/antonello23" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><IconX size={16} /></a>
          <a href="https://www.instagram.com/antonelloan23/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><IconInstagram size={16} /></a>
          <a href="https://buymeacoffee.com/antonello23" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Coffee size={16} /></a>
        </div>
      </div>
    </div>
  );
}
