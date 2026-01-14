
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CreatorsGridProps {
  content?: Record<string, string>;
  metadata?: Record<string, any>;
  onDynamicLink?: (path: string) => void;
}

const CreatorsGrid: React.FC<CreatorsGridProps> = ({ content, metadata, onDynamicLink }) => {
  const sectionTitle = content?.['creators-title'] || 'Join the New Generation of Knowledge Entrepreneurs';
  const sectionSubtext = content?.['creators-subtext'] || 'Meet our Co-Creators—visionaries partnering with SprouX to shape the platform and the way creators turn their expertise into impact.';
  const sectionCta = content?.['creators-cta'] || 'Be Our Co-Creator';
  const sectionCtaLink = metadata?.['creators-cta']?.link || '#';

  const creators = [
    {
      id: 'creator-1',
      name: content?.['creator-1-name'] || "Alex Rivera",
      role: content?.['creator-1-role'] || "AI Automation Expert",
      desc: content?.['creator-1-quote'] || "Partnering with SprouX to streamline how technical experts package workflow.",
      image: content?.['creator-1-img'] || "https://picsum.photos/400/400?random=1",
      alt: content?.['creator-1-img-alt'] || "Alex Rivera",
      btnText: content?.['creator-1-link'] || 'View Profile',
      btnLink: metadata?.['creator-1-link']?.link || '#'
    },
    {
      id: 'creator-2',
      name: content?.['creator-2-name'] || "Sarah Chen",
      role: content?.['creator-2-role'] || "Finance Creator",
      desc: content?.['creator-2-quote'] || "Testing data-driven idea validation to ensure every launch is a win.",
      image: content?.['creator-2-img'] || "https://picsum.photos/400/400?random=2",
      alt: content?.['creator-2-img-alt'] || "Sarah Chen",
      btnText: content?.['creator-2-link'] || 'View Profile',
      btnLink: metadata?.['creator-2-link']?.link || '#'
    },
    {
      id: 'creator-3',
      name: content?.['creator-3-name'] || "Marcus Thorne",
      role: content?.['creator-3-role'] || "Digital Strategist",
      desc: content?.['creator-3-quote'] || "Moving from platform-dependency to true ownership using AI-powered tech.",
      image: content?.['creator-3-img'] || "https://picsum.photos/400/400?random=3",
      alt: content?.['creator-3-img-alt'] || "Marcus Thorne",
      btnText: content?.['creator-3-link'] || 'View Profile',
      btnLink: metadata?.['creator-3-link']?.link || '#'
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
            {sectionTitle}
          </h2>
          <p className="text-lg text-slate-600">
            {sectionSubtext}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {creators.map((creator, i) => (
            <div key={i} className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
               {/* IMAGE SLOT */}
               <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 relative">
                  <img src={creator.image} alt={creator.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                     <button 
                       onClick={() => onDynamicLink?.(creator.btnLink)}
                       className="w-full py-2 bg-white/20 backdrop-blur-md text-white rounded-lg border border-white/30 text-xs font-bold uppercase tracking-widest hover:bg-white/40 transition-colors"
                     >
                       {creator.btnText}
                     </button>
                  </div>
               </div>
               <h3 className="text-2xl font-serif font-bold text-slate-900">{creator.name}</h3>
               <p className="text-primary font-bold text-sm mb-4 uppercase tracking-wider">{creator.role}</p>
               <p className="text-slate-600 leading-relaxed italic">"{creator.desc}"</p>
            </div>
          ))}
        </div>

        <div className="text-center">
           <div className="inline-flex flex-col items-center gap-6">
              <button 
                onClick={() => onDynamicLink?.(sectionCtaLink)}
                className="px-10 py-5 bg-primary text-white font-bold rounded-2xl text-lg flex items-center gap-2 hover:bg-teal-800 transition-all shadow-xl shadow-teal-700/20 group"
              >
                {sectionCta}
                <ArrowUpRight size={22} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorsGrid;
