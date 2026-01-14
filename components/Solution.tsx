import React from 'react';
import { Lightbulb, Target, Rocket, Sparkles, ShoppingCart, ShieldCheck } from 'lucide-react';

interface SolutionProps {
  content?: Record<string, string>;
}

const Solution: React.FC<SolutionProps> = ({ content }) => {
  const title = content?.['solution-title'] || 'Your Vision. Validated. Launched.';
  const subtext = content?.['solution-subtext'] || 'SprouX is the bridge from Creator to Entrepreneur.<br />Stop guessing. Start launching with confidence.';
  const badgeText = content?.['solution-ai-synced-label'] || '';

  const phases = [
    {
      id: 1,
      label: 'A',
      icon: <Lightbulb size={28} />,
      color: 'bg-amber/10',
      text: 'text-amber',
      titleKey: 'phase-1-title',
      descKey: 'phase-1-desc',
      defaultTitle: 'Idea<br />Refinement',
      defaultDesc: 'Turn scattered thoughts and expertise into clear product ideas. Our AI aligns what you know best with market signals—so you start with ideas worth validating.',
      demo: (
        <div className="h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 p-4 relative">
           <div className="space-y-2">
              <div className="h-1.5 w-1/2 bg-amber/20 rounded-full"></div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full"></div>
              <div className="h-1.5 w-3/4 bg-slate-200 rounded-full"></div>
           </div>
           <div className="absolute bottom-3 right-3 p-1.5 bg-white rounded-lg shadow-md flex items-center gap-2">
              <Sparkles size={12} className="text-amber" />
              <span className="text-[8px] font-bold text-slate-500 uppercase">AI Refining...</span>
           </div>
        </div>
      )
    },
    {
      id: 2,
      label: 'B',
      icon: <Target size={28} />,
      color: 'bg-success/10',
      text: 'text-success',
      titleKey: 'phase-2-title',
      descKey: 'phase-2-desc',
      defaultTitle: 'Concept Validation',
      defaultDesc: 'Automatically generate test landing pages and surveys to validate demand with your audience. See what resonates, what converts, and what they’re actually willing to pay for.',
      demo: (
        <div className="h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-4">
           <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-between px-2">
                 <span className="text-[8px] text-slate-400">Demand Score</span>
                 <div className="w-1/2 h-1.5 bg-success rounded-full"></div>
              </div>
              <div className="w-full h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-between px-2">
                 <span className="text-[8px] text-slate-400">Market Rank</span>
                 <div className="w-1/3 h-1.5 bg-primary rounded-full"></div>
              </div>
           </div>
        </div>
      )
    },
    {
      id: 3,
      label: 'C',
      icon: <ShoppingCart size={28} />,
      color: 'bg-primary/10',
      text: 'text-primary',
      titleKey: 'phase-3-title',
      descKey: 'phase-3-desc',
      defaultTitle: 'Re-sell Campaign',
      defaultDesc: 'Turn validated concepts into a pre-sell campaign. Launch with landing pages, pricing, funding goals, and messaging in place, so you go live & start collecting pre-orders.',
      demo: (
        <div className="h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative p-4">
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <div className="h-2 w-16 bg-primary/20 rounded"></div>
                 <div className="text-[9px] font-bold text-primary">82% Sold</div>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-primary w-[82%]"></div>
              </div>
              <div className="flex gap-2">
                 <div className="h-6 w-1/2 bg-white rounded border border-slate-200"></div>
                 <div className="h-6 w-1/2 bg-primary rounded shadow-sm"></div>
              </div>
           </div>
        </div>
      )
    },
    {
      id: 4,
      label: 'D',
      icon: <ShieldCheck size={28} />,
      color: 'bg-violet/10',
      text: 'text-violet',
      titleKey: 'phase-4-title',
      descKey: 'phase-4-desc',
      defaultTitle: 'Delivery & Fund Release',
      defaultDesc: 'Deliver with built-in escrow and verification that protects both sides. You receive working capital upfront, then funds unlock automatically as backers confirm delivery.',
      demo: (
        <div className="h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-lg border border-violet/10 p-3 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                 <Rocket size={14} className="text-success" />
              </div>
              <div className="text-[9px] font-bold text-slate-800">Funds Released: $5,400</div>
              <div className="h-1 w-16 bg-slate-100 rounded-full"></div>
           </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
            {title.includes('Launched') ? (
              <>
                {title.split('Launched')[0]}
                <span className="text-primary">Launched</span>
                {title.split('Launched')[1]}
              </>
            ) : title}
          </h2>
          <p 
            className="text-lg text-slate-600 font-medium"
            dangerouslySetInnerHTML={{ __html: subtext }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {phases.map((phase) => (
            <div key={phase.id} className="group p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
              <div className={`w-14 h-14 ${phase.color} rounded-2xl flex items-center justify-center ${phase.text} mb-8 group-hover:scale-110 transition-transform`}>
                {phase.icon}
              </div>
              <div className={`mb-4 inline-block px-3 py-1 ${phase.color} ${phase.text} text-xs font-bold rounded-full uppercase tracking-widest self-start`}>
                Phase {phase.label} {badgeText && `- ${badgeText}`}
              </div>
              <h3 
                className="text-2xl font-serif font-bold text-slate-900 mb-4 leading-tight"
                dangerouslySetInnerHTML={{ __html: content?.[phase.titleKey] || phase.defaultTitle }}
              />
              <p className="text-slate-600 mb-6 text-sm leading-relaxed text-justify">
                {content?.[phase.descKey] || phase.defaultDesc}
              </p>
              <div className="mt-auto pt-4">
                {phase.demo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;