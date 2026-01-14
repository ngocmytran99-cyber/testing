
import React from 'react';
import { ArrowRight, Play, CheckCircle, Sparkles, Cpu, TrendingUp } from 'lucide-react';
// Fixed: import ViewType from the central types file
import { ViewType } from '../types';

interface HeroProps {
  onNavigate?: (view: ViewType) => void;
  content?: Record<string, string>;
  metadata?: Record<string, any>;
  onDynamicLink?: (path: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate, content, metadata, onDynamicLink }) => {
  // Extract custom links for the two specific buttons
  const primaryCtaLink = metadata?.['hero-cta-primary']?.link || 'pricing';
  const secondaryCtaLink = metadata?.['hero-cta-secondary']?.link || 'how-it-works';

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-white">
      {/* --- Hệ thống Background Đa Tầng --- */}
      
      {/* 1. Base Mesh Gradients & Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-teal-100/30 rounded-full blur-[140px] animate-blob-slow"></div>
        <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-amber-50/40 rounded-full blur-[120px] animate-blob-slow animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[65%] h-[65%] bg-violet-50/20 rounded-full blur-[140px] animate-blob-slow animation-delay-4000"></div>
        
        {/* Điểm phát sáng trung tâm cho mầm xanh */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[150px] opacity-60"></div>
      </div>

      {/* 2. Hiệu ứng Chồi Non Vươn Lên & Bung Nở (Điều chỉnh cao hơn) */}
      <div className="absolute inset-x-0 bottom-20 md:bottom-32 top-0 z-0 pointer-events-none flex items-end justify-center overflow-hidden">
        <div className="relative w-full max-w-5xl h-[70%] flex justify-center items-end opacity-50">
           <svg className="w-full h-full" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sprout-grad" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#0F766E" stopOpacity="0" />
                  <stop offset="40%" stopColor="#0F766E" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2DD4BF" stopOpacity="1" />
                </linearGradient>
                <filter id="glow-sprout" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Thân cây chính - Bắt đầu cao hơn một chút trong viewBox */}
              <path 
                d="M200,550 C200,450 190,400 200,300 C210,200 200,100 200,30" 
                stroke="url(#sprout-grad)" 
                strokeWidth="5" 
                strokeLinecap="round" 
                className="animate-grow-stem"
                filter="url(#glow-sprout)"
              />

              {/* Tầng lá 1 (Dưới) */}
              <g className="animate-bloom-left-1 opacity-0">
                <path d="M198,400 C140,400 120,360 120,330 C120,290 170,310 198,360" fill="url(#sprout-grad)" fillOpacity="0.4" />
              </g>
              <g className="animate-bloom-right-1 opacity-0">
                <path d="M202,430 C260,430 280,390 280,360 C280,320 230,340 202,390" fill="url(#sprout-grad)" fillOpacity="0.4" />
              </g>

              {/* Tầng lá 2 (Giữa) */}
              <g className="animate-bloom-left-2 opacity-0">
                <path d="M198,270 C140,270 120,230 120,200 C120,160 170,180 198,230" fill="url(#sprout-grad)" fillOpacity="0.6" />
              </g>
              <g className="animate-bloom-right-2 opacity-0">
                <path d="M202,210 C260,210 280,170 280,140 C280,100 230,120 202,170" fill="url(#sprout-grad)" fillOpacity="0.6" />
              </g>

              {/* Mầm trên cùng - Bung nở */}
              <g className="animate-bloom-top-left opacity-0">
                <path d="M200,80 C180,70 160,40 180,10 C200,-10 210,30 200,80" fill="#2DD4BF" />
              </g>
              <g className="animate-bloom-top-right opacity-0">
                <path d="M200,80 C220,70 240,40 220,10 C200,-10 190,30 200,80" fill="#2DD4BF" />
              </g>

           </svg>
           {/* Hạt năng lượng */}
           <div className="absolute inset-0">
              {[...Array(40)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-teal-400 rounded-full blur-[1px] animate-particle-up"
                  style={{
                    left: `${40 + Math.random() * 20}%`,
                    bottom: `${10 + Math.random() * 30}%`,
                    animationDelay: `${Math.random() * 6}s`,
                    animationDuration: `${4 + Math.random() * 5}s`
                  }}
                ></div>
              ))}
           </div>
        </div>
      </div>

      {/* 3. Tech & Brand Motifs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[15%] right-[10%] opacity-20 animate-float">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border border-primary/40 rounded-full animate-ping"></div>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
               <path d="M30 30 L70 70 M70 30 L30 70" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="absolute top-[40%] left-[15%] opacity-10">
           <Cpu size={48} className="text-primary animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-teal-100 text-teal-800 text-sm font-bold mb-8 shadow-sm animate-fade-in-down">
          <TrendingUp size={14} className="text-primary animate-pulse" />
          <span className="tracking-tight tracking-widest uppercase text-[10px]">The Next-Gen Career Path for Creators</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-[1.1] mb-6">
          {content?.['hero-title'] ? <span dangerouslySetInnerHTML={{ __html: content['hero-title'] }} /> : <>Turn Your <span className="gradient-text">Knowledge</span> Into <br /> <span className="gradient-text">Financial Autonomy</span></>}
        </h1>
        
        <p className="max-w-4xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
          {content?.['hero-desc'] || "The AI-powered Launchpad for Creators. Transform your vague ideas into validated, campaign-ready digital products – in days."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up animation-delay-1000">
          <button 
            onClick={() => onDynamicLink ? onDynamicLink(primaryCtaLink) : onNavigate?.('pricing')}
            className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-teal-800 transition-all hover:scale-105 shadow-2xl shadow-teal-700/30 group"
          >
            {content?.['hero-cta-primary'] || "Launch Your First Product"}
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => onDynamicLink ? onDynamicLink(secondaryCtaLink) : onNavigate?.('how-it-works')}
            className="w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-md text-slate-800 font-bold rounded-2xl text-lg border border-slate-200 flex items-center justify-center gap-3 hover:bg-white transition-all shadow-md group"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={16} fill="currentColor" className="text-primary translate-x-0.5" />
            </div>
            {content?.['hero-cta-secondary'] || "See How It Works"}
          </button>
        </div>

        {/* Hero Dashboard Preview */}
        <div className="mt-20 md:mt-32 relative max-w-5xl mx-auto group animate-fade-in-up animation-delay-1500">
          <div className="aspect-[16/9] bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(15,118,110,0.25)] relative border border-white/60">
             <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-transparent to-amber-500/10"></div>
             
             <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col">
                <div className="h-14 w-full bg-white/80 border-b border-slate-200 flex items-center px-6 gap-3">
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                   </div>
                   <div className="flex-1 max-w-md mx-auto h-7 bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 animate-shimmer"></div>
                   </div>
                </div>
                
                <div className="flex-1 p-8 grid grid-cols-12 gap-8 text-left">
                   <div className="col-span-3 space-y-6">
                      <div className="h-5 w-3/4 bg-primary/20 rounded-full animate-pulse"></div>
                      <div className="space-y-3">
                         <div className="h-10 w-full bg-primary/10 rounded-xl border border-primary/10 flex items-center px-3 text-[10px] font-bold text-primary">PROJECT LAB</div>
                         <div className="h-10 w-full bg-slate-50/50 rounded-xl"></div>
                         <div className="h-10 w-full bg-slate-50/50 rounded-xl"></div>
                      </div>
                   </div>

                   <div className="col-span-9 flex flex-col gap-8">
                      <div className="flex justify-between items-center">
                         <div className="h-8 w-48 bg-slate-200/50 rounded-full"></div>
                         <div className="h-10 w-32 bg-success text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-lg shadow-success/20">
                            RUN ENGINE
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="aspect-square bg-white/60 border border-slate-100 rounded-3xl p-5 shadow-sm">
                              <div className="w-10 h-10 rounded-full bg-slate-100/50 mb-3"></div>
                              <div className="h-2 w-full bg-slate-200/50 rounded-full mb-2"></div>
                              <div className="h-2 w-2/3 bg-slate-100/50 rounded-full"></div>
                           </div>
                         ))}
                      </div>
                      
                      <div className="flex-1 bg-gradient-to-br from-slate-50/80 to-white/80 border border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                         <div className="absolute inset-x-0 top-0 h-0.5 bg-primary/20 animate-scan"></div>
                         <Sparkles className="text-primary/40 mb-3 animate-pulse" size={32} />
                         <div className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.3em]">Calibrating Market Readiness...</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute -top-12 -right-12 hidden lg:block w-56 p-5 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 animate-float z-20">
             <div className="flex items-center gap-3 mb-3 text-left">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                   <CheckCircle size={20} className="animate-pulse" />
                </div>
                <div>
                   <div className="text-sm font-bold text-slate-800">Confidence Score: 96%</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AI Analysis</div>
                </div>
             </div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-success w-[96%] animate-progress"></div>
             </div>
          </div>

          <div className="absolute -bottom-10 -left-12 hidden lg:block w-48 p-5 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 animate-float-delayed z-20">
             <div className="flex flex-col gap-2 text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Valuation</div>
                <div className="text-2xl font-serif font-bold text-primary">$24,500<span className="text-sm font-sans text-slate-400">/mo</span></div>
                <div className="h-10 flex items-end gap-1.5 px-1">
                   {[0.5, 0.8, 0.6, 0.9, 1.0].map((h, i) => (
                     <div 
                       key={i} 
                       className="flex-1 bg-primary/20 rounded-t-sm animate-grow-bar" 
                       style={{ '--final-height': `${h * 100}%`, animationDelay: `${i * 0.2}s` } as any}
                     ></div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob-slow {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes grow-stem {
          0% { stroke-dasharray: 0 1000; opacity: 0; transform: translateY(60px); }
          100% { stroke-dasharray: 1000 1000; opacity: 1; transform: translateY(0); }
        }
        .animate-grow-stem { 
          stroke-dasharray: 1000; 
          animation: grow-stem 3s cubic-bezier(0.19, 1, 0.22, 1) forwards; 
        }

        @keyframes bloom-left {
          0% { transform: scale(0) rotate(15deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(-5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes bloom-right {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .animate-bloom-left-1 { 
          transform-origin: 198px 360px;
          animation: bloom-left 1.2s 1.0s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
        }
        .animate-bloom-right-1 { 
          transform-origin: 202px 390px;
          animation: bloom-right 1.2s 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
        }
        .animate-bloom-left-2 { 
          transform-origin: 198px 230px;
          animation: bloom-left 1.2s 1.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
        }
        .animate-bloom-right-2 { 
          transform-origin: 202px 170px;
          animation: bloom-right 1.2s 1.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
        }

        @keyframes bloom-top-left {
          0% { transform: scale(0) rotate(20deg); opacity: 0; }
          100% { transform: scale(1) rotate(-10deg); opacity: 1; }
        }
        @keyframes bloom-top-right {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          100% { transform: scale(1) rotate(10deg); opacity: 1; }
        }
        .animate-bloom-top-left { 
          transform-origin: 200px 50px;
          animation: bloom-top-left 1.4s 2.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
        }
        .animate-bloom-top-right { 
          transform-origin: 200px 50px;
          animation: bloom-top-right 1.4s 2.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
        }

        @keyframes particle-up {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-500px) scale(0); opacity: 0; }
        }
        .animate-particle-up { animation: particle-up linear infinite; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-3deg); }
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes progress {
          from { width: 0; }
          to { width: 96%; }
        }
        @keyframes grow-bar {
          0% { height: 0; opacity: 0; }
          100% { height: var(--final-height); opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-blob-slow { animation: blob-slow 20s infinite alternate cubic-bezier(0.45, 0, 0.55, 1); }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }

        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 12s ease-in-out infinite; }
        .animate-scan { animation: scan 4s linear infinite; }
        .animate-shimmer { animation: shimmer 2.5s infinite linear; }
        .animate-progress { animation: progress 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-grow-bar { opacity: 0; animation: grow-bar 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { opacity: 0; animation: fade-in-up 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-fade-in-down { opacity: 0; animation: fade-in-down 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}} />
    </section>
  );
};

export default Hero;
