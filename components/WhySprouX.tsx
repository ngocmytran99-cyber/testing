import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Heart, 
  Zap, 
  Rocket, 
  Settings,
  CheckCircle2
} from 'lucide-react';

interface WhySprouXProps {
  content?: Record<string, string>;
}

const WhySprouX: React.FC<WhySprouXProps> = ({ content }) => {
  const title = content?.['benefit-title'] || 'Why Choose SprouX?';
  const subtitle = content?.['benefit-desc'] || 'The ultimate toolkit for the modern knowledge entrepreneur.';
  
  const defaultBenefits = [
    {
      id: 1,
      icon: <Rocket className="text-primary" />,
      title: "Comprehensive launch system",
      desc: "Covers the full journey from idea refinement and validation to pre-sell and delivery."
    },
    {
      id: 2,
      icon: <Cpu className="text-primary" />,
      title: "AI-Powered Guidance",
      desc: "AI assists at every stage, giving creators clarity, insights, and actionable recommendations."
    },
    {
      id: 3,
      icon: <ShieldCheck className="text-violet" />,
      title: "Risk-free for creators and backers",
      desc: "Pre-orders secure early revenue while escrow and verification protect backers."
    },
    {
      id: 4,
      icon: <Zap className="text-amber" />,
      title: "From idea to campaign-ready in days",
      desc: "A structured flow replaces scattered tools, helping creators go from idea to live campaign fast."
    },
    {
      id: 5,
      icon: <Heart className="text-primary" />,
      title: "Your community, your terms",
      desc: "Design offerings that align with your fans’ real needs and your own expertise."
    },
    {
      id: 6,
      icon: <Settings className="text-slate-500" />,
      title: "Flexible Process",
      desc: "Start at any phase or skip steps, customizing the journey to your workflow and goals."
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-violet-100/40 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 mb-6">
            <CheckCircle2 size={16} className="text-success" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Core Advantages</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
             {title.includes('SprouX') ? (
               <>
                 {title.split('SprouX')[0]}
                 <span className="text-primary">SprouX?</span>
               </>
             ) : title}
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
           {defaultBenefits.map((benefit) => {
             const cmsTitle = content?.[`benefit-${benefit.id}-title`] || benefit.title;
             const cmsDesc = content?.[`benefit-${benefit.id}-desc`] || benefit.desc;
             
             return (
               <div 
                  key={benefit.id}
                  className="flex items-start gap-6 group"
               >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-500">
                    <div className="group-hover:text-white transition-colors duration-500">
                      {benefit.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif group-hover:text-primary transition-colors duration-300">
                      {cmsTitle}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm max-w-md">
                      {cmsDesc}
                    </p>
                  </div>
               </div>
             );
           })}
        </div>
      </div>
    </section>
  );
};

export default WhySprouX;