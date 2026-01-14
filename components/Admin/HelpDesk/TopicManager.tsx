
import React, { useState } from 'react';
import { HelpDeskCategory, HelpDeskTopic, HelpDeskArticle } from '../../../types';
import { Edit3, Trash2, Plus, AlertTriangle, X } from 'lucide-react';
import * as Icons from 'lucide-react';

interface TopicManagerProps {
  topics: HelpDeskTopic[];
  setTopics: React.Dispatch<React.SetStateAction<HelpDeskTopic[]>>;
  categories: HelpDeskCategory[];
  articles: HelpDeskArticle[];
  setArticles: React.Dispatch<React.SetStateAction<HelpDeskArticle[]>>;
}

const RenderIcon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
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

const TopicManager: React.FC<TopicManagerProps> = ({ topics, setTopics, categories, articles, setArticles }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<HelpDeskTopic>>({ 
    id: '', categoryId: categories[0]?.id || '', label: '', description: '', icon: 'Info' 
  });

  const handleSave = () => {
    if (!form.label || !form.id || !form.categoryId) return;
    
    const exists = topics.some(t => t.id === form.id);
    if (exists && !editingId) {
      setErrorMsg('Topic ID must be unique. This ID is already in use.');
      return;
    }

    setTopics(prev => {
      if (editingId) {
        // Handle ID change (Document Rename)
        if (editingId !== form.id) {
          // Update all articles referencing this topic ID
          setArticles(prevArticles => prevArticles.map(a => 
            a.subcategory === editingId ? { ...a, subcategory: form.id! } : a
          ));
          
          // Persistence in App.tsx will delete old doc ID and create new one
        }
        return prev.map(t => t.id === editingId ? (form as HelpDeskTopic) : t);
      }
      return [...prev, form as HelpDeskTopic];
    });
    
    setForm({ id: '', categoryId: categories[0]?.id || '', label: '', description: '', icon: 'Info' });
    setEditingId(null);
    setErrorMsg(null);
  };

  const handleDelete = (id: string) => {
    if (articles.some(a => a.subcategory === id)) {
      setErrorMsg('Cannot delete topic: It contains active articles. Please delete or move articles first.');
      return;
    }
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{editingId ? 'Edit Topic' : 'Create New Topic'}</h3>
           {editingId && (
             <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded text-[10px] font-bold border border-amber-100">
                <AlertTriangle size={12} />
                Changing ID will rename the document and auto-link child articles.
             </div>
           )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField 
            label="Topic ID (Console Name)" 
            value={form.id} 
            onChange={(v:any) => setForm({...form, id: v})} 
            placeholder="e.g. 1_basics" 
            helper="Use 1_, 2_ for sorting in Firebase Console"
          />
          <InputField label="Display Label" value={form.label} onChange={(v:any) => setForm({...form, label: v})} placeholder="e.g. Platform Basics" />
          <SelectField label="Parent Category" value={form.categoryId} onChange={(v:any) => setForm({...form, categoryId: v})} options={categories.map(c => ({v:c.id, l:c.label}))} />
          <InputField label="Icon Name" value={form.icon} onChange={(v:any) => setForm({...form, icon: v})} placeholder="e.g. Info, rocket..." />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
          <textarea 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all min-h-[60px] shadow-sm"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Help users understand what this sub-topic covers..."
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          {editingId && <button onClick={() => { setEditingId(null); setForm({id:'', categoryId:categories[0]?.id, label:'', description:'', icon:'Info'}); }} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>}
          <button onClick={handleSave} className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
            {editingId ? 'Save Changes' : <><Plus size={14}/> Add Topic</>}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-4 py-3">Topic / ID</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Articles</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[...topics].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map(topic => (
              <tr key={topic.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <RenderIcon name={topic.icon} size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{topic.label}</div>
                      <div className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200 font-bold mt-0.5 inline-block">{topic.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs font-bold text-slate-600">
                    {categories.find(c => c.id === topic.categoryId)?.label || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs font-bold text-slate-500">
                    {articles.filter(a => a.subcategory === topic.id).length} Articles
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(topic.id); setForm(topic); }} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Rename ID & Migration"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(topic.id)} className="p-2 text-slate-400 hover:text-destructive transition-colors" title="Delete Permanent"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Validation / Error Modal */}
      {errorMsg && (
        <div className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Action Required</h3>
            <p className="text-sm text-slate-500 mb-8 text-center leading-relaxed">
              {errorMsg}
            </p>
            <button 
              onClick={() => setErrorMsg(null)} 
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-sm"
            >
              Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, disabled = false, helper }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      disabled={disabled}
      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all disabled:bg-slate-100 disabled:text-slate-400 shadow-sm"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {helper && <p className="text-[9px] text-slate-400 italic px-1">{helper}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, options }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <select 
      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all shadow-sm"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map((o:any) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

export default TopicManager;
