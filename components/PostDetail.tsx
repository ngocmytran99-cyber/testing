
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
import { BlogPost } from '../types';

interface PostDetailProps {
  post: BlogPost | Partial<BlogPost>;
  onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
  const [activeTocId, setActiveTocId] = useState<string>('');

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
      const text = match[2].replace(/<[^>]*>/g, ''); // Loại bỏ các thẻ HTML bên trong tiêu đề
      const safeText = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      const id = `blog-heading-${index}-${safeText}`;
      items.push({ level, text, id });
      index++;
    }
    
    return items;
  }, [post.content]);

  // 2. Tự động gán ID vào nội dung HTML để các link neo (anchor) hoạt động
  const processedContent = useMemo(() => {
    if (!post || !post.content) return '';
    
    let html = post.content;
    let matchCount = 0;

    return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (match, level, attrs, content) => {
      const item = tocItems[matchCount];
      if (item) {
        matchCount++;
        return `<h${level}${attrs} id="${item.id}">${content}</h${level}>`;
      }
      return match;
    });
  }, [post.content, tocItems]);

  // 3. Scroll Spy: Theo dõi vị trí cuộn chuột để highlight Mục lục
  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Buffer cho fixed navbar

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

  // 4. Hàm cuộn mượt mà đến vị trí section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
          {/* CỘT CHÍNH: NỘI DUNG BÀI VIẾT */}
          <div className="flex-1 w-full lg:max-w-[850px]">
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                  Knowledge Base
                </span>
                {post.status === 'draft' && (
                  <span className="px-3 py-1 bg-amber/10 text-amber text-[10px] font-black uppercase tracking-widest rounded-full border border-amber/20 italic">
                    Preview Mode
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight mb-8">
                {post.title || 'Untitled Post'}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                    {post.author ? post.author.charAt(0) : 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{post.author || 'Anonymous'}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.publishedAt || 'Not published'}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> 6 min read</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                    <Share2 size={18} />
                  </button>
                  <button className="p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>
            </header>

            {post.coverImage && (
              <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 aspect-video relative">
                <img 
                  src={post.coverImage} 
                  className="w-full h-full object-cover" 
                  alt={post.title} 
                />
              </div>
            )}

            <div 
              className="visual-editor-content prose prose-slate max-w-none prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: processedContent || '<p>No content available.</p>' }}
            />

            <footer className="mt-20 pt-12 border-t border-slate-100">
              <div className="bg-slate-50 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-slate-100">
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-2xl font-serif font-bold text-slate-900 mb-3">Ready to scale your influence?</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Join SprouX today and transform your knowledge into market-ready digital products. No technical setup required.
                  </p>
                </div>
                <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-teal-800 transition-all">
                  Start Your Free Trial
                </button>
              </div>
            </footer>
          </div>

          {/* CỘT PHẢI: MỤC LỤC (TIMELINE RAIL STYLE) - Widened to w-96 */}
          <aside className="hidden lg:block w-96 sticky top-32 self-start space-y-8 pl-4">
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] mb-8">
                   <List size={14} className="text-primary" />
                   Table of Contents
                </div>
                
                <div className="relative">
                  {/* Vertical Rail Line */}
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-100"></div>
                  
                  <nav className="space-y-6 relative z-10">
                    {tocItems.length > 0 ? (
                      tocItems.map((item, idx) => (
                        <button 
                          key={idx}
                          onClick={() => scrollToSection(item.id)}
                          className="group flex items-start gap-4 w-full text-left transition-all duration-300"
                        >
                          {/* Indicator Node */}
                          <div className="mt-1 flex-shrink-0 relative">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 bg-white transition-all duration-300 ${
                              activeTocId === item.id 
                                ? 'border-primary scale-110 shadow-[0_0_10px_rgba(15,118,110,0.3)]' 
                                : 'border-slate-200 group-hover:border-slate-400'
                            }`}>
                               {activeTocId === item.id && (
                                 <div className="absolute inset-1 bg-primary rounded-full animate-pulse"></div>
                               )}
                            </div>
                          </div>
                          
                          {/* Text Label - Hierarchical sizing, same alignment */}
                          <span className={`leading-tight transition-all duration-300 ${
                            item.level === 2 
                              ? 'text-[14px] font-bold' 
                              : 'text-[12px] font-medium opacity-70'
                          } ${
                            activeTocId === item.id 
                              ? 'text-primary opacity-100' 
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}>
                            {item.text}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No sections found.</p>
                    )}
                  </nav>
                </div>
             </div>

             {/* Support Card / CTA in sidebar */}
             <div className="p-8 bg-[#f0fdfa] rounded-[2rem] border border-teal-100 shadow-sm">
                <h5 className="text-sm font-bold text-slate-900 mb-2">Need Help?</h5>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Our team is here to guide you through your journey.</p>
                <button className="w-full py-2 bg-white border border-teal-200 text-primary font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all">
                  Contact Support
                </button>
             </div>
          </aside>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .visual-editor-content { line-height: 1.8; font-size: 1.125rem; color: #334155; }
        .visual-editor-content h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1.5rem; margin-top: 3rem; color: #0f172a; line-height: 1.2; scroll-margin-top: 100px; }
        .visual-editor-content h2 { font-size: 1.875rem; font-weight: 700; margin-bottom: 1.25rem; margin-top: 2.5rem; color: #1e293b; line-height: 1.3; scroll-margin-top: 100px; }
        .visual-editor-content h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; margin-top: 2rem; color: #334155; scroll-margin-top: 100px; }
        .visual-editor-content p { margin-bottom: 1.5rem; text-align: justify; }
        .visual-editor-content blockquote { border-left: 4px solid #0f766e; padding-left: 1.5rem; font-style: italic; color: #475569; margin: 2rem 0; font-size: 1.25rem; }
        .visual-editor-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .visual-editor-content li { text-align: justify; }
        .visual-editor-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .visual-editor-content img { max-width: 100%; height: auto; border-radius: 1.5rem; margin: 3rem auto; display: block; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
        .visual-editor-content a { color: #0f766e; text-decoration: underline; font-weight: 600; }
      `}} />
    </div>
  );
};

export default PostDetail;
