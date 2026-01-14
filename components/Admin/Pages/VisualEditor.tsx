
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, ChevronLeft, Smartphone, Monitor, Tablet, ImageIcon, 
  Type, Sparkles, Lock, MousePointer2, AlertCircle, Edit3,
  Trash2, ChevronUp, ChevronDown, List, Search, AlertTriangle, Plus, Link as LinkIcon, Menu, AlignLeft, TrendingUp
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { PageData, ContentBlock, MediaAttachment } from '../../../types';

interface VisualEditorProps {
  page: PageData;
  mediaItems: MediaAttachment[];
  onSave: (id: string, blocks: ContentBlock[], status: 'draft' | 'published' | 'private') => void;
  onClose: () => void;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ page, mediaItems, onSave, onClose }) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(page.blocks);
  const [status, setStatus] = useState<'draft' | 'published' | 'private'>(page.status);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasChanges, setHasChanges] = useState(false);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

  const activeBlock = blocks.find(b => b.id === selectedBlockId);

  const handleUpdateValue = (id: string, value: string, metadata?: any, label?: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { 
      ...b, 
      value, 
      label: label || b.label,
      metadata: { ...b.metadata, ...metadata } 
    } : b));
    setHasChanges(true);
  };

  const handleAddBlock = (type: string) => {
    const newId = `custom-${type}-${Math.random().toString(36).substr(2, 5)}`;
    let defaultValue = 'Enter content here...';
    let label = `New ${type.charAt(0).toUpperCase() + type.slice(1)} Block`;
    let group = 'General Content';

    if (type === 'pricing-plan') {
      defaultValue = JSON.stringify({
        name: 'New Plan',
        price: '$0',
        description: 'Plan description',
        features: ['Feature 1', 'Feature 2'],
        ctaText: 'Buy Now',
        ctaVariant: 'primary',
        icon: 'Rocket',
        link: ''
      });
      label = 'Plan: New Plan';
      group = 'Pricing Plans';
    } else if (type === 'faq-item') {
      defaultValue = JSON.stringify({
        question: 'New Question?',
        answer: 'Enter answer here...'
      });
      label = 'FAQ: New Question?';
      group = 'FAQs';
    } else if (type === 'image') {
      defaultValue = 'https://picsum.photos/800/600';
      label = 'New Image';
    } else if (type === 'richtext') {
      defaultValue = '<p>New rich text content paragraph...</p>';
      label = 'Rich Text Section';
    }

    const newBlock: ContentBlock = {
      id: newId,
      type: type as any,
      label: label,
      value: defaultValue,
      metadata: {
        group: group,
        editable: true,
        link: ''
      }
    };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newId);
    setHasChanges(true);
  };

  const confirmDeleteBlock = () => {
    if (blockToDelete) {
      setBlocks(prev => prev.filter(b => b.id !== blockToDelete));
      if (selectedBlockId === blockToDelete) setSelectedBlockId(null);
      setHasChanges(true);
      setBlockToDelete(null);
    }
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      const newBlocks = [...prev];
      if (direction === 'up' && index > 0) {
        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
      } else if (direction === 'down' && index < newBlocks.length - 1) {
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      }
      return newBlocks;
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(page.id, blocks, status);
    setHasChanges(false);
  };

  const groupedBlocks = useMemo(() => {
    const groups: Record<string, ContentBlock[]> = {};
    blocks.forEach(b => {
      const g = b.metadata?.group || 'Main Content';
      if (!groups[g]) groups[g] = [];
      groups[g].push(b);
    });
    return groups;
  }, [blocks]);

  const handleSelectMedia = (item: MediaAttachment) => {
    if (activeBlock && activeBlock.type === 'image') {
      handleUpdateValue(activeBlock.id, item.url, { alt: item.altText || item.title });
      setIsMediaSelectorOpen(false);
    }
  };

  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest";

  const renderGenericPreview = () => {
    const isPricing = page.id.startsWith('p-pricing');
    const isBlog = page.id.startsWith('p-blog');
    const isHelp = page.id.startsWith('p-help');

    if (isPricing) {
       return (
         <div className="relative min-h-[800px] pointer-events-auto bg-slate-50/50">
            <div className="p-12 text-center bg-white border-b border-slate-100">
               <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                  {blocks.find(b => b.id === 'pricing-hero-title')?.value || 'Pricing Plans'}
               </h2>
               <p className="text-slate-500 max-w-lg mx-auto">
                  {blocks.find(b => b.id === 'pricing-hero-desc')?.value || 'Choose the best plan for your needs.'}
               </p>
            </div>
            <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-6">
               {blocks.filter(b => b.type === 'pricing-plan').map(plan => {
                  let data: any = { name: 'Plan', price: '$TBD' };
                  try { data = JSON.parse(plan.value); } catch(e) {}
                  return (
                     <div key={plan.id} onClick={() => setSelectedBlockId(plan.id)} className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer ${selectedBlockId === plan.id ? 'border-primary bg-white shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                        <div className="w-10 h-10 bg-slate-50 rounded-xl mb-6 flex items-center justify-center">
                           <DynamicIcon name={data.icon || 'Rocket'} size={20} className="text-primary" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">{data.name}</h3>
                        <p className="text-2xl font-serif font-bold mb-4">{data.price}</p>
                        <div className="space-y-2 opacity-40">
                           <div className="h-1.5 bg-slate-200 rounded-full w-full"></div>
                           <div className="h-1.5 bg-slate-200 rounded-full w-3/4"></div>
                        </div>
                     </div>
                  )
               })}
            </div>
         </div>
       );
    }

    if (isBlog || isHelp) {
      const topSearchesRaw = blocks.find(b => b.id === 'help-top-searches')?.value || "";
      const topSearches = topSearchesRaw.split(',').map(s => s.trim()).filter(s => s !== "");
      const placeholderText = blocks.find(b => b.id === 'help-search-placeholder')?.value || 'Search...';

      return (
        <div className="relative min-h-[800px] pointer-events-auto bg-white">
          <div className={`p-20 text-center ${isHelp ? 'bg-[#f0fdfa]' : 'bg-white'}`}>
             <h1 
               className="text-5xl font-serif font-bold text-slate-900 mb-6"
               dangerouslySetInnerHTML={{ __html: blocks.find(b => b.id.includes('hero-title'))?.value || page.title }}
             />
             
             {isHelp && (
               <div className="mt-8">
                  <div className="max-w-xl mx-auto h-16 bg-white border border-slate-200 rounded-2xl flex items-center px-6 gap-3 text-slate-400 shadow-xl shadow-slate-200/50">
                    <Search size={20} /> <span className="truncate">{placeholderText}</span>
                  </div>
                  
                  {topSearches.length > 0 && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">
                          <TrendingUp size={12} className="text-teal-500" /> Top Search:
                       </div>
                       {topSearches.map(tag => (
                         <span key={tag} className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 shadow-sm">{tag}</span>
                       ))}
                    </div>
                  )}
               </div>
             )}

             {!isHelp && (
                <p className="text-xl text-slate-500 max-w-2xl mx-auto italic">
                  {blocks.find(b => b.id.includes('hero-desc'))?.value || 'Edit this description in the sidebar.'}
                </p>
             )}
          </div>
          
          <div className="p-12 space-y-12">
            <div className="grid grid-cols-2 gap-8 opacity-20 select-none">
              {[1, 2].map(i => (
                <div key={i} className="aspect-video bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center">
                   <ImageIcon size={48} className="text-slate-200" />
                </div>
              ))}
            </div>
            {isHelp && (
              <div className="bg-primary rounded-[3rem] p-16 text-center text-white shadow-2xl">
                <h2 className="text-3xl font-serif font-bold mb-4">{blocks.find(b => b.id === 'help-contact-title')?.value || 'Contact Section'}</h2>
                <p className="opacity-70">{blocks.find(b => b.id === 'help-contact-desc')?.value || 'Subtext'}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
       <div className="max-w-4xl mx-auto py-20 px-8 pointer-events-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              {blocks.find(b => b.id.includes('title'))?.value || page.title}
            </h1>
            <div className="w-20 h-1 bg-primary rounded-full"></div>
          </div>
          
          <div className="space-y-12">
            {blocks.filter(b => !b.id.includes('title')).map(block => (
               <div 
                 key={block.id} 
                 onClick={() => setSelectedBlockId(block.id)}
                 className={`p-6 rounded-3xl transition-all cursor-pointer border-2 ${selectedBlockId === block.id ? 'border-primary bg-white shadow-2xl scale-[1.01]' : 'border-transparent hover:bg-slate-50/80'}`}
               >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{block.label}</span>
                  </div>
                  {block.type === 'image' ? (
                     <img src={block.value} className="w-full rounded-2xl shadow-lg" alt="Preview" />
                  ) : (
                     <div className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed text-justify preview-richtext-block" dangerouslySetInnerHTML={{ __html: block.value }} />
                  )}
               </div>
            ))}
          </div>
       </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-100 flex flex-col font-sans overflow-hidden text-slate-900">
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-30 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Page Layout Designer</span>
            <span className="text-sm font-bold text-white">{page.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-3 bg-slate-800/50 p-1 rounded-lg">
             <button onClick={() => setViewport('desktop')} className={`p-1.5 rounded ${viewport === 'desktop' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}><Monitor size={16}/></button>
             <button onClick={() => setViewport('tablet')} className={`p-1.5 rounded ${viewport === 'tablet' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}><Tablet size={16}/></button>
             <button onClick={() => setViewport('mobile')} className={`p-1.5 rounded ${viewport === 'mobile' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}><Smartphone size={16}/></button>
           </div>
           
           <div className="h-8 w-px bg-slate-800"></div>

           <select 
              value={status}
              onChange={(e) => { setStatus(e.target.value as any); setHasChanges(true); }}
              className="bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded border border-slate-700 outline-none cursor-pointer"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="private">Private</option>
            </select>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && <div className="flex items-center gap-1.5 text-amber-400 animate-pulse"><AlertCircle size={14} /><span className="text-[10px] font-bold uppercase">Modified</span></div>}
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-6 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-teal-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            Apply Changes
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Structure */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Page Blocks</h3>
             <div className="flex gap-1">
               <button onClick={() => handleAddBlock('richtext')} className="p-1.5 hover:bg-white hover:text-primary rounded-lg border border-transparent hover:border-slate-200 transition-all" title="Add Block"><AlignLeft size={14}/></button>
               <button onClick={() => handleAddBlock('image')} className="p-1.5 hover:bg-white hover:text-primary rounded-lg border border-transparent hover:border-slate-200 transition-all" title="Add Image"><ImageIcon size={14}/></button>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
             {(Object.entries(groupedBlocks) as [string, ContentBlock[]][]).map(([groupName, groupBlocks]) => (
                 <div key={groupName} className="space-y-1">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-2">{groupName}</p>
                   {groupBlocks.map((block) => (
                       <div key={block.id} className="relative group/node">
                         <button 
                          onClick={() => setSelectedBlockId(block.id)}
                          onMouseEnter={() => setHoveredBlockId(block.id)}
                          onMouseLeave={() => setHoveredBlockId(null)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                            selectedBlockId === block.id 
                              ? 'bg-primary text-white shadow-lg ring-4 ring-primary/10' 
                              : 'hover:bg-slate-50 text-slate-600'
                          }`}
                         >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedBlockId === block.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                              {block.type === 'richtext' ? <AlignLeft size={16}/> : block.type === 'image' ? <ImageIcon size={16}/> : <Type size={16}/>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <span className="text-xs font-bold truncate block">{block.label}</span>
                              <span className="text-[9px] uppercase font-black opacity-50 block">{block.type}</span>
                            </div>
                         </button>
                         <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-all ${hoveredBlockId === block.id && selectedBlockId !== block.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                           <button onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'up'); }} className="p-1 bg-white border rounded text-slate-400 hover:text-primary shadow-sm"><ChevronUp size={12}/></button>
                           <button onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'down'); }} className="p-1 bg-white border rounded text-slate-400 hover:text-primary shadow-sm"><ChevronDown size={12}/></button>
                           <button onClick={(e) => { e.stopPropagation(); setBlockToDelete(block.id); }} className="p-1 bg-white border rounded text-slate-400 hover:text-destructive shadow-sm"><Trash2 size={12}/></button>
                         </div>
                       </div>
                   ))}
                 </div>
             ))}
          </div>
        </aside>

        {/* Workspace */}
        <main className="flex-1 bg-slate-200 overflow-hidden flex flex-col items-center p-8">
           <div 
             className={`bg-white shadow-2xl transition-all duration-500 border border-slate-300 rounded-[2.5rem] overflow-hidden overflow-y-auto ${
               viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
             }`}
           >
              {renderGenericPreview()}
           </div>
        </main>

        {/* Properties */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
             <h3 className="text-sm font-bold text-slate-900">Properties</h3>
             {activeBlock && <div className="text-[10px] font-black px-2 py-0.5 bg-primary/10 text-primary rounded uppercase">{activeBlock.type}</div>}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {activeBlock ? (
              <div className="space-y-6">
                <div className="space-y-2">
                   <label className={labelClasses}>Block Label (Admin only)</label>
                   <input 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" 
                      value={activeBlock.label}
                      onChange={e => handleUpdateValue(activeBlock.id, activeBlock.value, undefined, e.target.value)}
                   />
                </div>

                {/* NEW: Link Property Editor */}
                <div className="space-y-2 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                   <label className={labelClasses + " text-primary"}>Target Link / URL</label>
                   <div className="relative group">
                      <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
                      <input 
                        className="w-full pl-8 pr-3 py-2 bg-white border border-primary/20 rounded-lg text-xs font-bold text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
                        value={activeBlock.metadata?.link || ''}
                        onChange={e => handleUpdateValue(activeBlock.id, activeBlock.value, { link: e.target.value })}
                        placeholder="e.g. /pricing or https://..."
                      />
                   </div>
                   <p className="text-[9px] text-slate-400 italic">Use <b>/path</b> for internal pages, or <b>https://</b> for external sites.</p>
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>Display Content / Label</label>
                  {activeBlock.type === 'image' ? (
                     <div className="relative group aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                        <img src={activeBlock.value} className="w-full h-full object-cover" alt="Node" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button onClick={() => setIsMediaSelectorOpen(true)} className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg">Change Image</button>
                        </div>
                     </div>
                  ) : (
                    <>
                      <textarea 
                        className="w-full min-h-[250px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-inner leading-relaxed"
                        value={activeBlock.value}
                        onChange={(e) => handleUpdateValue(activeBlock.id, e.target.value)}
                        placeholder="Content..."
                      />
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-300">
                 <MousePointer2 size={40} className="mb-4" />
                 <h4 className="text-sm font-bold text-slate-400">Select a block to edit</h4>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Confirmation Modals & Media Selector */}
      {blockToDelete && (
        <div className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-lg font-bold mb-2">Delete this section?</h3>
            <p className="text-sm text-slate-500 mb-8">This will remove the content from the page draft.</p>
            <div className="flex gap-3">
              <button onClick={() => setBlockToDelete(null)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button onClick={confirmDeleteBlock} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {isMediaSelectorOpen && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-8 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-4xl h-[600px] flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
                <h2 className="text-lg font-bold">Choose Image</h2>
                <button onClick={() => setIsMediaSelectorOpen(false)} className="text-slate-400"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-4 md:grid-cols-6 gap-4 custom-scrollbar">
                {mediaItems.filter(m => m.fileType === 'image').map(item => (
                  <button key={item.id} onClick={() => handleSelectMedia(item)} className="aspect-square rounded-2xl overflow-hidden border border-slate-200 hover:border-primary transition-all">
                    <img src={item.url} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .preview-richtext-block h2 { font-family: 'Fraunces', serif; color: #0f172a; font-weight: bold; font-size: 1.5rem; margin: 1.5rem 0 1rem 0; }
        .preview-richtext-block p { margin-bottom: 1.25rem; }
        .preview-richtext-block strong { color: #0f172a; font-weight: 700; }
        .preview-richtext-block ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}} />
    </div>
  );
};

const DynamicIcon = ({ name, size, className }: { name: string; size: number; className?: string }) => {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon size={size} className={className} />;
};

export default VisualEditor;
