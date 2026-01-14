
import React from 'react';
import { Rocket, Sparkles, CheckCircle } from 'lucide-react';

interface FinalCTAProps {
  content?: Record<string, string>;
  metadata?: Record<string, any>;
  onNavigate?: (view: any) => void;
  onDynamicLink?: (path: string) => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ content, metadata, onNavigate, onDynamicLink }) => {
  const badgeText = content?.['cta-badge'] || 'Limited Beta Now Open';
  const title = content?.['cta-title'] || 'Ready to Launch<br />Your Big Idea?';
  const desc = content?.['cta-desc'] || "Build your vision and monetize your knowledge today.";
  const btnText = content?.['cta-btn'] || 'Launch Now';
  const ctaLink = metadata?.['cta-btn']?.link || 'pricing';
  
  const perks = [
    content?.['cta-perk-1'] || 'Risk-Free Infrastructure',
    content?.['cta-perk-2'] || 'No Technical Setup',
    content?.['cta-perk-3'] || 'AI Launch Support',
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div 
          className="rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,118,110,0.3)] border border-white/10 group"
          style={{
            background: 'linear-gradient(135deg, #0f766e 0%, #064e4b 100%)'
          }}
        >
           {/* --- Complex Background Layers --- */}
           
           {/* 1. Animated Mesh Energy */}
           <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-teal-400/20 rounded-full blur-[120px] animate-cta-blob"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[100px] animate-cta-blob-delayed"></div>
           </div>

           {/* 2. Micro-Grid Pattern */}
           <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
               backgroundSize: '32px 32px' 
             }}>
           </div>

           {/* 3. Floating Brand Motifs */}
           <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-20">
              <div className="absolute top-[15%] left-[8%] rotate-12 animate-float">
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                   <path d="M20 20 L80 80 M80 20 L20 80" stroke="white" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute bottom-[15%] right-[8%] -rotate-12 animate-float-delayed">
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                   <path d="M50 80 C50 80 20 50 20 30 C20 10 50 10 50 10 C50 10 80 10 80 30 C80 50 50 80 50 80Z" fill="white" />
                </svg>
              </div>
           </div>

           {/* --- Content --- */}
           <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl rounded-full text-white text-xs font-bold uppercase tracking-[0.2em] mb-10 border border-white/20 shadow-xl">
                 <Sparkles size={16} className="text-amber animate-pulse" />
                 {badgeText}
              </div>
              
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              
              <p className="text-lg md:text-xl text-teal-50/80 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                 {desc}
              </p>
              
              <div className="flex flex-col items-center gap-8">
                <button 
                  onClick={() => onDynamicLink ? onDynamicLink(ctaLink) : onNavigate?.('pricing')}
                  className="px-12 py-6 bg-white text-primary font-bold rounded-2xl text-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 group/btn"
                >
                   <Rocket size={24} className="group-hover/btn:translate-y-[-4px] group-hover/btn:translate-x-[2px] transition-transform duration-300" />
                   {btnText}
                </button>

                <div className="flex flex-wrap justify-center gap-6">
                   {perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-teal-100/70 text-sm font-medium">
                        <CheckCircle size={16} className="text-teal-400" />
                        {perk}
                      </div>
                   ))}
                </div>
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cta-blob {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -60px) scale(1.15); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes cta-blob-delayed {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-40px, 60px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-cta-blob { animation: cta-blob 12s infinite alternate cubic-bezier(0.45, 0, 0.55, 1); }
        .animate-cta-blob-delayed { animation: cta-blob-delayed 15s infinite alternate-reverse cubic-bezier(0.45, 0, 0.55, 1); }
      `}} />
    </section>
  );
};

export default FinalCTA;
