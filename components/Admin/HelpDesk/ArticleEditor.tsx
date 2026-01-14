
import React, { useState, useRef, useEffect } from 'react';
import { HelpDeskArticle, HelpDeskCategory, HelpDeskTopic, MediaAttachment } from '../../../types';
import { 
  X, 
  Save, 
  ArrowLeft, 
  ImageIcon, 
  Type, 
  Sparkles, 
  AlertCircle, 
  Clock,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Code as CodeIcon,
  Eye,
  AlertTriangle,
  HelpCircle,
  Search
} from 'lucide-react';
import * as Icons from 'lucide-react';

interface ArticleEditorProps {
  article: HelpDeskArticle;
  categories: HelpDeskCategory[];
  topics: HelpDeskTopic[];
  onSave: (article: HelpDeskArticle) => void;
  onCancel: () => void;
  mediaItems: MediaAttachment[];
}

const DynamicIcon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
  const IconComponent = (Icons as any)[name] || Icons.FileText;
  return <IconComponent className={className} size={size} />;
};

const ArticleEditor: React.FC<ArticleEditorProps> = ({ 
  article, categories, topics, onSave, onCancel, mediaItems 
}) => {
  const [form, setForm] = useState<HelpDeskArticle>(article);
  const [showMedia, setShowMedia] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [lastRange, setLastRange] = useState<Range | null>(null);
  
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const isNew = !article.title;

  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest";

  // Simple HTML prettifier
  const prettifyHTML = (html: string) => {
    return html
      .replace(/<([^/][^>]*?)><\/([^>]+?)>/g, '<$1></$2>\n')
      .replace(/(<\/p>|<\/div>|<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/ul>|<\/ol>|<\/li>|<\/blockquote>)/g, '$1\n')
      .replace(/<(p|div|h1|h2|h3|h4|ul|ol|li|blockquote|img|hr)/g, '\n<$1')
      .replace(/\n\n+/g, '\n')
      .trim();
  };

  // Hàm generateSlug chuẩn để dùng khi auto-gen từ tiêu đề
  const generateSlug = (text: string) => {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleModeSwitch = (mode: 'visual' | 'code') => {
    if (mode === 'code') {
      const currentHTML = visualEditorRef.current?.innerHTML || form.content || '';
      setForm(prev => ({ ...prev, content: prettifyHTML(currentHTML) }));
    }
    setEditorMode(mode);
  };

  // Sync content when switching modes or initial load
  useEffect(() => {
    if (editorMode === 'visual' && visualEditorRef.current) {
      visualEditorRef.current.innerHTML = form.content || '<p><br></p>';
    }
  }, [editorMode, form.id]);

  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setLastRange(selection.getRangeAt(0));
    }
  };

  const handleVisualChange = () => {
    if (visualEditorRef.current) {
      setForm(prev => ({ ...prev, content: visualEditorRef.current?.innerHTML || '' }));
    }
  };

  const execFormatting = (command: string, value: string = '') => {
    if (editorMode !== 'visual') return;
    
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      if (lastRange) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(lastRange);
      }
    }
    
    document.execCommand(command, false, value);
    handleVisualChange();
    saveCursorPosition();
  };

  const insertImageAtCursor = (url: string, alt: string) => {
    const imgHtml = `<img src="${url}" alt="${alt}" style="max-width: 100%; border-radius: 12px; margin: 24px auto; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />`;
    
    if (editorMode === 'visual') {
      if (visualEditorRef.current) {
        visualEditorRef.current.focus();
        if (lastRange) {
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(lastRange);
          document.execCommand('insertHTML', false, imgHtml);
        } else {
          visualEditorRef.current.innerHTML += imgHtml;
        }
        handleVisualChange();
      }
    } else {
      setForm(prev => ({ ...prev, content: prev.content + `\n${imgHtml}\n` }));
    }
    setShowMedia(false);
  };

  const filteredTopics = topics.filter(t => String(t.categoryId) === String(form.category));

  const handleSaveArticle = () => {
    if (!form.id) {
       alert("Please provide an Article ID (Console Name)");
       return;
    }
    if (!form.title) {
       alert("Please provide a Title");
       return;
    }
    // Trước khi save, làm sạch slug lần cuối (xóa dấu gạch nối dư ở đầu/cuối)
    const finalForm = {
      ...form,
      slug: generateSlug(form.slug || form.title),
      updatedAt: new Date().toLocaleDateString()
    };
    onSave(finalForm);
  };

  return (
    <div className="fixed inset-0 z-[250] bg-white flex flex-col font-sans text-slate-900 animate-in slide-in-from-right duration-300">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 text-white">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <DynamicIcon name={form.icon} size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{form.title || 'Untitled Article'}</h2>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Help Desk Scoped Editor</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-100 transition-colors">Discard</button>
          <button 
            onClick={handleSaveArticle} 
            className="px-8 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-all shadow-lg shadow-primary/10"
          >
            Save Article
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        <main className="flex-1 overflow-y-auto p-12 bg-slate-50/50">
           <div className="max-w-4xl mx-auto space-y-8">
             <div className="space-y-4">
                <input 
                  className="w-full text-5xl font-serif font-bold bg-transparent outline-none border-b border-transparent focus:border-primary/20 pb-4 transition-all text-slate-900"
                  placeholder="Article Headline..."
                  value={form.title}
                  onChange={e => {
                    const newTitle = e.target.value;
                    const updates: any = { title: newTitle };
                    if (isNew) {
                      if (!form.id || form.id.includes('new_art')) updates.id = generateSlug(newTitle).replace(/-/g, '_');
                      if (!form.slug) updates.slug = generateSlug(newTitle);
                    }
                    setForm(prev => ({ ...prev, ...updates }));
                  }}
                />
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-bold text-slate-700">Permalink:</span>
                    <span>sproux.ai/help/</span>
                    <input 
                      className="bg-transparent border-b border-dashed border-slate-300 outline-none text-primary font-bold w-48"
                      value={form.slug}
                      onChange={e => {
                        // Chỉ cho phép chữ thường, số và dấu gạch nối. Không dùng generateSlug ở đây để tránh bị trim mất dấu gạch nối cuối cùng khi đang gõ.
                        const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                        setForm({...form, slug: sanitized});
                      }}
                      placeholder="url-slug"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-bold text-slate-700">Console ID:</span>
                    <input 
                      className="bg-white px-2 py-0.5 border border-slate-200 rounded outline-none text-slate-600 font-mono font-bold w-48 focus:border-primary"
                      value={form.id}
                      onChange={e => setForm({...form, id: e.target.value.replace(/[^a-zA-Z0-9_]/g, '')})}
                      placeholder="e.g. 1_getting_started"
                    />
                  </div>
                </div>
                {!isNew && article.id !== form.id && (
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-[10px] text-amber-700 font-bold uppercase tracking-tight animate-in fade-in">
                    <AlertTriangle size={14} />
                    Changing ID will rename the document on Firebase.
                  </div>
                )}
             </div>

             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-visible flex flex-col">
                <div className="sticky top-[-3rem] z-20 shadow-sm">
                  <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {editorMode === 'visual' ? (
                          <>
                            <select 
                              onChange={(e) => execFormatting('formatBlock', e.target.value)}
                              className="bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none mr-2 font-bold text-slate-700"
                              defaultValue="p"
                            >
                              <option value="p">Paragraph</option>
                              <option value="h1">Heading 1</option>
                              <option value="h2">Heading 2</option>
                              <option value="h3">Heading 3</option>
                            </select>
                            <ToolbarBtn icon={<Bold size={14}/>} onClick={() => execFormatting('bold')} title="Bold" />
                            <ToolbarBtn icon={<Italic size={14}/>} onClick={() => execFormatting('italic')} title="Italic" />
                            <ToolbarBtn icon={<Underline size={14}/>} onClick={() => execFormatting('underline')} title="Underline" />
                            <div className="w-px h-4 bg-slate-300 mx-1"></div>
                            <ToolbarBtn icon={<AlignLeft size={14}/>} onClick={() => execFormatting('justifyLeft')} title="Align Left" />
                            <ToolbarBtn icon={<AlignCenter size={14}/>} onClick={() => execFormatting('justifyCenter')} title="Align Center" />
                            <ToolbarBtn icon={<AlignRight size={14}/>} onClick={() => execFormatting('justifyRight')} title="Align Right" />
                            <div className="w-px h-4 bg-slate-300 mx-1"></div>
                            <ToolbarBtn icon={<List size={14}/>} onClick={() => execFormatting('insertUnorderedList')} title="Bullet List" />
                            <ToolbarBtn icon={<ListOrdered size={14}/>} onClick={() => execFormatting('insertOrderedList')} title="Numbered List" />
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Raw HTML Editor</div>
                            <button 
                              onClick={() => setForm(prev => ({ ...prev, content: prettifyHTML(prev.content) }))} 
                              className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-primary hover:bg-slate-50 transition-colors"
                            >
                              Prettify HTML
                            </button>
                          </div>
                        )}
                        <div className="w-px h-4 bg-slate-300 mx-1"></div>
                        <ToolbarBtn icon={<ImageIcon size={14}/>} onClick={() => setShowMedia(true)} title="Insert Image" />
                    </div>

                    <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden p-0.5">
                        <button 
                          onClick={() => handleModeSwitch('visual')}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${editorMode === 'visual' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          <Eye size={12}/> Visual
                        </button>
                        <button 
                          onClick={() => handleModeSwitch('code')}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${editorMode === 'code' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          <CodeIcon size={12}/> Code
                        </button>
                    </div>
                  </div>
                </div>
                
                <div className="relative bg-white text-slate-900 min-h-[600px]">
                  {editorMode === 'visual' ? (
                    <div 
                      ref={visualEditorRef}
                      contentEditable
                      onInput={handleVisualChange}
                      onBlur={saveCursorPosition}
                      onKeyUp={saveCursorPosition}
                      onClick={saveCursorPosition}
                      className="w-full h-full min-h-[600px] p-10 outline-none visual-editor-content selection:bg-teal-100"
                    />
                  ) : (
                    <textarea 
                      className="w-full h-[600px] p-8 outline-none font-mono text-sm bg-slate-900 text-teal-400 resize-none whitespace-pre-wrap"
                      placeholder="Enter raw HTML here..."
                      value={form.content}
                      onChange={e => setForm({...form, content: e.target.value})}
                    />
                  )}
                </div>
             </div>
           </div>
        </main>

        <aside className="w-80 border-l border-slate-200 p-8 space-y-8 overflow-y-auto bg-white">
           <section className="space-y-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Status & Visibility</h4>
              <SelectField label="Publication Status" value={form.status || 'draft'} onChange={(v:any) => setForm({...form, status: v})} options={[{v:'draft', l:'Draft'}, {v:'published', l:'Published'}]} />
              <div className="flex items-center gap-2 py-1">
                <input type="checkbox" checked={form.isCritical} onChange={e => setForm({...form, isCritical: e.target.checked})} className="rounded text-primary focus:ring-primary" id="critical" />
                <label htmlFor="critical" className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><AlertCircle size={12} className="text-red-500" /> Essential Reading</label>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> Est. Read Time (min)</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-primary shadow-sm" 
                  value={form.readingTime} 
                  onChange={e => setForm({...form, readingTime: parseInt(e.target.value) || 1})} 
                />
              </div>
           </section>

           <section className="space-y-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Categorization</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={labelClasses}>Article Icon</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                      <DynamicIcon name={form.icon || 'FileText'} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input 
                        className="w-full bg-transparent border-none text-xs font-bold text-slate-700 outline-none focus:ring-0 p-0"
                        value={form.icon}
                        onChange={e => setForm({...form, icon: e.target.value})}
                        placeholder="e.g. Zap, Rocket..."
                      />
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">Icon Name (Lucide)</p>
                    </div>
                  </div>
                </div>

                <SelectField label="Category" value={form.category} onChange={(v:any) => setForm({...form, category: v, audience: categories.find(c => String(c.id) === String(v))?.audience || form.audience})} options={categories.map(c => ({v:c.id, l:c.label}))} />
                <SelectField label="Topic" value={form.subcategory} onChange={(v:any) => setForm({...form, subcategory: v})} options={filteredTopics.map(t => ({v:t.id, l:t.label}))} />
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inferred Audience</div>
                   <div className="text-xs font-bold text-primary uppercase">{form.audience} Center</div>
                </div>
              </div>
           </section>

           <section className="space-y-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Search Optimization</h4>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO Title</label>
                <input 
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-primary shadow-sm" 
                  value={form.seoTitle} 
                  onChange={e => setForm({...form, seoTitle: e.target.value})} 
                  placeholder="Focus keyword here..." 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO Description</label>
                <textarea 
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-primary shadow-sm h-24 resize-none" 
                  value={form.seoDescription} 
                  onChange={e => setForm({...form, seoDescription: e.target.value})} 
                  placeholder="Appears in search results..." 
                />
              </div>
           </section>
        </aside>
      </div>

      {showMedia && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-8 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-4xl h-[600px] flex flex-col rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Select Media Attachment</h2>
                <button onClick={() => setShowMedia(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-4 md:grid-cols-6 gap-4">
                {mediaItems.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => insertImageAtCursor(item.url, item.title)}
                    className="aspect-square rounded-2xl overflow-hidden border border-slate-200 hover:border-primary transition-all group"
                  >
                    <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                  </button>
                ))}
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .visual-editor-content { 
          background-color: #ffffff; 
          color: #1e293b; 
          line-height: 1.7; 
          font-size: 1.125rem; 
        }
        .visual-editor-content p { 
          margin-bottom: 1.25rem; 
        }
        .visual-editor-content h1 { 
          font-family: 'Fraunces', serif; 
          font-size: 2.5rem; 
          font-weight: 800; 
          margin-top: 2.5rem; 
          margin-bottom: 1.5rem; 
          color: #0f172a; 
          line-height: 1.2;
        }
        .visual-editor-content h2 { 
          font-family: 'Fraunces', serif; 
          font-size: 2rem; 
          font-weight: 700; 
          margin-top: 2rem; 
          margin-bottom: 1.25rem; 
          color: #1e293b; 
          line-height: 1.3;
        }
        .visual-editor-content h3 { 
          font-family: 'Fraunces', serif; 
          font-size: 1.5rem; 
          font-weight: 600; 
          margin-top: 1.5rem; 
          margin-bottom: 1rem; 
          color: #334155; 
        }
        .visual-editor-content ul, .visual-editor-content ol { 
          margin-left: 1.5rem; 
          margin-bottom: 1.25rem; 
        }
        .visual-editor-content ul { list-style-type: disc; }
        .visual-editor-content ol { list-style-type: decimal; }
        .visual-editor-content li { margin-bottom: 0.5rem; }
        .visual-editor-content blockquote { 
          border-left: 4px solid #0f766e; 
          padding-left: 1.5rem; 
          font-style: italic; 
          color: #475569; 
          margin: 1.5rem 0; 
        }
      `}} />
    </div>
  );
};

const ToolbarBtn = ({ icon, onClick, title }: { icon: React.ReactNode, onClick: () => void, title?: string }) => (
  <button 
    onMouseDown={(e) => e.preventDefault()} 
    onClick={onClick}
    title={title}
    className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 transition-all"
  >
    {icon}
  </button>
);

const SelectField = ({ label, value, onChange, options }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <select 
      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-primary transition-all text-slate-700 shadow-sm"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select Option</option>
      {options.map((o:any) => <option key={String(o.v)} value={String(o.v)}>{o.l}</option>)}
    </select>
  </div>
);

export default ArticleEditor;
