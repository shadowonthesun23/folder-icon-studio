import { useState } from 'react';
import { ChevronDown, HelpCircle, MonitorDown } from 'lucide-react';

export default function SectionInstructions({ t }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-white/[0.07] bg-[#09090b] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5">
        <div className="w-6 h-6 rounded-md bg-emerald-500/15 flex items-center justify-center text-emerald-400" aria-hidden="true">
          <HelpCircle size={13} />
        </div>
        <button onClick={() => setOpen(o => !o)} className="flex-1 flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wide text-neutral-300 uppercase">{t.section4}</h2>
          <ChevronDown size={13} className={`transition-transform text-neutral-500 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="p-4 space-y-4">
          <p className="text-[11px] leading-relaxed text-neutral-500">{t.iconInstructionsIntro}</p>
          {t.iconInstructions.map(group => (
            <div key={group.title} className="space-y-2">
              <h3 className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
                <MonitorDown size={12} className="text-neutral-500" />
                {group.title}
              </h3>
              <ol className="space-y-1.5 text-[11px] leading-relaxed text-neutral-500 list-decimal list-inside">
                {group.steps.map(step => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
