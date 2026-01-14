
import React, { useState } from 'react';
import { HelpDeskCategory, HelpDeskTopic, HelpDeskArticle } from '../../../types';
import { Edit3, Trash2, AlertTriangle, Plus, LayoutGrid, X } from 'lucide-react';
import * as Icons from 'lucide-react';

interface CategoryManagerProps {
  categories: HelpDeskCategory[];
  setCategories: React.Dispatch<React.SetStateAction<HelpDeskCategory[]>>;
  topics: HelpDeskTopic[];
  setTopics: React.Dispatch<React.SetStateAction<HelpDeskTopic[]>>;
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

const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  categories, setCategories, 
  topics, setTopics, 
  articles, setArticles 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<HelpDeskCategory>>({ 
    id: '', label: '', description: '', icon: 'Zap', audience: 'creator', order: 0
  });

  const handleSave = () => {
    if (!form.label || !form.id) return;
    
    const existsWithSameId = categories.some(c => c.id === form.id);
    if (!editingId && existsWithSameId) {
      setErrorMsg('Category ID (Document Name) must be unique. This ID already exists.');
      return;
    }

    setCategories(prev => {
      if (editingId) {
        // TRƯỜNG HỢP RENAME ID (ĐỔI TÊN DOCUMENT TRÊN FIREBASE)
        if (editingId !== form.id) {
          // 1. Cập nhật tất cả các Topics trỏ về ID cũ
          setTopics(prevTopics => prevTopics.map(t => 
            t.categoryId === editingId ? { ...t, categoryId: form.id! } : t
          ));

          // 2. Cập nhật tất cả các Articles trỏ về ID cũ
          setArticles(prevArticles => prevArticles.map(a => 
            a.category === editingId ? { ...a, category: form.id! } : a
          ));
          
          // Ghi chú: persistSetHdCategories trong App.tsx sẽ tự động xóa Document cũ (editingId) 
          // và tạo Document mới (form.id) vì editingId không còn trong list bản ghi mới.
        }
        return prev.map(c => c.id === editingId ? (form as HelpDeskCategory) : c);
      }
      return [...prev, form as HelpDeskCategory];
    });

    setForm({ id: '', label: '', description: '', icon: 'Zap', audience: 'creator', order: 0 });
    setEditingId(null);
    setErrorMsg(null);
  };

  const handleDelete = (id: string) => {
    if (topics.some(t => t.categoryId === id)) {
      setErrorMsg('Cannot delete category: It contains active topics. Please delete or move topics first.');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{editingId ? 'Edit Category' : 'Create New Category'}</h3>
           {editingId && (
             <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded text-[10px] font-bold border border-amber-100">
                <AlertTriangle size={12} />
                Changing ID will rename the document and auto-link child topics/articles.
             </div>
           )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <InputField 
            label="Document ID (Console Name)" 
            value={form.id} 
            onChange={v => setForm({...form, id: v})} 
            placeholder="e.g. 1_start" 
            helper="Use 1_, 2_ for sorting in Firebase Console"
          />
          <InputField label="Display Label" value={form.label} onChange={v => setForm({...form, label: v})} placeholder="e.g. Start as a Creator" />
          <SelectField label="Audience" value={form.audience} onChange={v => setForm({...form, audience: v as any})} options={[{v:'creator', l:'Creator'}, {v:'backer', l:'Backer'}]} />
          <InputField label="Web Sort Order" value={form.order} onChange={v => setForm({...form, order: parseInt(v) || 0})} placeholder="e.g. 1" type="number" />
          <InputField label="Icon Name" value={form.icon} onChange={v => setForm({...form, icon: v})} placeholder="e.g. Zap, Rocket..." />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
          <textarea 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all min-h-[60px]"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Help users understand what this category covers..."
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          {editingId && <button onClick={() => { setEditingId(null); setForm({id:'', label:'', description:'', icon:'Zap', audience:'creator', order: 0}); }} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>}
          <button onClick={handleSave} className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
            {editingId ? 'Save Changes' : <><Plus size={14}/> Add Category</>}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-4 py-3 w-16">Web Order</th>
              <th className="px-4 py-3">Console ID (ID Document)</th>
              <th className="px-4 py-3">Label (Tên hiển thị)</th>
              <th className="px-4 py-3">Audience</th>
              <th className="px-4 py-3">Topics</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[...categories].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map(cat => (
              <tr key={cat.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-4">
                  <span className="text-xs font-mono font-bold text-slate-400">#{cat.order || 0}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200 font-bold">{cat.id}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <RenderIcon name={cat.icon} size={16} />
                    </div>
                    <div className="text-sm font-bold text-slate-900">{cat.label}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    cat.audience === 'creator' ? 'bg-primary/10 text-primary' : 'bg-violet-100 text-violet-700'
                  }`}>
                    {cat.audience}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs font-bold text-slate-500">
                    {topics.filter(t => t.categoryId === cat.id).length} Topics
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(cat.id); setForm(cat); }} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Rename ID & Migration"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-destructive transition-colors" title="Delete Permanent"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

const InputField = ({ label, value, onChange, placeholder, disabled = false, type = "text", helper }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      type={type}
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

export default CategoryManager;
