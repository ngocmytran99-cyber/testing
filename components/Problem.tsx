import React from 'react';
import { AlertCircle, TrendingUp, Lock, CheckCircle } from 'lucide-react';

interface ProblemProps {
  content?: Record<string, string>;
}

const Problem: React.FC<ProblemProps> = ({ content }) => {
  const title = content?.['problem-title'] || 'Where Most Creators Get Stuck';
  const desc = content?.['problem-desc'] || 'You did everything right—built an audience, earned trust, showed up every day. But your business still isn’t truly yours.';
  
  const point1 = content?.['problem-point-1'] || "70% of creators still depend on brand deals for survival.";
  const point2 = content?.['problem-point-2'] || "Platforms own your audience. One algorithm change can erase your income.";
  const point3 = content?.['problem-point-3'] || "You have real expertise—but turning it into recurring income still feels risky.";

  const oldLabel = content?.['problem-old-label'] || "Old Model";
  const oldMicro = content?.['problem-old-micro'] || "Slave to algorithms. Unpredictable revenue.";
  const newLabel = content?.['problem-new-label'] || "SprouX Model";
  const newMicro = content?.['problem-new-micro'] || "Asset ownership. Automated launch. Scale.";

  const img1 = content?.['problem-img-1'] || "https://picsum.photos/400/400?grayscale";
  const alt1 = content?.['problem-img-1-alt'] || "Frustrated Creator";
  const img2 = content?.['problem-img-2'] || "https://picsum.photos/401/401";
  const alt2 = content?.['problem-img-2-alt'] || "Empowered Entrepreneur";

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-6">
              {title.split('Get Stuck').length > 1 ? (
                 <>
                   {title.split('Get Stuck')[0]}
                   <br />
                   <span className="text-primary">Get Stuck</span>
                 </>
              ) : title}
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {desc}
            </p>
            
            <div className="space-y-6 mb-10">
              <ProblemPoint 
                icon={<AlertCircle className="text-destructive" />} 
                text={point1} 
              />
              <ProblemPoint 
                icon={<Lock className="text-warning" />} 
                text={point2} 
              />
              <ProblemPoint 
                icon={<TrendingUp className="text-primary" />} 
                text={point3} 
              />
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
               {/* Frustrated Creator Card (LOCKED WRAPPER) */}
               <div className="col-span-1 p-6 glass-card rounded-2xl shadow-xl border-slate-200 -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                    <img src={img1} alt={alt1} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="p-3 bg-white/90 rounded-full shadow-lg">
                          <AlertCircle size={32} className="text-destructive" />
                       </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{oldLabel}</h4>
                  <p className="text-sm text-slate-500">{oldMicro}</p>
               </div>
               {/* Confident Entrepreneur Card (LOCKED WRAPPER) */}
               <div className="col-span-1 p-6 bg-primary rounded-2xl shadow-2xl translate-y-12 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-square bg-teal-800 rounded-xl mb-4 overflow-hidden relative">
                    <img src={img2} alt={alt2} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="p-3 bg-teal-400 rounded-full shadow-lg">
                          <CheckCircle size={32} className="text-white" />
                       </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-white mb-2">{newLabel}</h4>
                  <p className="text-sm text-teal-100">{newMicro}</p>
               </div>
            </div>
            {/* Background Blob (LOCKED VISUAL) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-slate-100 rounded-full -z-10 blur-3xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProblemPoint: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1">{icon}</div>
    <p className="text-slate-700 font-medium">{text}</p>
  </div>
);

export default Problem;