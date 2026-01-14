
import React, { useState } from 'react';
import { ChevronDown, Menu, X, Rocket, Lightbulb, CheckCircle, BookOpen, FileText, Users, LifeBuoy, ShoppingCart, ShieldCheck, Zap, DollarSign, BatteryLow, UserCheck, Code, MoreHorizontal, LayoutDashboard, LogOut, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Fixed: import ViewType from the central types file
import { User, Category, ViewType } from '../types';

interface NavbarProps {
  onNavigate: (view: ViewType) => void;
  currentView: string;
  user: User | null;
  onLogout: () => void;
  logoUrl?: string;
  categories: Category[];
  onDynamicLink?: (path: string) => void;
  content?: Record<string, string>;
  metadata?: Record<string, any>;
}

const DefaultLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className} fill="currentColor">
    <path d="M239.3,92.5c-15.6,0-29.3,6.3-39.3,16.4l-30.7-30.7c17.5-17.5,41.7-28.3,68.4-28.3h61.3v82.7h-60.8l30.7,30.7c4.6-1,9.3-1.6,14.2-1.6 c31.8,0,57.7,25.8,57.7,57.7c0,31.8-25.8,57.7-57.7,57.7h-61.3v-82.7h60.8l-30.7-30.7c-4.6,1-9.3,1.6-14.2,1.6 c-31.8,0-57.7-25.8-57.7-57.7C181.6,118.3,207.5,92.5,239.3,92.5z" transform="translate(-70, -10)" />
    <path d="M195 130 L265 200 M265 130 L195 200" stroke="white" strokeWidth="35" strokeLinecap="square" transform="translate(-30, -15)" />
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, user, onLogout, logoUrl, categories, onDynamicLink, content, metadata }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLink = (v: ViewType) => {
    onNavigate(v);
    setIsOpen(false);
    setActiveDropdown(null);
  };

  // CMS Values for Navbar buttons
  const ctaText = content?.['nav-cta-text'] || 'Start free trial';
  const ctaLink = metadata?.['nav-cta-text']?.link || 'pricing';
  const loginText = content?.['nav-login-text'] || 'Login';
  const loginLink = metadata?.['nav-login-text']?.link || '/admin/login';
  const communityText = content?.['nav-community-text'] || 'Community';
  const communityLink = metadata?.['nav-community-text']?.link || '#';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <button 
            onClick={() => handleLink('home')}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="SprouX" className="h-9 w-auto object-contain" />
            ) : (
              <>
                <DefaultLogo className="w-10 h-10 text-primary" />
                <span className="font-serif text-2xl font-bold text-primary tracking-tight">SprouX</span>
              </>
            )}
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleLink('home')}
              className={`font-medium transition-colors ${currentView === 'home' || currentView === '/' ? 'text-primary' : 'text-slate-800 hover:text-primary'}`}
            >
              Home
            </button>
            
            <div className="relative group">
              <button 
                className={`flex items-center gap-1 font-medium hover:text-primary transition-colors ${currentView === 'how-it-works' ? 'text-primary' : 'text-slate-800'}`}
                onMouseEnter={() => setActiveDropdown('how-it-works')}
                onClick={() => handleLink('how-it-works')}
              >
                How It Works <ChevronDown size={16} />
              </button>
              {activeDropdown === 'how-it-works' && (
                <div 
                  className="absolute top-full left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-4 mt-2"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Our 4-Phase System</p>
                    <button onClick={() => handleLink('how-it-works')} className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors">
                      <div className="flex-shrink-0 transition-transform group-hover:scale-110"><Lightbulb size={18} className="text-amber" /></div>
                      <span className="text-slate-700 font-medium group-hover:text-primary text-sm">Idea Refinement</span>
                    </button>
                    <button onClick={() => handleLink('how-it-works')} className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors">
                      <div className="flex-shrink-0 transition-transform group-hover:scale-110"><CheckCircle size={18} className="text-success" /></div>
                      <span className="text-slate-700 font-medium group-hover:text-primary text-sm">Concept Validation</span>
                    </button>
                    <button onClick={() => handleLink('how-it-works')} className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors">
                      <div className="flex-shrink-0 transition-transform group-hover:scale-110"><ShoppingCart size={18} className="text-primary" /></div>
                      <span className="text-slate-700 font-medium group-hover:text-primary text-sm">Pre-sell Campaign</span>
                    </button>
                    <button onClick={() => handleLink('how-it-works')} className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors">
                      <div className="flex-shrink-0 transition-transform group-hover:scale-110"><ShieldCheck size={18} className="text-violet" /></div>
                      <span className="text-slate-700 font-medium group-hover:text-primary text-sm">Delivery & Fund Release</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => handleLink('pricing')}
              className={`font-medium transition-colors ${currentView === 'pricing' ? 'text-primary' : 'text-slate-800 hover:text-primary'}`}
            >
              Pricing
            </button>

            <div className="relative">
              <button 
                className={`flex items-center gap-1 font-medium hover:text-primary transition-colors ${currentView === 'blog' || currentView === 'help' ? 'text-primary' : 'text-slate-800'}`}
                onMouseEnter={() => setActiveDropdown('resources')}
              >
                Resources <ChevronDown size={16} />
              </button>
              {activeDropdown === 'resources' && (
                <div 
                  className="absolute top-full -left-48 w-[520px] bg-white border border-slate-200 rounded-xl shadow-xl p-6 mt-2 flex gap-8"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="flex-[1.2]">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Blog</h3>
                    <div className="space-y-1">
                       <div onClick={() => handleLink('blog')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors cursor-pointer">
                        < BookOpen size={18} className="text-primary" />
                        <span className="text-slate-700 font-medium group-hover:text-primary text-sm">View All Articles</span>
                      </div>
                      <div className="h-px bg-slate-100 my-2 mx-3"></div>
                      {categories.map((cat) => (
                        <div 
                          key={cat.id} 
                          onClick={() => handleLink(`blog/category/${cat.slug}`)} 
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors cursor-pointer"
                        >
                          <Hash size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                          <span className="text-slate-700 font-medium group-hover:text-primary text-sm">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Get Help</h3>
                    <div className="space-y-4">
                       <div 
                         onClick={() => onDynamicLink?.(communityLink)}
                         className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors cursor-pointer"
                       >
                        <Users size={18} className="text-primary" />
                        <span className="text-slate-700 font-medium group-hover:text-primary text-sm">{communityText}</span>
                      </div>
                      <div 
                        onClick={() => handleLink('help')}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors cursor-pointer"
                      >
                        <LifeBuoy size={18} className="text-primary" />
                        <span className="text-slate-700 font-medium group-hover:text-primary text-sm">Help Desk</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
               <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                    <button onClick={() => navigate('/admin')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">CMS Dashboard</button>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-2.5 rounded-full bg-slate-50 text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
               </div>
            ) : (
              <>
                <button 
                  onClick={() => onDynamicLink?.(loginLink)}
                  className="px-5 py-2 text-slate-800 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {loginText}
                </button>
                <button 
                  onClick={() => onDynamicLink?.(ctaLink)}
                  className="px-5 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-teal-800 transition-shadow shadow-md hover:shadow-lg"
                >
                  {ctaText}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-800">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 p-4 space-y-4 shadow-lg overflow-y-auto max-h-[80vh]">
          <button onClick={() => handleLink('home')} className="block w-full text-left text-lg font-medium text-slate-800">Home</button>
          <button onClick={() => handleLink('how-it-works')} className="block w-full text-left text-lg font-medium text-slate-800">How It Works</button>
          <button onClick={() => handleLink('pricing')} className="block w-full text-left text-lg font-medium text-slate-800">Pricing</button>
          <button onClick={() => handleLink('blog')} className="block w-full text-left text-lg font-medium text-slate-800">Blog</button>
          <button onClick={() => handleLink('help')} className="block w-full text-left text-lg font-medium text-slate-800">Help Desk</button>
          <div className="flex flex-col gap-2 pt-4">
            {user ? (
              <>
                <button onClick={() => { navigate('/admin'); setIsOpen(false); }} className="w-full py-3 text-center bg-slate-50 text-primary font-bold rounded-lg">CMS Dashboard</button>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full py-3 text-center bg-destructive/5 text-destructive font-bold rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { onDynamicLink?.(loginLink); setIsOpen(false); }} className="w-full py-3 text-center bg-slate-100 text-slate-800 font-bold rounded-lg block">{loginText}</button>
                <button onClick={() => { onDynamicLink?.(ctaLink); setIsOpen(false); }} className="w-full py-3 text-center bg-primary text-white font-bold rounded-lg block">{ctaText}</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
