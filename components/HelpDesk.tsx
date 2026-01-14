
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  ChevronRight, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  ArrowLeft, 
  Home, 
  FileText, 
  LayoutGrid,
  ChevronLeft,
  MessageCircle,
  LifeBuoy,
  Users,
  HelpCircle,
  TrendingUp,
  List
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Article, CategoryMetadata, SubcategoryMetadata, AudienceType, HelpDeskCategory, HelpDeskTopic, HelpDeskArticle, PageData } from '../types';

interface HelpDeskProps {
  categories: HelpDeskCategory[];
  topics: HelpDeskTopic[];
  articles: HelpDeskArticle[];
  page?: PageData;
}

const DynamicIcon = ({ name, className, size = 24 }: { name: string; className?: string; size?: number }) => {
  if (!name) return <HelpCircle className={className} size={size} />;
  
  const IconComponent = (Icons as any)[name];
  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }
  
  return (
    <span 
      className={`material-symbols-outlined ${className}`} 
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
};

const HelpDesk: React.FC<HelpDeskProps> = ({ categories, topics, articles, page }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId, topicId, articleSlug } = useParams();
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('creator');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Content from CMS
  const cmsHeroTitle = page?.blocks.find(b => b.id === 'help-hero-title')?.value || 'How can we help?';
  const cmsSearchPlaceholder = page?.blocks.find(b => b.id === 'help-search-placeholder')?.value || 'Search help articles, eg. "billing", "getting started", "how to verify"';
  const cmsContactTitle = page?.blocks.find(b => b.id === 'help-contact-title')?.value || 'Still need help?';
  const cmsContactDesc = page?.blocks.find(b => b.id === 'help-contact-desc')?.value || 'Our support team is here to help you navigate your creator journey.';
  
  const chatBtnBlock = page?.blocks.find(b => b.id === 'help-contact-chat');
  const emailBtnBlock = page?.blocks.find(b => b.id === 'help-contact-email');

  const cmsTopSearchesRaw = page?.blocks.find(b => b.id === 'help-top-searches')?.value || "billing, getting started, how to verify, escrow, payouts";
  const topSearches = useMemo(() => 
    cmsTopSearchesRaw.split(',').map(s => s.trim()).filter(s => s !== "")
  , [cmsTopSearchesRaw]);

  // CRITICAL: Split slug to remove anchor if exists in HashRouter context
  const pureSlug = useMemo(() => {
    if (!articleSlug) return null;
    return articleSlug.split('#')[0];
  }, [articleSlug]);

  const handleDynamicLink = (path: string) => {
    if (!path) return;
    if (path.startsWith('mailto:') || path.startsWith('tel:') || path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      navigate(cleanPath === '/home' ? '/' : cleanPath);
    }
  };

  const PREDEFINED_ORDER: Record<string, number> = {
    'Start as a Creator': 1,
    'Launch & Run Your Campaign': 2,
    'Deliver & Get Paid': 3,
    'Trust & Disputes': 4,
    'Account & Access': 5
  };

  const currentCategory = useMemo(() => 
    categoryId ? categories.find(c => c.id === categoryId) : null
  , [categoryId, categories]);
  
  const currentTopic = useMemo(() => 
    topicId ? topics.find(t => t.id === topicId) : null
  , [topicId, topics]);

  const currentArticle = useMemo(() => 
    pureSlug ? articles.find(a => a.slug === pureSlug) : null
  , [pureSlug, articles]);

  const view = useMemo(() => {
    if (pureSlug) return 'article';
    if (topicId) return 'topic';
    if (categoryId) return 'category';
    return 'home';
  }, [pureSlug, topicId, categoryId]);

  // Enhanced Table of Contents logic with unique IDs
  const tocItems = useMemo(() => {
    if (!currentArticle || !currentArticle.content) return [];
    
    const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
    const items: { level: number; text: string; id: string }[] = [];
    let match;
    let index = 0;
    
    while ((match = headingRegex.exec(currentArticle.content)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, '');
      const safeText = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      const id = `toc-item-${index}-${safeText}`;
      items.push({ level, text, id });
      index++;
    }
    
    return items;
  }, [currentArticle]);

  // Safe chèn ID vào tiêu đề mà không phá vỡ HTML
  const processedContent = useMemo(() => {
    if (!currentArticle || !currentArticle.content) return '';
    
    let html = currentArticle.content;
    let matchCount = 0;

    return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (match, level, attrs, content) => {
      const item = tocItems[matchCount];
      if (item) {
        matchCount++;
        // Thêm class scroll-mt để khi nhảy đến section không bị Header che mất
        return `<h${level}${attrs} id="${item.id}" class="scroll-mt-[130px]">${content}</h${level}>`;
      }
      return match;
    });
  }, [currentArticle, tocItems]);

  const filteredCategories = useMemo(() => {
    return categories
      .filter(c => c.audience === selectedAudience)
      .sort((a, b) => {
        const orderA = a.order ?? PREDEFINED_ORDER[a.label] ?? 99;
        const orderB = b.order ?? PREDEFINED_ORDER[b.label] ?? 99;
        return orderA - orderB;
      });
  }, [categories, selectedAudience]);
  
  const filteredTopics = useMemo(() => 
    topics.filter(t => t.categoryId === currentCategory?.id)
  , [currentCategory, topics]);

  const filteredArticles = useMemo(() => 
    articles.filter(a => a.subcategory === currentTopic?.id)
  , [currentTopic, articles]);

  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return articles.filter(a => 
      (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery, articles]);

  useEffect(() => {
    if (currentCategory) setSelectedAudience(currentCategory.audience);
    else if (currentTopic) {
      const parent = categories.find(c => c.id === currentTopic.categoryId);
      if (parent) setSelectedAudience(parent.audience);
    } else if (currentArticle) {
      setSelectedAudience(currentArticle.audience);
    }
  }, [currentCategory, currentTopic, currentArticle, categories]);

  // Scroll spy effect to highlight active TOC item
  useEffect(() => {
    if (view !== 'article' || tocItems.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      let currentId = '';
      for (const item of tocItems) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentId = item.id;
        } else {
          break;
        }
      }
      setActiveTocId(currentId || (tocItems.length > 0 ? tocItems[0].id : ''));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view, tocItems]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setShowSuggestions(true);
    const input = document.getElementById('help-search-input');
    input?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 130; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveTocId(id);

      // Cập nhật URL một cách an toàn mà không kích hoạt Router reload
      window.history.replaceState(null, '', `#${location.pathname}#${id}`);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Hero Section */}
      <section className="bg-[#f0fdfa] border-b border-teal-50 pt-32 pb-16 px-4 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-10 leading-tight">
            {cmsHeroTitle}
          </h1>
          
          <div className="relative max-w-2xl mx-auto z-[60]" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative group">
              <input 
                id="help-search-input"
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={cmsSearchPlaceholder} 
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 shadow-xl shadow-gray-200/50 text-lg transition-all placeholder:text-slate-400"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-teal-600 transition-colors" />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[70] text-left">
                {suggestions.length > 0 ? (
                  <div>
                    {suggestions.map(s => (
                      <button 
                        key={s.id}
                        onClick={() => {
                          navigate(`/help/article/${s.slug}`);
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left"
                      >
                        <FileText className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <div>
                          <span className="text-slate-800 font-bold text-sm block">{s.title}</span>
                          <span className="text-slate-400 text-xs block truncate max-w-md">{s.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-slate-400 text-center italic">
                    No results found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}

            {/* Top Search Tags */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-700">
               <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest mr-2">
                  <TrendingUp size={14} className="text-teal-500" />
                  Top Search:
               </div>
               {topSearches.map(tag => (
                 <button 
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:border-teal-500 hover:text-teal-600 hover:shadow-md transition-all active:scale-95"
                 >
                   {tag}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12 relative z-0">
        
        {/* VIEW: HOME */}
        {view === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex justify-center mb-16">
              <div className="bg-[#f0fdfa] border border-teal-100 p-2 rounded-2xl flex items-center shadow-sm">
                <button 
                  onClick={() => setSelectedAudience('creator')}
                  className={`w-40 md:w-56 py-4 rounded-xl text-base md:text-lg font-bold transition-all ${selectedAudience === 'creator' ? 'bg-white text-teal-700 shadow-md' : 'text-slate-500 hover:text-teal-600'}`}
                >
                  For Creators
                </button>
                <button 
                  onClick={() => setSelectedAudience('backer')}
                  className={`w-40 md:w-56 py-4 rounded-xl text-base md:text-lg font-bold transition-all ${selectedAudience === 'backer' ? 'bg-white text-teal-700 shadow-md' : 'text-slate-500 hover:text-teal-600'}`}
                >
                  For Backers
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-10">
              <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Select a category</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map(cat => (
                <HierarchyCard 
                  key={cat.id}
                  label={cat.label}
                  description={cat.description}
                  icon={cat.icon}
                  count={topics.filter(t => t.categoryId === cat.id).length}
                  unit="Topic"
                  onClick={() => navigate(`/help/category/${cat.id}`)}
                />
              ))}
            </div>

            {/* Popular Articles */}
            <div className="mt-24 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-10">
                <LayoutGrid className="w-6 h-6 text-teal-600" />
                <h2 className="text-3xl font-bold text-slate-900">Popular articles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.slice(0, 4).map(article => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onClick={() => navigate(`/help/article/${article.slug}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CATEGORY */}
        {view === 'category' && currentCategory && (
          <div className="animate-in fade-in slide-in-from-right-6 duration-500">
             <button onClick={() => navigate('/help')} className="flex items-center gap-2 text-teal-600 font-bold mb-10 hover:translate-x-[-4px] transition-transform">
                <ArrowLeft size={18} /> Back to Help Home
             </button>
             <div className="flex items-center gap-3 mb-10">
                <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">{currentCategory.label}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.map(topic => (
                  <HierarchyCard 
                    key={topic.id}
                    label={topic.label}
                    description={topic.description}
                    icon={topic.icon}
                    count={articles.filter(a => a.subcategory === topic.id).length}
                    unit="Article"
                    onClick={() => navigate(`/help/topic/${topic.id}`)}
                  />
                ))}
              </div>
          </div>
        )}

        {/* VIEW: TOPIC */}
        {view === 'topic' && currentTopic && (
          <div className="animate-in fade-in slide-in-from-right-6 duration-500">
             <button 
                onClick={() => navigate(`/help/category/${currentTopic.categoryId}`)} 
                className="flex items-center gap-2 text-teal-600 font-bold mb-10 hover:translate-x-[-4px] transition-transform"
             >
                <ArrowLeft size={18} /> Back to Category
             </button>
             <div className="flex items-center gap-3 mb-10">
                <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">{currentTopic.label}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onClick={() => navigate(`/help/article/${article.slug}`)}
                  />
                ))}
              </div>
          </div>
        )}

        {/* VIEW: ARTICLE DETAIL */}
        {view === 'article' && currentArticle && (
          <div className="animate-in fade-in duration-500">
            <nav className="flex items-center text-sm text-slate-400 mb-8 font-medium">
              <button onClick={() => navigate('/help')} className="hover:text-teal-600 transition-colors flex items-center gap-1.5">
                <Home size={14} /> Help Home
              </button>
              <ChevronRight size={14} className="mx-3 opacity-30" />
              <button onClick={() => navigate(`/help/topic/${currentArticle.subcategory}`)} className="hover:text-teal-600 transition-colors">
                {topics.find(t => t.id === currentArticle.subcategory)?.label}
              </button>
              <ChevronRight size={14} className="mx-3 opacity-30" />
              <span className="text-slate-900 truncate">{currentArticle.title}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12 items-start relative">
              {/* Main Column */}
              <div className="flex-1 w-full lg:max-w-4xl">
                <article className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden ring-1 ring-slate-100">
                  <div className="p-8 md:p-14 lg:p-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                          <DynamicIcon name={currentArticle.icon} size={28} />
                        </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900 mb-6 leading-tight">
                      {currentArticle.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-12 pb-8 border-b border-slate-50">
                        <div className="flex items-center gap-2 font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full"><Clock size={14} /><span>{currentArticle.readingTime} min read</span></div>
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                        <span className="font-medium">Updated {currentArticle.updatedAt}</span>
                    </div>

                    <div 
                      className="prose prose-teal prose-lg max-w-none text-slate-700 leading-relaxed font-normal help-article-content"
                      dangerouslySetInnerHTML={{ __html: processedContent }}
                    />
                  </div>

                  <div className="bg-slate-50 border-t border-slate-100 p-12 text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 font-serif">Was this article helpful?</h3>
                    <div className="flex justify-center gap-4">
                      <button className="flex items-center gap-3 px-12 py-4 bg-white border border-slate-200 rounded-full text-slate-700 font-bold hover:border-teal-500 hover:text-teal-600 transition-all shadow-md active:scale-95">
                        <ThumbsUp size={18} /> Yes
                      </button>
                      <button className="flex items-center gap-3 px-12 py-4 bg-white border border-slate-200 rounded-full text-slate-700 font-bold hover:border-red-400 hover:text-red-500 transition-all shadow-md active:scale-95">
                        <ThumbsDown size={18} /> No
                      </button>
                    </div>
                  </div>
                </article>
              </div>

              {/* Sidebar Column - Table of Contents */}
              <aside className="hidden lg:block w-96 sticky top-32 self-start space-y-8 pl-4">
                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden ring-1 ring-slate-100">
                    <div className="absolute top-0 left-0 w-2 h-full bg-teal-600/10"></div>
                    <div className="flex items-center gap-3 text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-8">
                       <List size={16} className="text-teal-600" />
                       Table of Contents
                    </div>
                    <nav className="space-y-4">
                      {tocItems.length > 0 ? (
                        tocItems.map((item, idx) => (
                          <button 
                            key={idx}
                            onClick={() => scrollToSection(item.id)}
                            className={`block text-left transition-all hover:text-teal-600 relative group/toc w-full ${
                              item.level === 3 
                                ? 'pl-8 text-slate-400 text-[13px] font-medium' 
                                : 'text-slate-700 text-[15px] font-bold'
                            }`}
                          >
                            <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-500 scale-0 group-hover/toc:scale-100 transition-transform ${item.level === 3 ? 'left-4' : 'left-0'}`}></span>
                            {item.text}
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No sections found in this article.</p>
                      )}
                    </nav>
                 </div>
              </aside>
            </div>
          </div>
        )}

        {/* Global Contact CTA */}
        {(view === 'home' || view === 'category') && (
           <div className="mt-32 max-w-5xl mx-auto pb-20">
              <div className="bg-primary rounded-[3rem] p-16 md:p-20 text-center text-white relative overflow-hidden shadow-2xl group">
                <div className="absolute top-[-10%] right-[-10%] opacity-10 text-white transform rotate-12 transition-transform duration-1000 group-hover:rotate-0">
                  <LifeBuoy size={400} />
                </div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">{cmsContactTitle}</h2>
                  <p className="text-teal-50/80 mb-12 text-xl leading-relaxed max-w-2xl mx-auto">{cmsContactDesc}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <button 
                      onClick={() => handleDynamicLink(chatBtnBlock?.metadata?.link || '#')}
                      className="flex-1 py-4 bg-white text-primary font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                    >
                      <MessageCircle size={22} /> {chatBtnBlock?.value || 'Chat with us'}
                    </button>
                    <button 
                      onClick={() => handleDynamicLink(emailBtnBlock?.metadata?.link || 'mailto:support@sproux.ai')}
                      className="flex-1 py-4 bg-[#0a524c] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-[#08453f] transition-all shadow-lg"
                    >
                      <LifeBuoy size={22} /> {emailBtnBlock?.value || 'Email Support'}
                    </button>
                  </div>
                </div>
              </div>
           </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .help-article-content h2 { font-family: 'Fraunces', serif; color: #0f172a; font-weight: 800; margin-top: 3.5rem; margin-bottom: 1.5rem; font-size: 2.25rem; position: relative; scroll-margin-top: 130px; }
        .help-article-content h3 { font-family: 'Fraunces', serif; color: #1e293b; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; font-size: 1.75rem; scroll-margin-top: 130px; }
        .help-article-content p { margin-bottom: 1.5rem; font-size: 1.125rem; line-height: 1.8; color: #334155; text-align: justify; }
        .help-article-content ul { list-style-type: disc; padding-left: 1.75rem; margin-bottom: 1.75rem; }
        .help-article-content li { margin-bottom: 0.75rem; font-size: 1.125rem; text-align: justify; }
        .help-article-content blockquote { border-left: 4px solid #0f766e; padding-left: 1.5rem; font-style: italic; color: #475569; margin: 2rem 0; font-size: 1.25rem; background: #f0fdfa; padding-top: 1.5rem; padding-bottom: 1.5rem; border-radius: 0 1rem 1rem 0; }
      `}} />
    </div>
  );
};

// --- SUBCOMPONENTS ---

const HierarchyCard: React.FC<any> = ({ label, description, icon, onClick, count, unit = 'Topic' }) => (
  <button 
    onClick={onClick}
    className="group text-left bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-teal-500 hover:shadow-2xl transition-all duration-300 flex flex-col h-full shadow-sm"
  >
    <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center mb-6 transition-all transform group-hover:-translate-y-1 shadow-inner">
      <DynamicIcon name={icon} size={28} />
    </div>
    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors leading-tight">{label}</h3>
    <p className="text-slate-500 text-[15px] leading-relaxed mb-6 flex-grow">{description}</p>
    <div className="flex items-center justify-between pt-6 border-t border-slate-50 w-full mt-auto">
      <span className="text-xs font-black text-teal-600 uppercase tracking-[0.2em]">
        {count} {count === 1 ? unit : unit + 's'}
      </span>
      <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center text-slate-300 group-hover:text-teal-600 transition-all">
        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  </button>
);

const ArticleCard: React.FC<{ article: any; onClick: () => void }> = ({ article, onClick }) => (
  <button 
    onClick={onClick}
    className="group text-left block bg-white rounded-3xl border border-slate-100 p-8 hover:border-teal-500 hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
  >
    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center mb-6 transition-all">
      <DynamicIcon name={article.icon} size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">{article.title}</h3>
    <p className="text-[14px] text-slate-500 mb-6 line-clamp-3 leading-relaxed flex-grow">{article.description}</p>
    <div className="flex items-center justify-between pt-6 border-t border-slate-100 w-full mt-auto">
      <span className="text-xs font-black text-teal-600 uppercase tracking-widest">{article.readingTime} min read</span>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
    </div>
  </button>
);

export default HelpDesk;
