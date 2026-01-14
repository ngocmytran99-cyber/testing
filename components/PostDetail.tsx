
import React, { useEffect, useMemo, useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Bookmark, 
  List, 
  ChevronRight,
  Home
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BlogPost } from '../types';

interface PostDetailProps {
  post: BlogPost | Partial<BlogPost>;
  onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
  const [activeTocId, setActiveTocId] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. Logic trích xuất các tiêu đề H2, H3 để tạo Mục lục
  const tocItems = useMemo(() => {
    if (!post || !post.content) return [];
    
    const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
    const items: { level: number; text: string; id: string }[] = [];
    let match;
    let index = 0;
    
    while ((match = headingRegex.exec(post.content)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, ''); 
      const safeText = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      const id = `heading-${index}-${safeText}`;
      items.push({ level, text, id });
      index++;
    }
    
    return items;
  }, [post.content]);

  // 2. Tự động gán ID vào nội dung HTML
  const processedContent = useMemo(() => {
    if (!post || !post.content) return '';
    
    let html = post.content;
    let matchCount = 0;

    return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (match, level, attrs, content) => {
      const item = tocItems[matchCount];
      if (item) {
        matchCount++;
        return `<h${level}${attrs} id="${item.id}" class="scroll-mt-[120px]">${content}</h${level}>`;
      }
      return match;
    });
  }, [post.content, tocItems]);

  // 3. Scroll Spy
  useEffect(() => {
    if (tocItems.length === 0) return;

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
  }, [tocItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; 
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL safely for HashRouter
      window.history.replaceState(null, '', `#${location.pathname}#${id}`);
      setActiveTocId(id);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm mb-12 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </button>

        <div className="flex flex-col lg:flex-row gap-16 items-start relative">
          <div className="flex-1 w-full lg:max-w-[850px]">
            <header className="mb-12">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight mb-8">
                {post.title || 'Untitled Post'}
              </h1>
              <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                    {post.author?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{post.author || 'Anonymous'}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span>{post.publishedAt}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> 6 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div 
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>

          <aside className="hidden lg:block w-96 sticky top-32 self-start space-y-8 pl-4">
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden ring-1 ring-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] mb-8">
                   <List size={14} className="text-primary" />
                   Table of Contents
                </div>
                <div className="relative">
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-100"></div>
                  <nav className="space-y-5 relative z-10">
                    {tocItems.map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => scrollToSection(item.id)}
                        className="group flex items-start gap-4 w-full text-left transition-all"
                      >
                        <div className={`mt-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white transition-all ${
                          activeTocId === item.id ? 'border-primary scale-110' : 'border-slate-200'
                        }`}>
                           {activeTocId === item.id && <div className="absolute inset-1 bg-primary rounded-full"></div>}
                        </div>
                        <span className={`text-sm transition-all ${
                          activeTocId === item.id ? 'text-primary font-bold' : 'text-slate-400 group-hover:text-slate-600'
                        } ${item.level === 3 ? 'pl-4 text-xs' : ''}`}>
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
