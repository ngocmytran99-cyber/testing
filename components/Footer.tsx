
import React from 'react';
import { ShieldCheck, Facebook, Instagram, Youtube, Mail } from 'lucide-react';
// Fixed: import ViewType from the central types file
import { ViewType, GlobalSettings } from '../types';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
  settings?: GlobalSettings;
}

const DefaultLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className} fill="currentColor">
    <path d="M239.3,92.5c-15.6,0-29.3,6.3-39.3,16.4l-30.7-30.7c17.5-17.5,41.7-28.3,68.4-28.3h61.3v82.7h-60.8l30.7,30.7c4.6-1,9.3-1.6,14.2-1.6 c31.8,0,57.7,25.8,57.7,57.7c0,31.8-25.8,57.7-57.7,57.7h-61.3v-82.7h60.8l-30.7-30.7c-4.6,1-9.3,1.6-14.2,1.6 c-31.8,0-57.7-25.8-57.7-57.7C181.6,118.3,207.5,92.5,239.3,92.5z" transform="translate(-70, -10)" />
    <path d="M195 130 L265 200 M265 130 L195 200" stroke="white" strokeWidth="35" strokeLinecap="square" transform="translate(-30, -15)" />
  </svg>
);

const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  const logoUrl = settings?.footerLogo;

  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
             <button onClick={() => onNavigate('home')} className="flex items-center gap-1 mb-6 hover:opacity-80 transition-opacity text-left">
                {logoUrl ? (
                  <img src={logoUrl} alt="SprouX" className="h-10 w-auto object-contain" />
                ) : (
                  <>
                    <DefaultLogo className="w-10 h-10 text-primary" />
                    <span className="font-serif text-2xl font-bold text-white tracking-tight">SprouX</span>
                  </>
                )}
             </button>
             <p className="text-slate-500 max-w-xs mb-8">
                The AI-powered Launchpad for Creators. Transform your knowledge into validated digital assets.
             </p>
             <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                    <a 
                      href="https://www.facebook.com/sproux" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Facebook size={18} />
                      <span className="sr-only">Facebook</span>
                    </a>
                    <a 
                      href="https://www.instagram.com/sproux.ai/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Instagram size={18} />
                      <span className="sr-only">Instagram</span>
                    </a>
                    <a 
                      href="https://www.youtube.com/channel/UCD9LQDyq2FF2UGgAu240gOw" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Youtube size={18} />
                      <span className="sr-only">YouTube</span>
                    </a>
                    <a 
                      href="mailto:support@sproux.ai" 
                      className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Mail size={18} />
                      <span className="sr-only">Email</span>
                    </a>
                </div>
             </div>
          </div>

          <div>
             <h4 className="text-white font-bold mb-6">Product</h4>
             <ul className="space-y-4 text-sm">
                <li><button onClick={() => onNavigate('how-it-works')} className="hover:text-primary transition-colors">How It Works</button></li>
                <li><button onClick={() => onNavigate('pricing')} className="hover:text-primary transition-colors">Pricing</button></li>
             </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-6">Resources</h4>
             <ul className="space-y-4 text-sm">
                <li><button onClick={() => onNavigate('blog')} className="hover:text-primary transition-colors">Blog</button></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <li><button onClick={() => onNavigate('help')} className="hover:text-primary transition-colors">Help Desk</button></li>
             </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-6">Company</h4>
             <ul className="space-y-4 text-sm">
                <li><button onClick={() => onNavigate('about')} className="hover:text-primary transition-colors">About SprouX</button></li>
             </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
           <div className="flex flex-col md:flex-row items-center gap-4">
              <p>© 2026 SprouX. All rights reserved.</p>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('admin');
                }}
                className="flex items-center gap-1.5 opacity-0 hover:opacity-100 transition-all duration-500 text-slate-500 hover:text-primary py-1 px-2 rounded hover:bg-white/5 cursor-default"
              >
                <ShieldCheck size={14} className="text-slate-500" />
                <span>Admin Access</span>
              </button>
           </div>
           <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-bold">
              <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms of Service</button>
              <a href="mailto:support@sproux.ai" className="hover:text-white transition-colors">Contact</a>
              <button onClick={() => onNavigate('disclaimer')} className="hover:text-white transition-colors">Disclaimer</button>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
