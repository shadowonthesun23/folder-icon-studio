export default function SidebarHeader({ lang, switchLang, t }) {
  return (
    <div className="relative p-6 lg:p-8 pb-4 lg:pb-6 border-b border-white/5 shrink-0">
      <div className="absolute top-4 right-5 lg:top-5 lg:right-7 flex items-center gap-0.5 bg-[#09090b] border border-neutral-800 rounded-md p-0.5">
        {['it', 'en'].map(l => (
          <button key={l} onClick={() => switchLang(l)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide transition-all ${
              lang === l ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}>{l.toUpperCase()}</button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Folder Icon Studio" className="w-8 h-8 lg:w-10 lg:h-10 object-contain shrink-0" />
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">Folder Icon Studio</h1>
      </div>
      <p className="text-neutral-400 text-xs lg:text-sm mt-1">{t.subtitle}</p>
    </div>
  );
}
