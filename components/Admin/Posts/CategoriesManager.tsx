
import React, { useState } from 'react';
import { FileEdit, Trash2, AlertTriangle } from 'lucide-react';
import { Category, BlogPost } from '../../../types';

interface CategoriesManagerProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  posts: BlogPost[];
}

const CategoriesManager: React.FC<CategoriesManagerProps> = ({ categories, setCategories, posts }) => {
  const [catForm, setCatForm] = useState<Partial<Category>>({ name: '', slug: '', description: '', parentId: '' });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name) return;
    const slug = catForm.slug || generateSlug(catForm.name);
    
    if (categories.some(c => c.slug === slug && c.id !== catForm.id)) {
      alert('Category slug must be unique.');
      return;
    }

    const newCat: Category = {
      id: catForm.id || 'cat-' + Math.random().toString(36).substr(2, 5),
      name: catForm.name,
      slug: slug,
      description: catForm.description,
      parentId: catForm.parentId || undefined
    };

    if (catForm.id) {
      setCategories(categories.map(c => c.id === catForm.id ? newCat : c));
    } else {
      setCategories([...categories, newCat]);
    }
    setCatForm({ name: '', slug: '', description: '', parentId: '' });
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setCategories(categories.filter(c => c.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm sticky top-0">
          <h3 className="font-bold text-slate-900 mb-6">{catForm.id ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name</label>
              <input type="text" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="e.g. AI Strategy" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slug (URL)</label>
              <input type="text" value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="e.g. ai-strategy" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Category</label>
              <select 
                value={catForm.parentId || ''}
                onChange={(e) => setCatForm({ ...catForm, parentId: e.target.value || undefined })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="">None</option>
                {categories.filter(c => c.id !== catForm.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/10 hover:bg-teal-800 transition-all mt-4">
              {catForm.id ? 'Update Category' : 'Add Category'}
            </button>
            {catForm.id && <button type="button" onClick={() => setCatForm({ name: '', slug: '', description: '', parentId: '' })} className="w-full py-2 text-slate-400 font-bold hover:text-slate-600">Cancel</button>}
          </form>
        </div>
      </div>
      <div className="lg:col-span-2">
         <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Slug</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Posts</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {categories.map(cat => {
                   // FIXED: Added optional chaining to prevent crash if a post has no categoryIds
                   const count = posts.filter(p => p.categoryIds?.includes(cat.id)).length;
                   return (
                     <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-sm">
                            {cat.parentId && <span className="text-slate-300 mr-2">—</span>}
                            {cat.name}
                          </div>
                       </td>
                       <td className="px-6 py-4 text-sm font-mono text-slate-400">{cat.slug}</td>
                       <td className="px-6 py-4 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">{count}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setCatForm(cat)} className="p-2 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-lg transition-colors"><FileEdit size={16}/></button>
                            <button onClick={() => setItemToDelete(cat.id)} className="p-2 hover:bg-destructive/10 text-slate-400 hover:text-destructive rounded-lg transition-colors"><Trash2 size={16}/></button>
                          </div>
                       </td>
                     </tr>
                   );
                })}
              </tbody>
            </table>
         </div>
      </div>

      {/* Custom Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Delete Category?</h3>
            <p className="text-sm text-slate-500 mb-8 text-center leading-relaxed">
              Are you sure you want to delete this category? This action will not delete the posts within it, but they will be uncategorized.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;
