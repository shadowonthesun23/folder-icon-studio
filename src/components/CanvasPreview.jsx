import { Move } from 'lucide-react';

export default function CanvasPreview({
  t, coverSrc, label,
  canvasRef,
  onPointerDown, onPointerMove, onPointerUp,
}) {
  return (
    <main className="flex-1 relative flex flex-col items-center justify-center min-h-0 overflow-hidden bg-dot-pattern p-4 md:p-8">
      {!coverSrc && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-neutral-600 text-xs pointer-events-none select-none">
          <span className="animate-bounce-x">←</span>
          <span>{t.uploadHint}</span>
        </div>
      )}
      <div className="relative group w-full h-full flex items-center justify-center max-w-4xl" style={{ touchAction: 'none' }}>
        {(coverSrc || label.trim() !== '') && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-neutral-800/80 backdrop-blur text-neutral-300 text-xs px-3 py-1.5 rounded-full pointer-events-none border border-white/10 z-20">
            <Move size={12} /> {t.dragCanvasHint}
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={1024} height={1024}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="max-w-full max-h-full aspect-square object-contain drop-shadow-2xl"
        />
      </div>
    </main>
  );
}
