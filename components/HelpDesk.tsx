
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
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={size} />;
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

  const pureSlug = useMemo(() => articleSlug?.split('#')[0] || null, [articleSlug]);
  const currentArticle = useMemo(() => pureSlug ? articles.find(a => a.slug === pureSlug) : null, [pureSlug, articles]);
  const view = useMemo(() => pureSlug ? 'article' : (topicId ? 'topic' : (categoryId ? 'category' : 'home')), [pureSlug, topicId, categoryId]);

  const tocItems = useMemo(() => {
    if (!currentArticle?.content) return [];
    const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
    const items: { level: number; text: string; id: string }[] = [];
    let match, index = 0;
    while ((match = headingRegex.exec(currentArticle.content)) !== null) {
      const text = match[2].replace(/<[^>]*>/g, '');
      const id = `hd-heading-${index++}`;
      items.push({ level: parseInt(match[1]), text, id });
    }
    return items;
  }, [currentArticle]);

  const processedContent = useMemo(() => {
    if (!currentArticle?.content) return '';
    let html = currentArticle.content;
    let matchCount = 0;
    return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (match, level, attrs, content) => {
      const item = tocItems[matchCount++];
      return item ? `<h${level}${attrs} id="${item.id}" class="scroll-mt-[130px]">${content}</h${level}>` : match;
    });
  }, [currentArticle, tocItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - 130, behavior: 'smooth' });
      window.history.replaceState(null, '', `#${location.pathname}#${id}`);
      setActiveTocId(id);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 selection:bg-teal-100">
      <main className="max-w-7xl mx-auto px-4">
        {view === 'home' && (
          <div className="text-center py-20">
            <h1 className="text-5xl font-serif font-bold mb-10">How can we help?</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.filter(c => c.audience === selectedAudience).map(cat => (
                <button key={cat.id} onClick={() => navigate(`/help/category/${cat.id}`)} className="p-8 border border-slate-100 rounded-[2rem] hover:shadow-xl transition-all text-left">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6"><DynamicIcon name={cat.icon} /></div>
                  <h3 className="text-xl font-bold mb-2">{cat.label}</h3>
                  <p className="text-sm text-slate-500">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'article' && currentArticle && (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <article className="flex-1 w-full lg:max-w-4xl bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-16">
              <h1 className="text-4xl md:text-5xl font-serif font-extrabold mb-8 leading-tight">{currentArticle.title}</h1>
              <div className="prose prose-teal prose-lg max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: processedContent }} />
            </article>

            <aside className="hidden lg:block w-96 sticky top-32">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] mb-8">
                  <List size={14} className="text-primary" /> Table of Contents
                </div>
                <nav className="space-y-4">
                  {tocItems.map((item, idx) => (
                    <button key={idx} onClick={() => scrollToSection(item.id)} className={`block text-left text-sm transition-all ${activeTocId === item.id ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default HelpDesk;
