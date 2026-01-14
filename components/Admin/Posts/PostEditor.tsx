
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ImageIcon, 
  Sparkles, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Quote, 
  Link as LinkIcon, 
  Unlink, 
  RemoveFormatting,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  HelpCircle,
  Key,
  Calendar,
  BarChart2,
  Settings,
  Briefcase,
  Monitor,
  Smartphone,
  Check,
  AlertCircle,
  Type as TypeIcon,
  Loader2,
  Code as CodeIcon
} from 'lucide-react';
import { BlogPost, Category, SEOData, ContentStatus } from '../../../types';

interface PostEditorProps {
  editingPost: Partial<BlogPost>;
  setEditingPost: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
  categories: Category[];
  onSave: (data: Partial<BlogPost>, shouldClose?: boolean) => Promise<void>;
  openMediaLibrary: (purpose: 'content' | 'cover') => void;
  setHasUnsavedChanges: (has: boolean) => void;
  onPreview?: (post: Partial<BlogPost>) => void;
}

const Metabox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-slate-300 shadow-sm mb-5 rounded-sm">
    <div className="p-2.5 px-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
      <h3 className="text-[13px] font-bold text-slate-700">{title}</h3>
      <ChevronUp size={14} className="text-slate-400" />
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const POWER_WORDS = ['tuyệt vời', 'bí mật', 'hướng dẫn', 'hiệu quả', 'tối ưu', 'nhanh chóng', 'thành công', 'miễn phí', 'độc quyền', 'mới nhất', 'đột phá', 'uy tín', 'chuyên gia'];
const SENTIMENT_WORDS = ['yêu', 'thích', 'ghét', 'lo lắng', 'sợ', 'vui', 'buồn', 'kinh ngạc', 'hào hứng', 'thất vọng', 'hạnh phúc', 'cảnh báo', 'nguy hiểm'];

const PostEditor: React.FC<PostEditorProps> = ({ 
  editingPost, setEditingPost, onSave, openMediaLibrary, setHasUnsavedChanges, categories, onPreview 
}) => {
  const [editorTab, setEditorTab] = useState<'visual' | 'code'>('visual');
  const [seoTab, setSeoTab] = useState<'general' | 'advanced' | 'schema' | 'social'>('general');
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [tempSlug, setTempSlug] = useState(editingPost.slug || '');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [expandedSeo, setExpandedSeo] = useState<string[]>(['basic', 'additional', 'title', 'content']);
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
  const [snippetDevice, setSnippetDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [lockModifiedDate, setLockModifiedDate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const lastSelectionRef = useRef<Range | null>(null);

  // Simple HTML prettifier to avoid "clumping" in code mode
  const prettifyHTML = (html: string) => {
    return html
      .replace(/<([^/][^>]*?)><\/([^>]+?)>/g, '<$1></$2>\n') // Newline after empty tag pairs
      .replace(/(<\/p>|<\/div>|<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/ul>|<\/ol>|<\/li>|<\/blockquote>|<\/section>)/g, '$1\n') // Newline after block close tags
      .replace(/<(p|div|h1|h2|h3|h4|ul|ol|li|blockquote|section|img|hr)/g, '\n<$1') // Newline before block open tags
      .replace(/\n\n+/g, '\n') // Remove redundant double newlines
      .trim();
  };

  const handleTabSwitch = (tab: 'visual' | 'code') => {
    if (tab === 'code') {
      // Prettify when switching to code mode
      const currentHTML = visualEditorRef.current?.innerHTML || editingPost.content || '';
      setEditingPost(prev => ({ ...prev, content: prettifyHTML(currentHTML) }));
    }
    setEditorTab(tab);
  };

  // Sync content when component mounts or post ID changes
  useEffect(() => {
    if (visualEditorRef.current && editorTab === 'visual') {
      const targetContent = editingPost.content || '<p><br></p>';
      if (visualEditorRef.current.innerHTML !== targetContent) {
        visualEditorRef.current.innerHTML = targetContent;
      }
    }
  }, [editingPost.id, editorTab]);

  const saveSelection = () => {
    if (editorTab !== 'visual') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (visualEditorRef.current?.contains(range.commonAncestorContainer)) {
        lastSelectionRef.current = range.cloneRange();
      }
    }
  };

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const html = visualEditorRef.current.innerHTML;
      if (html !== editingPost.content) {
        setEditingPost(prev => ({ ...prev, content: html }));
        setHasUnsavedChanges(true);
      }
      saveSelection();
    }
  };

  // Global registration for image insertion
  useEffect(() => {
    (window as any).insertImageToEditor = (url: string) => {
      const imgHtml = `<img src="${url}" alt="" style="max-width: 100%; height: auto; border-radius: 12px; margin: 2rem auto; display: block; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);" />`;
      
      if (editorTab === 'visual' && visualEditorRef.current) {
        visualEditorRef.current.focus();
        const sel = window.getSelection();
        const range = lastSelectionRef.current;

        if (range && sel) {
          sel.removeAllRanges();
          sel.addRange(range);
          range.deleteContents();
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = imgHtml;
          const node = tempDiv.firstChild!;
          range.insertNode(node);
          range.setStartAfter(node);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        } else {
          visualEditorRef.current.insertAdjacentHTML('beforeend', imgHtml);
        }
        handleVisualInput();
      } else if (editorTab === 'code' && codeEditorRef.current) {
        const textarea = codeEditorRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = editingPost.content || '';
        // Insert with newlines for code readability
        const insertion = `\n${imgHtml}\n`;
        const newContent = currentContent.substring(0, start) + insertion + currentContent.substring(end);
        setEditingPost(prev => ({ ...prev, content: newContent }));
        setHasUnsavedChanges(true);
      }
    };
    return () => { delete (window as any).insertImageToEditor; };
  }, [editorTab, editingPost.content]);

  const execCommand = (command: string, value: string = '') => {
    if (editorTab !== 'visual' || !visualEditorRef.current) return;
    visualEditorRef.current.focus();
    if (lastSelectionRef.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(lastSelectionRef.current);
    }
    document.execCommand(command, false, value);
    handleVisualInput();
  };

  const handleAction = async (status: ContentStatus) => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const finalContent = editorTab === 'visual' 
        ? (visualEditorRef.current?.innerHTML || '') 
        : (editingPost.content || '');

      const postToSave = { 
        ...editingPost, 
        content: finalContent,
        status: status, 
        seoScore: seoAnalysis.totalScore 
      };

      await onSave(postToSave, status === 'published');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving post:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleSlugSave = () => {
    const finalSlug = generateSlug(tempSlug);
    setEditingPost(prev => ({ ...prev, slug: finalSlug }));
    setIsEditingSlug(false);
    setHasUnsavedChanges(true);
  };

  const handleSeoChange = (field: keyof SEOData, value: string) => {
    setEditingPost(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value } as SEOData
    }));
    setHasUnsavedChanges(true);
  };

  const toggleSeoSection = (section: string) => {
    setExpandedSeo(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };

  const seoAnalysis = useMemo(() => {
    const title = editingPost.title || '';
    const seoTitle = editingPost.seo?.title || title;
    const metaDesc = editingPost.seo?.description || '';
    const content = editingPost.content || '';
    const slug = editingPost.slug || '';
    const keyword = focusKeyword.trim().toLowerCase();
    
    const plainText = content.replace(/<[^>]*>?/gm, '');
    const words = plainText.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    const basic = {
      keywordInTitle: !!(keyword && seoTitle.toLowerCase().includes(keyword)),
      keywordInMeta: !!(keyword && metaDesc.toLowerCase().includes(keyword)),
      keywordInUrl: !!(keyword && slug.toLowerCase().includes(keyword.replace(/\s+/g, '-'))),
      keywordAtStart: !!(keyword && plainText.toLowerCase().substring(0, Math.floor(plainText.length * 0.1)).includes(keyword)),
      keywordInContent: !!(keyword && plainText.toLowerCase().includes(keyword)),
      contentLength: wordCount >= 600 && wordCount <= 2500,
    };
    
    let basicScore = 0;
    Object.values(basic).forEach(v => v && (basicScore += 6.67));

    const kwRegex = keyword ? new RegExp(`\\b${keyword}\\b`, 'gi') : null;
    const kwMatches = kwRegex ? (plainText.match(kwRegex) || []).length : 0;
    const density = wordCount > 0 ? (kwMatches / wordCount) * 100 : 0;
    
    let densityFactor = 0;
    if (density >= 1.0 && density <= 1.5) densityFactor = 1.0;
    else if ((density >= 0.6 && density <= 0.9) || (density >= 1.6 && density <= 2.0)) densityFactor = 0.8;
    else if ((density >= 0.1 && density <= 0.5) || (density >= 2.1 && density <= 3.0)) densityFactor = 0.5;

    const imgCount = (content.match(/<img/gi) || []).length;
    const videoCount = (content.match(/<video|<iframe/gi) || []).length;
    const totalMedia = imgCount + videoCount;
    const hasKwInAlt = keyword && new RegExp(`<img[^+]+alt=["'][^"']*${keyword}[^"']*["']`, 'i').test(content);
    
    let mediaFactor = 0;
    if (totalMedia >= 1) {
      if (hasKwInAlt) {
        mediaFactor = wordCount < 1000 ? (totalMedia >= 2 ? 1.0 : 0.7) : (totalMedia >= 4 ? 1.0 : 0.7);
      } else {
        mediaFactor = 0.4;
      }
    }

    const additional = {
      keywordInSubheading: !!(keyword && /<h[2-4][^>]*>.*?keyword.*?<\/h[2-4]>/i.test(content.replace('keyword', keyword))),
      imageAlt: mediaFactor >= 0.7,
      keywordDensity: densityFactor >= 0.8,
      linking: /href=["']http/i.test(content) && /href=["']\//i.test(content),
      dofollow: /href=["']http/i.test(content) && !/rel=["'][^"']*nofollow[^"']*["']/i.test(content),
    };

    let additionalScore = 0;
    if (additional.keywordInSubheading) additionalScore += 6;
    additionalScore += (mediaFactor * 6);
    additionalScore += (densityFactor * 6);
    if (additional.linking) additionalScore += 6;
    if (additional.dofollow) additionalScore += 6;

    const titleReadability = {
      startWithKeyword: !!(keyword && seoTitle.toLowerCase().startsWith(keyword)),
      sentiment: SENTIMENT_WORDS.some(w => seoTitle.toLowerCase().includes(w)),
      powerWord: POWER_WORDS.some(w => seoTitle.toLowerCase().includes(w)),
      numberInTitle: /\d+/.test(seoTitle),
    };
    let titleScore = 0;
    Object.values(titleReadability).forEach(v => v && (titleScore += 3.75));

    const contentReadability = {
      toc: /id=["']toc["']|Mục lục|Table of Content/i.test(content),
      shortParagraphs: content.split(/<\/p>/i).every(p => p.replace(/<[^>]*>/g, '').split(/\s+/).length < 50),
      hasMedia: totalMedia > 0,
    };
    let contentReadScore = 0;
    Object.values(contentReadability).forEach(v => v && (contentReadScore += 5));

    const totalScore = Math.round(basicScore + additionalScore + titleScore + contentReadScore);
    
    return {
      totalScore: Math.min(totalScore, 100),
      density: density.toFixed(2),
      wordCount,
      checks: { basic, additional, titleReadability, contentReadability }
    };
  }, [editingPost.title, editingPost.content, editingPost.slug, editingPost.seo, focusKeyword]);

  const scoreColor = seoAnalysis.totalScore > 80 ? 'text-green-600' : seoAnalysis.totalScore > 50 ? 'text-amber-500' : 'text-red-600';
  const scoreBg = seoAnalysis.totalScore > 80 ? 'bg-green-600' : seoAnalysis.totalScore > 50 ? 'bg-amber-500' : 'bg-red-600';
  const scoreLightBg = seoAnalysis.totalScore > 80 ? 'bg-green-50' : seoAnalysis.totalScore > 50 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        <div className="lg:col-span-3 space-y-5">
          <div className="space-y-3">
            <input 
              className="w-full text-3xl font-bold border border-slate-300 rounded-sm focus:border-primary focus:ring-0 outline-none p-3 px-4 bg-white shadow-inner placeholder:text-slate-300" 
              placeholder="Add title"
              value={editingPost.title || ''}
              onChange={(e) => {
                const newTitle = e.target.value;
                setEditingPost(prev => ({ 
                  ...prev, 
                  title: newTitle, 
                  slug: prev.id && prev.slug ? prev.slug : generateSlug(newTitle) 
                }));
                setHasUnsavedChanges(true);
              }}
            />
            
            <div className="flex items-center gap-1 text-[13px] text-slate-500 px-1">
              <span className="font-bold text-slate-700">Permalink:</span>
              <span className="opacity-60">https://sproux.ai/</span>
              {isEditingSlug ? (
                <div className="flex items-center gap-1">
                  <input type="text" value={tempSlug} onChange={(e) => setTempSlug(e.target.value)} className="border border-slate-300 rounded px-2 py-0.5 text-slate-900 focus:outline-none focus:border-blue-400 text-xs bg-white" autoFocus />
                  <button onClick={handleSlugSave} className="p-0.5 bg-slate-100 hover:bg-slate-200 rounded text-green-600"><Check size={14}/></button>
                  <button onClick={() => setIsEditingSlug(false)} className="p-0.5 bg-slate-100 hover:bg-slate-200 rounded text-red-600"><X size={14}/></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[#2271b1] font-medium">{editingPost.slug || 'example-slug'}</span>
                  <button onClick={() => { setTempSlug(editingPost.slug || ''); setIsEditingSlug(true); }} className="px-1.5 py-0.5 border border-slate-300 bg-white rounded-sm text-[11px] font-medium text-slate-600 hover:bg-slate-50">Edit</button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-300 shadow-sm rounded-sm overflow-visible">
            {/* STICKY TOOLBAR WRAPPER */}
            <div className="sticky top-[-2rem] z-30 shadow-sm">
              <div className="bg-[#f6f7f7] border-b border-slate-300 p-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => { saveSelection(); openMediaLibrary('content'); }} className="px-3 py-1 text-xs border border-slate-300 bg-white rounded-sm flex items-center gap-2 hover:bg-slate-50 font-medium text-slate-700 shadow-sm">
                    <ImageIcon size={14} className="text-slate-500" /> Add Media
                  </button>
                  {editorTab === 'code' && (
                    <button 
                      type="button" 
                      onClick={() => setEditingPost(prev => ({ ...prev, content: prettifyHTML(prev.content || '') }))} 
                      className="px-3 py-1 text-xs border border-slate-300 bg-white rounded-sm flex items-center gap-2 hover:bg-slate-50 font-medium text-slate-700 shadow-sm"
                      title="Auto Format HTML"
                    >
                      <Sparkles size={14} className="text-amber-500" /> Format Code
                    </button>
                  )}
                </div>
                <div className="flex border border-slate-300 rounded-sm overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => handleTabSwitch('visual')} className={`px-4 py-1 text-xs ${editorTab === 'visual' ? 'bg-[#ebebeb] font-bold text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>Visual</button>
                  <button type="button" onClick={() => handleTabSwitch('code')} className={`px-4 py-1 text-xs ${editorTab === 'code' ? 'bg-[#ebebeb] font-bold text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>Code</button>
                </div>
              </div>

              {editorTab === 'visual' && (
                <div className="bg-white border-b border-slate-200 p-1 flex items-center gap-1 flex-wrap">
                  <select 
                    onChange={(e) => execCommand('formatBlock', e.target.value)}
                    className="text-xs border border-slate-300 rounded px-1.5 py-1 bg-white outline-none mr-1"
                  >
                    <option value="P">Paragraph</option>
                    <option value="H1">Heading 1</option>
                    <option value="H2">Heading 2</option>
                    <option value="H3">Heading 3</option>
                    <option value="H4">Heading 4</option>
                  </select>
                  <div className="w-px h-5 bg-slate-200 mx-1"></div>
                  <ToolbarButton onClick={() => execCommand('bold')} icon={<Bold size={14} />} title="Bold" />
                  <ToolbarButton onClick={() => execCommand('italic')} icon={<Italic size={14} />} title="Italic" />
                  <ToolbarButton onClick={() => execCommand('underline')} icon={<Underline size={14} />} title="Underline" />
                  <div className="w-px h-5 bg-slate-200 mx-1"></div>
                  <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={<List size={14} />} title="Unordered List" />
                  <ToolbarButton onClick={() => execCommand('insertOrderedList')} icon={<ListOrdered size={14} />} title="Ordered List" />
                  <ToolbarButton onClick={() => execCommand('formatBlock', 'BLOCKQUOTE')} icon={<Quote size={14} />} title="Quote" />
                  <div className="w-px h-5 bg-slate-200 mx-1"></div>
                  <ToolbarButton onClick={() => execCommand('justifyLeft')} icon={<AlignLeft size={14} />} />
                  <ToolbarButton onClick={() => execCommand('justifyCenter')} icon={<AlignCenter size={14} />} />
                  <ToolbarButton onClick={() => execCommand('justifyRight')} icon={<AlignRight size={14} />} />
                  <div className="w-px h-5 bg-slate-200 mx-1"></div>
                  <ToolbarButton onClick={() => execCommand('createLink', prompt('Enter URL:') || '')} icon={<LinkIcon size={14} />} />
                  <ToolbarButton onClick={() => execCommand('unlink')} icon={<Unlink size={14} />} />
                  <ToolbarButton onClick={() => execCommand('removeFormat')} icon={<RemoveFormatting size={14} />} />
                </div>
              )}
            </div>

            <div className="p-0 bg-white min-h-[500px]">
              {editorTab === 'visual' ? (
                <div 
                  ref={visualEditorRef}
                  contentEditable
                  onInput={handleVisualInput}
                  onBlur={saveSelection}
                  onKeyUp={saveSelection}
                  onClick={saveSelection}
                  className="w-full h-full min-h-[500px] p-6 outline-none font-sans text-[16px] text-slate-800 visual-editor-content"
                />
              ) : (
                <textarea 
                  ref={codeEditorRef}
                  className="w-full min-h-[500px] p-6 outline-none border-none leading-relaxed transition-all font-mono text-sm bg-[#1e1e1e] text-[#f8f8f2] resize-none whitespace-pre-wrap" 
                  placeholder="Paste your HTML here..."
                  value={editingPost.content || ''}
                  onChange={(e) => { 
                    setEditingPost(prev => ({ ...prev, content: e.target.value })); 
                    setHasUnsavedChanges(true); 
                  }}
                />
              )}
            </div>
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-1.5 text-[11px] text-slate-400 flex justify-between">
              <span>Word count: {seoAnalysis.wordCount}</span>
              <span className="opacity-60 italic">Mode: {editorTab === 'visual' ? 'WYSIWYG' : 'Raw HTML'}</span>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .visual-editor-content { line-height: 1.7; outline: none; }
            .visual-editor-content h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1.5rem; margin-top: 2rem; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
            .visual-editor-content h2 { font-size: 1.875rem; font-weight: 700; margin-bottom: 1.25rem; margin-top: 1.75rem; color: #1e293b; }
            .visual-editor-content h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; margin-top: 1.5rem; color: #334155; }
            .visual-editor-content h4 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; color: #475569; }
            .visual-editor-content p { margin-bottom: 1.25rem; color: #334155; }
            .visual-editor-content blockquote { border-left: 4px solid #0f766e; padding-left: 1.5rem; font-style: italic; color: #475569; margin: 1.5rem 0; }
            .visual-editor-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.25rem; }
            .visual-editor-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.25rem; }
            .visual-editor-content img { max-width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); margin: 2rem auto; display: block; }
            .visual-editor-content a { color: #0f766e; text-decoration: underline; }
          `}} />

          <div className="bg-white border border-slate-300 shadow-sm rounded-sm">
            <div className="p-0 border-b border-slate-200">
               <div className="flex">
                  <SeoTab active={seoTab === 'general'} onClick={() => setSeoTab('general')} icon={<Settings size={14}/>} label="General" />
                  <SeoTab active={seoTab === 'advanced'} onClick={() => setSeoTab('advanced')} icon={<Briefcase size={14}/>} label="Advanced" />
                  <SeoTab active={seoTab === 'schema'} onClick={() => setSeoTab('schema')} icon={<BarChart2 size={14}/>} label="Schema" />
                  <SeoTab active={seoTab === 'social'} onClick={() => setSeoTab('social')} icon={<Sparkles size={14}/>} label="Social" />
               </div>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h4 className="text-[13px] font-bold text-slate-700">Preview</h4>
                    <button type="button" onClick={() => setIsSnippetModalOpen(true)} className="px-3 py-1.5 bg-[#2271b1] text-white text-[11px] font-bold rounded-sm shadow-sm hover:bg-[#135e96]">Edit Snippet</button>
                 </div>
                 <div className="p-5 border border-slate-200 rounded-sm bg-white shadow-sm max-w-2xl group cursor-pointer hover:border-blue-400" onClick={() => setIsSnippetModalOpen(true)}>
                    <div className="flex items-center gap-1 text-[14px] text-slate-500 mb-1">
                       <span>https://sproux.ai</span>
                       <span className="opacity-40">›</span>
                       <span className="truncate">{editingPost.slug || '...'}</span>
                    </div>
                    <h4 className="text-[#1a0dab] text-xl font-medium hover:underline mb-1 leading-tight">{editingPost.seo?.title || editingPost.title || 'Post Title'}</h4>
                    <p className="text-[#4d5156] text-[14px] leading-relaxed line-clamp-2">{editingPost.seo?.description || 'Please provide a meta description...'}</p>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">Focus Keyword <HelpCircle size={10}/></label>
                 <input 
                    type="text"
                    placeholder="Example: Rank Math SEO"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-sm text-sm focus:border-blue-500 outline-none shadow-inner"
                 />
              </div>

              <div className="space-y-1">
                <SeoSection title="Basic SEO" expanded={expandedSeo.includes('basic')} onClick={() => toggleSeoSection('basic')} errors={Object.values(seoAnalysis.checks.basic).filter(v => !v).length}>
                  <SeoItem label="Focus Keyword in SEO title" valid={seoAnalysis.checks.basic.keywordInTitle} />
                  <SeoItem label="Focus Keyword in Meta Description" valid={seoAnalysis.checks.basic.keywordInMeta} />
                  <SeoItem label="Focus Keyword in the URL" valid={seoAnalysis.checks.basic.keywordInUrl} />
                  <SeoItem label="Focus Keyword at beginning of content" valid={seoAnalysis.checks.basic.keywordAtStart} />
                  <SeoItem label="Focus Keyword in the content" valid={seoAnalysis.checks.basic.keywordInContent} />
                  <SeoItem label={`Content length (${seoAnalysis.wordCount} words)`} valid={seoAnalysis.checks.basic.contentLength} />
                </SeoSection>

                <SeoSection title="Additional" expanded={expandedSeo.includes('additional')} onClick={() => toggleSeoSection('additional')} errors={Object.values(seoAnalysis.checks.additional).filter(v => !v).length}>
                  <SeoItem label="Keyword in subheadings (H2, H3, H4)" valid={seoAnalysis.checks.additional.keywordInSubheading} />
                  <SeoItem label="Image Alt Text with keyword" valid={seoAnalysis.checks.additional.imageAlt} />
                  <SeoItem label={`Keyword Density (${seoAnalysis.density}%)`} valid={seoAnalysis.checks.additional.keywordDensity} />
                  <SeoItem label="Internal & External links" valid={seoAnalysis.checks.additional.linking} />
                  <SeoItem label="DoFollow external links" valid={seoAnalysis.checks.additional.dofollow} />
                </SeoSection>

                <SeoSection title="Title Readability" expanded={expandedSeo.includes('title')} onClick={() => toggleSeoSection('title')} errors={Object.values(seoAnalysis.checks.titleReadability).filter(v => !v).length}>
                  <SeoItem label="Keyword at beginning of title" valid={seoAnalysis.checks.titleReadability.startWithKeyword} />
                  <SeoItem label="Title contains sentiment" valid={seoAnalysis.checks.titleReadability.sentiment} />
                  <SeoItem label="Title contains power words" valid={seoAnalysis.checks.titleReadability.powerWord} />
                  <SeoItem label="Title contains a number" valid={seoAnalysis.checks.titleReadability.numberInTitle} />
                </SeoSection>

                <SeoSection title="Content Readability" expanded={expandedSeo.includes('content')} onClick={() => toggleSeoSection('content')} errors={Object.values(seoAnalysis.checks.contentReadability).filter(v => !v).length}>
                  <SeoItem label="Table of Content used" valid={seoAnalysis.checks.contentReadability.toc} />
                  <SeoItem label="Short paragraphs for better UX" valid={seoAnalysis.checks.contentReadability.shortParagraphs} />
                  <SeoItem label="Contains images/videos" valid={seoAnalysis.checks.contentReadability.hasMedia} />
                </SeoSection>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Metabox title="Publish">
             <div className="flex justify-between gap-2 mb-4">
                <button 
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleAction('draft')} 
                  className="flex-1 py-1.5 text-[11px] border border-slate-300 bg-white hover:bg-slate-50 rounded-sm font-medium text-slate-700 shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSaving ? <Loader2 size={12} className="animate-spin" /> : null} Save Draft
                </button>
                <button 
                  type="button"
                  onClick={() => onPreview?.({ ...editingPost, content: visualEditorRef.current?.innerHTML || editingPost.content || '' })}
                  className="flex-1 py-1.5 text-[11px] border border-slate-300 bg-white hover:bg-slate-50 rounded-sm font-medium text-slate-700 shadow-sm transition-all"
                >
                  Preview
                </button>
             </div>
             <div className="space-y-2.5 py-1 text-[13px] text-slate-700">
                <StatusItem icon={<Key size={14}/>} label="Status" value={editingPost.status || 'draft'} />
                <StatusItem icon={<Eye size={14}/>} label="Visibility" value="Public" />
                <StatusItem icon={<Calendar size={14}/>} label="Publish" value="immediately" />
                
                <div className="flex items-center gap-2 pt-1 group">
                   <div 
                    onClick={() => setLockModifiedDate(!lockModifiedDate)}
                    className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-colors duration-300 ${lockModifiedDate ? 'bg-slate-900' : 'bg-slate-200'}`}
                   >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 transform ${lockModifiedDate ? 'translate-x-4' : 'translate-x-0'}`}></div>
                   </div>
                   <span className="text-[12px] font-medium text-slate-600 cursor-pointer" onClick={() => setLockModifiedDate(!lockModifiedDate)}>Lock Modified Date</span>
                </div>
             </div>
             
             <div className={`mt-5 p-3 rounded-sm border-l-4 ${scoreLightBg} ${seoAnalysis.totalScore > 80 ? 'border-green-600' : seoAnalysis.totalScore > 50 ? 'border-amber-500' : 'border-red-600'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                   <BarChart2 size={16} className={scoreColor} />
                   <span className={`text-[12px] font-black uppercase tracking-tight ${scoreColor}`}>SEO: {seoAnalysis.totalScore} / 100</span>
                </div>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                   <div className={`h-full transition-all duration-700 ${scoreBg}`} style={{ width: `${seoAnalysis.totalScore}%` }}></div>
                </div>
             </div>

             <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <button 
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleAction('published')} 
                  className="px-6 py-2 bg-[#2271b1] text-white text-[13px] font-bold rounded-sm shadow-md hover:bg-[#135e96] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : null} Publish
                </button>
             </div>
          </Metabox>

          <Metabox title="Categories">
             <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer hover:text-slate-900">
                    <input type="checkbox" checked={editingPost.categoryIds?.includes(cat.id)} onChange={(e) => { 
                      const current = editingPost.categoryIds || []; 
                      setEditingPost(prev => ({ 
                        ...prev, 
                        categoryIds: e.target.checked ? [...current, cat.id] : current.filter(id => id !== cat.id) 
                      })); 
                    }} className="rounded-sm border-slate-300 text-[#2271b1] focus:ring-0" />
                    {cat.name}
                  </label>
                ))}
             </div>
             <button type="button" className="text-[11px] text-[#2271b1] underline hover:no-underline font-medium">+ Add New Category</button>
          </Metabox>

          <Metabox title="Featured image">
             {editingPost.coverImage ? (
                <div className="space-y-3">
                   <div className="aspect-video rounded-sm overflow-hidden border border-slate-200 group relative">
                      <img src={editingPost.coverImage} className="w-full h-full object-cover" alt="Featured" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button type="button" onClick={() => openMediaLibrary('cover')} className="p-2 bg-white rounded-full text-slate-800 shadow-lg"><ImageIcon size={16}/></button>
                      </div>
                   </div>
                   <button type="button" onClick={() => { setEditingPost(prev => ({...prev, coverImage: ''})); setHasUnsavedChanges(true); }} className="text-[11px] text-red-600 underline hover:no-underline font-medium">Remove featured image</button>
                </div>
             ) : (
                <button type="button" onClick={() => openMediaLibrary('cover')} className="w-full py-12 border-2 border-dashed border-slate-200 rounded-sm text-center text-[#2271b1] text-[12px] font-medium hover:bg-slate-50 transition-colors">Set featured image</button>
             )}
          </Metabox>
        </div>
      </div>

      {/* SNIPPET MODAL */}
      {isSnippetModalOpen && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                 <h3 className="text-[15px] font-bold text-slate-700">Preview Snippet Editor</h3>
                 <button type="button" onClick={() => setIsSnippetModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
              </div>
              
              <div className="p-0 border-b border-slate-100 flex px-4">
                  <button type="button" className="px-4 py-3 text-[13px] font-bold text-[#2271b1] border-b-2 border-[#2271b1] flex items-center gap-2">
                     <Settings size={14}/> General
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#f8f9fa]">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Preview</h4>
                       <div className="flex bg-white border border-slate-200 rounded overflow-hidden">
                          <button type="button" onClick={() => setSnippetDevice('desktop')} className={`p-1.5 ${snippetDevice === 'desktop' ? 'bg-slate-100 text-[#2271b1]' : 'text-slate-400'}`}><Monitor size={14}/></button>
                          <button type="button" onClick={() => setSnippetDevice('mobile')} className={`p-1.5 ${snippetDevice === 'mobile' ? 'bg-slate-100 text-[#2271b1]' : 'text-slate-400'}`}><Smartphone size={14}/></button>
                       </div>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-sm">
                       <div className="text-[14px] text-slate-500 mb-0.5">https://sproux.ai <span className="opacity-40">›</span> {editingPost.slug || '...'}</div>
                       <h4 className="text-[#1a0dab] text-lg font-medium leading-tight mb-1">{editingPost.seo?.title || editingPost.title || 'Post Title'}</h4>
                       <p className="text-[#4d5156] text-[14px] leading-relaxed line-clamp-2">{editingPost.seo?.description || 'Please provide a meta description...'}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-1">
                       <div className="flex justify-between items-end mb-1">
                          <label className="text-[11px] font-black text-slate-400 uppercase">SEO Title</label>
                          <span className="text-[10px] text-slate-400 font-bold">{(editingPost.seo?.title || '').length} / 60</span>
                       </div>
                       <input 
                          type="text" 
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-sm text-sm outline-none focus:border-blue-500"
                          value={editingPost.seo?.title || ''}
                          onChange={(e) => handleSeoChange('title', e.target.value)}
                       />
                    </div>

                    <div className="space-y-1">
                       <div className="flex justify-between items-end mb-1">
                          <label className="text-[11px] font-black text-slate-400 uppercase">Meta Description</label>
                          <span className="text-[10px] text-slate-400 font-bold">{(editingPost.seo?.description || '').length} / 160</span>
                       </div>
                       <textarea 
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-sm text-sm outline-none focus:border-blue-500 min-h-[80px] resize-none"
                          value={editingPost.seo?.description || ''}
                          onChange={(e) => handleSeoChange('description', e.target.value)}
                       />
                    </div>
                 </div>
              </div>

              <div className="p-4 border-t bg-slate-50 flex justify-end">
                 <button type="button" onClick={() => setIsSnippetModalOpen(false)} className="px-8 py-2 bg-[#2271b1] text-white text-[13px] font-bold rounded-sm shadow-md hover:bg-[#135e96]">Save Data</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const ToolbarButton: React.FC<{ onClick: () => void; icon: React.ReactNode; title?: string }> = ({ onClick, icon, title }) => (
  <button 
    type="button"
    onMouseDown={(e) => e.preventDefault()} 
    onClick={onClick}
    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 border border-transparent hover:border-slate-300 transition-all"
    title={title}
  >
    {icon}
  </button>
);

const SeoTab: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button type="button" onClick={onClick} className={`flex items-center gap-2 px-6 py-3 text-[13px] font-bold transition-all border-b-2 ${active ? 'text-[#2271b1] border-[#2271b1] bg-white' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>{icon} {label}</button>
);

const StatusItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 group">
     <div className="text-slate-400">{icon}</div>
     <span className="text-[12px]"> {label}: <span className="font-bold text-slate-900">{value}</span></span>
     <button type="button" className="text-[#2271b1] underline hover:no-underline ml-auto text-[11px]">Edit</button>
  </div>
);

const SeoSection: React.FC<{ title: string; expanded: boolean; onClick: () => void; errors: number; children: React.ReactNode }> = ({ title, expanded, onClick, errors, children }) => (
  <div className="border border-slate-200 rounded-sm overflow-hidden mb-1">
    <button type="button" onClick={onClick} className="w-full flex items-center justify-between p-2.5 px-3 text-left hover:bg-slate-50 transition-colors bg-white">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-bold text-slate-700">{title}</span>
        {errors > 0 && <span className="bg-red-50 text-red-600 text-[9px] px-1.5 py-0.5 rounded-full font-black">{errors} ERRORS</span>}
      </div>
      {expanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
    </button>
    {expanded && <div className="p-3 pt-1 space-y-2 bg-white border-t border-slate-100">{children}</div>}
  </div>
);

const SeoItem: React.FC<{ label: string; valid: boolean }> = ({ label, valid }) => (
  <div className="flex items-start gap-3 text-[12px] group">
    <div className={`mt-1 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${valid ? 'bg-green-600' : 'bg-red-600'}`}>
      {valid ? <Check size={8} className="text-white" strokeWidth={5} /> : <X size={8} className="text-white" strokeWidth={5} />}
    </div>
    <span className={`leading-tight ${valid ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
    <button type="button" className="ml-auto opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 transition-opacity"><HelpCircle size={12} /></button>
  </div>
);

export default PostEditor;
