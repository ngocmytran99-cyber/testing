
import React, { useState } from 'react';
import { 
  ArrowRight, Lightbulb, Target, ShoppingCart, 
  ShieldCheck, CheckCircle2, MousePointer2, 
  Image as ImageIcon, Users, ShieldAlert, 
  Zap, BarChart4, TrendingUp, Lock, Layout,
  Search, Bell, Settings, UserCheck, Sparkles,
  Cpu, Layers, ZapIcon, Rocket, CheckCircle,
  Share2, Network, Workflow
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { PageData } from '../types';

interface HowItWorksProps {
  onNavigate: (view: 'home' | 'pricing' | 'how-it-works') => void;
  // Added page prop to fix compatibility error in App.tsx
  page?: PageData;
  content?: Record<string, string>;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate, page, content: providedContent }) => {
  const [activeTab, setActiveTab] = useState('phase1');

  // Extract content from page blocks if provided, otherwise use providedContent
  const content = React.useMemo(() => {
    const combined: Record<string, string> = { ...providedContent };
    if (page) {
      page.blocks.forEach(b => {
        combined[b.id] = b.value;
        if (b.type === 'image' && b.metadata?.alt) combined[`${b.id}-alt`] = b.metadata.alt;
      });
    }
    return combined;
  }, [page, providedContent]);

  // Dynamic Icon Helper
  const renderIcon = (iconName: string, size = 24, className = "") => {
    const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;
    return <IconComponent size={size} className={className} />;
  };

  const phases = [
    {
      id: 'phase1',
      icon: <Lightbulb size={24} />,
      title: content?.['phase1-tab-label'] || 'Idea Refinement',
      fullTitle: content?.['phase1-full-title'] || 'Idea Refinement: Refine Your Idea in Minutes',
      subheadline: content?.['phase1-subheadline'] || 'Turn a vague concept into a clear, market-ready idea. Our AI-guided framework gives you structure, clarity, and confidence to move forward.',
      steps: [
        content?.['phase1-step1'] || 'Start the AI Conversation – Answer targeted questions about your content type, audience, and the problem you’re solving.',
        content?.['phase1-step2'] || 'Clarify Your Outcome – Define the result your audience will achieve and the format of your offering.',
        content?.['phase1-step3'] || 'Set Scope & Pricing – Determine the course duration, modules, and preliminary pricing hypothesis.',
        content?.['phase1-step4'] || 'Generate Your Concept Summary – Get a structured overview including title, positioning, outline, and delivery timeline.'
      ],
      illustrationColor: 'bg-amber-50'
    },
    {
      id: 'phase2',
      icon: <Target size={24} />,
      title: content?.['phase2-tab-label'] || 'Concept Validation',
      fullTitle: content?.['phase2-full-title'] || 'Concept Validation: Test Your Concept with Real Backers',
      subheadline: content?.['phase2-subheadline'] || 'Use simple, data-driven tactics to see if your idea resonates, measures interest, and identifies potential buyers.',
      steps: [
        content?.['phase2-step1'] || 'Select Platforms to Test: Choose 1–3 of your existing audiences to run validation tactics.',
        content?.['phase2-step2'] || 'Run Validation Tactics: Deploy lightweight methods like landing pages, polls, surveys, and teaser videos.',
        content?.['phase2-step3'] || 'Track Results in Real-Time: See reach, engagement, and interest aggregated in a single dashboard.',
        content?.['phase2-step4'] || 'Capture Top Questions: Automatically collect audience questions to pre-populate your FAQ.'
      ],
      illustrationColor: 'bg-emerald-50'
    },
    {
      id: 'phase3',
      icon: <ShoppingCart size={24} />,
      title: content?.['phase3-tab-label'] || 'Pre-sell Campaign',
      fullTitle: content?.['phase3-full-title'] || 'Pre-sell Campaign: Launch Your Validated Concept',
      subheadline: content?.['phase3-subheadline'] || 'Turn validated concepts into a pre-sell campaign. Launch with landing pages, pricing, funding goals, and messaging in place, so you go live & start collecting pre-orders.',
      steps: [
        content?.['phase3-step1'] || 'Pre-Populate Your Campaign: Phase A concept and Phase B validation data automatically fill details.',
        content?.['phase3-step2'] || 'Customize & Refine: Adjust media, description, modules, pricing, and delivery details.',
        content?.['phase3-step3'] || 'Set Funding Goal: Suggested target based on validation results gives you confidence.',
        content?.['phase3-step4'] || 'Launch & Track: Go live and monitor pledges, conversions, and backer questions in real-time.'
      ],
      illustrationColor: 'bg-teal-50'
    },
    {
      id: 'phase4',
      icon: <ShieldCheck size={24} />,
      title: content?.['phase4-tab-label'] || 'Delivery & Fund Release',
      fullTitle: content?.['phase4-full-title'] || 'Delivery & Fund Release: Get Paid, Build Trust',
      subheadline: content?.['phase4-subheadline'] || 'Ensure creators deliver what they promised and backers receive it, using automated verification and staged fund release.',
      steps: [
        content?.['phase4-step1'] || 'Submit Delivery Proof: Creators provide access links and screenshots showing content is live.',
        content?.['phase4-step2'] || 'Backer Verification: A random sample of backers confirms receipt via one-click email.',
        content?.['phase4-step3'] || 'Staged Fund Release: Funds held in escrow are released in 3 stages.',
        content?.['phase4-step4'] || 'Community Updates & Comments: Creators share progress updates and interact with backers.'
      ],
      illustrationColor: 'bg-violet-50'
    }
  ];

  const benefits = [
    {
      iconName: content?.['hiw-benefit-1-icon'] || 'Users',
      title: content?.['hiw-benefit-1-title'] || 'Structured Path',
      description: content?.['hiw-benefit-1-desc'] || 'Clear, step-by-step flow from idea to delivery keeps creators focused and efficient.'
    },
    {
      iconName: content?.['hiw-benefit-2-icon'] || 'ShieldAlert',
      title: content?.['hiw-benefit-2-title'] || 'Risk Minimization',
      description: content?.['hiw-benefit-2-desc'] || 'Validate demand before building, ensuring time and effort are invested wisely.'
    },
    {
      iconName: content?.['hiw-benefit-3-icon'] || 'Zap',
      title: content?.['hiw-benefit-3-title'] || 'Faster Launch',
      description: content?.['hiw-benefit-3-desc'] || 'Pre-populated campaigns and guided steps dramatically reduce setup time.'
    },
    {
      iconName: content?.['hiw-benefit-4-icon'] || 'BarChart4',
      title: content?.['hiw-benefit-4-title'] || 'Actionable Insights',
      description: content?.['hiw-benefit-4-desc'] || 'Real-time analytics and verification metrics help creators adjust strategy quickly.'
    },
    {
      iconName: content?.['hiw-benefit-5-icon'] || 'TrendingUp',
      title: content?.['hiw-benefit-5-title'] || 'Revenue Confidence',
      description: content?.['hiw-benefit-5-desc'] || 'Pre-orders and funding guidance turn interest into real commitments early.'
    },
    {
      iconName: content?.['hiw-benefit-6-icon'] || 'Lock',
      title: content?.['hiw-benefit-6-title'] || 'Trust & Accountability',
      description: content?.['hiw-benefit-6-desc'] || 'Escrow and verification ensure backers get what they paid for, and creators get paid reliably.'
    }
  ];

  const heroTitle = content?.['hiw-hero-title'] || 'The 4-Phase Knowledge Launch System';
  const heroDesc = content?.['hiw-hero-desc'] || 'From idea to pre-orders in days. Use our AI-driven framework to refine your expertise and secure your future.';
  const heroCta = content?.['hiw-hero-cta'] || 'Get Started';

  const hiwBenefitTitle = content?.['hiw-benefit-title'] || 'Why This Process Works?';

  const fctaTitle = content?.['hiw-fcta-title'] || 'Launch Your First<br />Knowledge Product';
  const fctaDesc = content?.['hiw-fcta-desc'] || 'From idea to pre-orders in days—guided, structured, and risk-free.';
  const fctaBtnText = content?.['hiw-fcta-btn'] || 'Begin My Launch';

  const activePhase = phases.find(p => p.id === activeTab) || phases[0];

  const renderStep = (step: string) => {
    const separators = [' – ', ': '];
    let separatorFound = '';
    for (const s of separators) { if (step.includes(s)) { separatorFound = s; break; } }
    if (!separatorFound) return <span className="font-normal">{step}</span>;
    const [stepTitle, ...rest] = step.split(separatorFound);
    const description = rest.join(separatorFound);
    return (
      <>
        <span className="font-bold text-slate-900">{stepTitle}</span>
        {separatorFound}
        <span className="font-normal text-slate-600">{description}</span>
      </>
    );
  };

  const renderHighlightedHeadline = (fullTitle: string) => {
    if (!fullTitle.includes(':')) return fullTitle;
    const [highlight, ...rest] = fullTitle.split(':');
    return (
      <>
        <span className="text-primary">{highlight}</span>
        <span className="text-slate-900">:{rest.join(':')}</span>
      </>
    );
  };

  return (
    <div className="bg-white font-sans text-slate-900">
      {/* --- Sync Optimized Hero Section --- */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden bg-white">
        {/* Layered Decorative Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* 1. Animated Glows */}
          <div className="absolute top-[-10%] left-[10%] w-[50%] h-[50%] bg-teal-50/60 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-amber-50/40 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* 2. Micro-Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.4]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)`,
              backgroundSize: '32px 32px' 
            }}>
          </div>

          {/* 3. System Motifs */}
          <div className="absolute inset-0 opacity-[0.03]">
             <svg width="100%" height="100%" className="text-primary">
                <defs>
                   <pattern id="sys-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                      <path d="M0 50 H100 M50 0 V100" fill="none" stroke="currentColor" strokeWidth="0.5" />
                   </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#sys-grid)" />
             </svg>
          </div>

          {/* 4. Floating Elements */}
          <div className="absolute top-[20%] left-[8%] animate-float opacity-30 hidden lg:block">
            <Cpu size={40} className="text-primary" />
          </div>
          <div className="absolute bottom-[25%] right-[8%] animate-float-delayed opacity-30 hidden lg:block">
            <Layers size={48} className="text-primary" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm animate-fade-in-down">
            <Sparkles size={14} className="text-primary" />
            <span>Guided Workflow System</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-[1.1] mb-8 max-w-4xl mx-auto animate-fade-in-up">
            {heroTitle.includes('<br />') ? (
              <span dangerouslySetInnerHTML={{ __html: heroTitle }} />
            ) : (
              <>
                The <span className="gradient-text">4-Phase</span> Knowledge <br />
                Launch System
              </>
            )}
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-12 leading-relaxed font-medium opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={() => onNavigate('pricing')}
              className="w-full sm:w-auto px-12 py-6 bg-primary text-white font-bold rounded-2xl text-xl flex items-center justify-center gap-3 hover:bg-teal-800 transition-all hover:scale-105 shadow-2xl shadow-teal-700/30 group"
            >
              {heroCta}
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(3deg); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(20px) rotate(-3deg); }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-float { animation: float 10s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 12s ease-in-out infinite; }
          .animate-fade-in-up { opacity: 0; animation: fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
          .animate-fade-in-down { opacity: 0; animation: fade-in-down 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        `}} />
      </section>

      {/* Phase Navigation */}
      <section className="pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {phases.map((phase, idx) => (
            <button
              key={phase.id}
              onClick={() => setActiveTab(phase.id)}
              className={`flex items-center gap-4 p-5 rounded-[24px] border transition-all text-left relative overflow-hidden group ${
                activeTab === phase.id ? 'border-primary bg-slate-50 shadow-md ring-4 ring-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-[16px] flex-shrink-0 flex items-center justify-center transition-all ${
                activeTab === phase.id ? 'bg-[#0F766E] text-white shadow-lg' : 'bg-[#F1F5F9] text-slate-400'
              }`}>
                {React.cloneElement(phase.icon as React.ReactElement<any>, { size: 24 })}
              </div>
              <div className="flex flex-col">
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${activeTab === phase.id ? 'text-primary' : 'text-slate-400'}`}>Phase {idx + 1}</p>
                <h3 className={`text-base font-bold transition-colors leading-tight ${activeTab === phase.id ? 'text-slate-900' : 'text-slate-500'}`}>{phase.title}</h3>
              </div>
            </button>
          ))}
        </div>

        {/* Phase Content */}
        <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50">
          <div className="max-w-4xl w-full text-center mb-12 lg:mb-16 mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              {renderHighlightedHeadline(activePhase.fullTitle)}
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-light italic leading-relaxed max-w-2xl mx-auto">
              {activePhase.subheadline}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="w-full lg:w-1/2 space-y-8">
              {activePhase.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start group/step">
                  <div className="mt-1.5 flex-shrink-0 w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center group-hover/step:scale-110 group-hover/step:bg-primary transition-all duration-300">
                    <CheckCircle2 size={16} className="text-primary group-hover/step:text-white" />
                  </div>
                  <p className="text-base md:text-lg leading-relaxed text-left">{renderStep(step)}</p>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-1/2">
              <div className={`relative w-full aspect-[1.1/1] rounded-[2.5rem] ${activePhase.illustrationColor} overflow-hidden border border-slate-100 p-4 md:p-6 flex flex-col`}>
                <div className="w-full h-full bg-white rounded-[1.5rem] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col">
                   <div className="h-10 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/80 flex-shrink-0">
                      <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div><div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div><div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div></div>
                   </div>
                   <div className="flex-1 flex overflow-hidden">
                      <div className="w-12 border-r border-slate-100 bg-slate-50/30 p-2 flex flex-col items-center gap-4">
                         <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-md"><Layout size={16} /></div>
                      </div>
                      <div className="flex-1 p-5 md:p-8 flex flex-col bg-white relative">
                         <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm md:text-base font-bold text-slate-900">{activePhase.title}</h4>
                            <Sparkles size={16} className="text-primary/40 animate-pulse" />
                         </div>
                         <div className="flex-1 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center mt-2 bg-slate-50/30">
                            <div className="relative">
                               <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                               <Sparkles className="text-primary/20 relative z-10" size={60} />
                            </div>
                            <div className="mt-4 flex flex-col items-center gap-2">
                               <div className="h-1.5 w-24 bg-slate-200 rounded-full"></div>
                               <div className="h-1.5 w-16 bg-slate-100 rounded-full"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-[#F7F7F5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              {hiwBenefitTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[32px] shadow-sm flex flex-col group border border-transparent hover:border-primary/10 hover:shadow-xl transition-all duration-500">
                <div className="mb-8 w-14 h-14 bg-[#F1F5F9] rounded-2xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                  {renderIcon(benefit.iconName, 24, "text-[#006ADC] group-hover:scale-110 transition-transform")}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Refined Minimalist White Final CTA --- */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
        {/* --- Sophisticated Darker Background Patterns --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           {/* Strategic Dynamic Glows (Stronger Opacity) */}
           <div className="absolute top-[0%] left-[-5%] w-[60%] h-[100%] bg-teal-50/80 rounded-full blur-[140px] animate-cta-pulse"></div>
           <div className="absolute bottom-[0%] right-[-5%] w-[50%] h-[100%] bg-emerald-50/60 rounded-full blur-[120px] animate-cta-pulse-delayed"></div>
           
           {/* Darker Connectivity Patterns */}
           <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                    <pattern id="node-grid-refined" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                       <circle cx="5" cy="5" r="1.2" fill="#0F766E" />
                       <path d="M5 5 L120 5 M5 5 L5 120" stroke="#0F766E" strokeWidth="0.8" strokeOpacity="0.15" />
                    </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#node-grid-refined)" />
              </svg>
           </div>

           {/* Darker Workflow Watermarks */}
           <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.07]">
               <div className="absolute top-[15%] left-[5%] animate-float"><Network size={220} className="text-primary" /></div>
               <div className="absolute bottom-[10%] right-[3%] animate-float-delayed rotate-12"><Workflow size={240} className="text-primary" /></div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
           <div className="max-w-4xl mx-auto text-center">
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight"
                dangerouslySetInnerHTML={{ __html: fctaTitle }}
              />
              
              <p className="text-xl md:text-2xl text-slate-800 mb-16 font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
                 {fctaDesc}
              </p>
              
              <div className="flex flex-col items-center">
                <div className="relative group/btn-container">
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover/btn-container:opacity-50 transition duration-1000 group-hover/btn-container:duration-200"></div>
                  <button 
                    onClick={() => onNavigate('pricing')}
                    className="relative px-14 py-6 bg-primary text-white font-bold rounded-2xl text-xl hover:bg-teal-800 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-teal-900/30 flex items-center justify-center gap-4 group/btn"
                  >
                     <Rocket size={26} className="group-hover/btn:translate-y-[-4px] group-hover/btn:translate-x-[2px] transition-transform duration-500" />
                     {fctaBtnText}
                  </button>
                </div>
              </div>
           </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cta-pulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.03); opacity: 0.9; }
          }
          .animate-cta-pulse { animation: cta-pulse 10s infinite ease-in-out; }
          .animate-cta-pulse-delayed { animation: cta-pulse 10s infinite ease-in-out -3s; }
        `}} />
      </section>
    </div>
  );
};

export default HowItWorks;
