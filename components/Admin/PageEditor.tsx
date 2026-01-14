import React, { useState } from 'react';
import { Save, X, Settings, Image as ImageIcon, Layout, Type, FileText } from 'lucide-react';

interface PageEditorProps {
  page: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ page, onSave, onClose }) => {
  const [blocks, setBlocks] = useState(page.blocks || []);

  const handleUpdateBlock = (id: string, newData: any) => {
    setBlocks(blocks.map((b: any) => b.id === id ? { ...b, data: newData } : b));
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900 flex animate-in slide-in-from-right duration-500">
      {/* Sidebar Editor */}
      <div className="w-80 bg-slate-800 text-slate-300 flex flex-col border-r border-slate-700">
        <div className="h-16 flex items-center px-6 justify-between border-b border-slate-700 bg-slate-800/50">
          <h3 className="font-bold text-white">Page Configuration</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-lg"><X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Page Title</label>
              <input type="text" defaultValue={page.title} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
           </div>

           <div className="space-y-4 pt-6 border-t border-slate-700">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Page Elements</h4>
              {blocks.map((block: any) => (
                <div key={block.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-700 group hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-primary uppercase">{block.type} Block</span>
                    <button className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"><Settings size={12}/></button>
                  </div>
                  
                  {block.type === 'hero' && (
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={block.data.heading} 
                        onChange={(e) => handleUpdateBlock(block.id, { ...block.data, heading: e.target.value })}
                        className="w-full bg-slate-800 text-xs px-2 py-1.5 rounded border border-slate-700" 
                      />
                      <textarea 
                         value={block.data.subheading}
                         onChange={(e) => handleUpdateBlock(block.id, { ...block.data, subheading: e.target.value })}
                         className="w-full bg-slate-800 text-[10px] px-2 py-1.5 rounded border border-slate-700 h-20"
                      ></textarea>
                    </div>
                  )}
                </div>
              ))}
           </div>
        </div>

        <div className="p-6 border-t border-slate-700">
           <button 
            onClick={() => onSave({ ...page, blocks })}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
           >
              <Save size={18} /> Update Page
           </button>
        </div>
      </div>

      {/* Visual Preview */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-slate-800 flex items-center px-8 justify-between">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-700 rounded-lg text-xs font-bold text-slate-300">
                 <Layout size={14}/> Desktop View
              </div>
           </div>
           <div className="text-xs text-slate-500 font-mono">Live Preview (Staging)</div>
        </div>
        
        <div className="flex-1 bg-white overflow-y-auto p-12">
           <div className="max-w-5xl mx-auto shadow-2xl rounded-3xl overflow-hidden border border-slate-100">
              {/* This mimics the layout without duplicating actual component logic for safety */}
              <div className="bg-slate-50 p-20 text-center space-y-6">
                 {blocks.find((b:any) => b.type === 'hero')?.data.heading && (
                   <h1 className="text-5xl font-serif font-bold text-slate-900 leading-tight">
                      {blocks.find((b:any) => b.type === 'hero')?.data.heading}
                   </h1>
                 )}
                 {blocks.find((b:any) => b.type === 'hero')?.data.subheading && (
                   <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                      {blocks.find((b:any) => b.type === 'hero')?.data.subheading}
                   </p>
                 )}
                 <div className="pt-8">
                    <div className="w-40 h-12 bg-primary rounded-xl mx-auto"></div>
                 </div>
              </div>
              <div className="p-20 bg-white grid grid-cols-2 gap-12">
                 <div className="h-64 bg-slate-100 rounded-[2rem]"></div>
                 <div className="space-y-4">
                    <div className="h-4 w-1/4 bg-primary/10 rounded"></div>
                    <div className="h-8 w-full bg-slate-200 rounded-lg"></div>
                    <div className="h-4 w-3/4 bg-slate-200 rounded-lg"></div>
                    <div className="h-4 w-2/3 bg-slate-200 rounded-lg"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;