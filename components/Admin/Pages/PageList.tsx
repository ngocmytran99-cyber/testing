
import React from 'react';
import { Edit3, Eye, ChevronDown } from 'lucide-react';
import { PageData } from '../../../types';

interface PageListProps {
  pages: PageData[];
  onEdit: (page: PageData) => void;
  onStatusToggle: (id: string, newStatus: 'draft' | 'published' | 'private') => void;
}

const PageList: React.FC<PageListProps> = ({ pages, onEdit, onStatusToggle }) => {
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-slate-800">Pages</h1>
        <button className="px-3 py-1 bg-white border border-[#2271b1] text-[#2271b1] text-[11px] font-bold rounded hover:bg-blue-50 transition-colors">Add New Page</button>
      </div>

      <div className="bg-white border border-slate-300 shadow-sm overflow-hidden rounded">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-white border-b border-slate-300 font-bold text-slate-800 uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pages.map(page => (
              <tr key={page.id} className="hover:bg-slate-50 group">
                <td className="px-4 py-4">
                  <button onClick={() => onEdit(page)} className="font-bold text-[#2271b1] hover:text-[#135e96] block text-left">
                    {page.title}
                  </button>
                  <div className="flex items-center gap-2 text-[10px] text-[#2271b1] opacity-0 group-hover:opacity-100 transition-opacity font-medium mt-1">
                    <button onClick={() => onEdit(page)} className="hover:underline">Edit Content</button>
                    <span className="text-slate-300">|</span>
                    <button className="hover:underline">Quick Edit</button>
                    <span className="text-slate-300">|</span>
                    <button className="hover:underline text-red-600">Trash</button>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono text-slate-500 text-[11px]">{page.slug}</td>
                <td className="px-4 py-4">
                  <div className="relative inline-block group/status">
                    <select 
                      value={page.status}
                      onChange={(e) => onStatusToggle(page.id, e.target.value as any)}
                      className={`appearance-none px-2.5 py-1 pr-6 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none transition-all ${
                        page.status === 'published' ? 'bg-green-100 text-green-700 border-green-200' : 
                        page.status === 'private' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="private">Private</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-500 text-[11px]">{page.updatedAt}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEdit(page)} className="p-1.5 hover:bg-primary/5 text-slate-400 hover:text-primary rounded" title="Visual Edit">
                      <Edit3 size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 text-slate-400 rounded">
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageList;
