import React, { useState, useMemo } from 'react';
import { MessageSquare, Search, AlertTriangle } from 'lucide-react';
import { BlogPost, Category, ContentStatus, User } from '../../../types';

interface PostListProps {
  posts: BlogPost[];
  setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  categories: Category[];
  user: User | null;
  onEditPost: (post: BlogPost) => void;
  onNewPost: () => void;
}

const FlagVN = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shadow-sm">
    <rect width="16" height="12" fill="#DA251D"/>
    <path d="M8 3.5L8.73473 5.76066H11.1123L9.18878 7.15868L9.92351 9.41934L8 8.02132L6.07649 9.41934L6.81122 7.15868L4.8877 5.76066H7.26527L8 3.5Z" fill="#FFFF00"/>
  </svg>
);

const PostList: React.FC<PostListProps> = ({ posts, setPosts, categories, user, onEditPost, onNewPost }) => {
  const [postSearch, setPostSearch] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState<string>('all');
  const [postCategoryFilter, setPostCategoryFilter] = useState<string>('all');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [postsTabFilter, setPostsTabFilter] = useState<'All' | 'Mine' | 'Published' | 'Drafts' | 'Pillar'>('All');
  const [itemToTrash, setItemToTrash] = useState<string | null>(null);
  const [bulkActionToConfirm, setBulkActionToConfirm] = useState<{ action: string; ids: string[] } | null>(null);

  const stats = {
    all: posts.length,
    mine: posts.filter(p => p.authorId === user?.id).length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    pillar: posts.filter(p => (p.seoScore || 0) > 90).length
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = (post.title || '').toLowerCase().includes(postSearch.toLowerCase());
      const matchesStatus = postStatusFilter === 'all' || post.status === postStatusFilter;
      const matchesCategory = postCategoryFilter === 'all' || (post.categoryIds?.includes(postCategoryFilter) || false);
      
      let matchesTab = true;
      if (postsTabFilter === 'Published') matchesTab = post.status === 'published';
      if (postsTabFilter === 'Drafts') matchesTab = post.status === 'draft';
      if (postsTabFilter === 'Mine') matchesTab = post.authorId === user?.id;
      if (postsTabFilter === 'Pillar') matchesTab = (post.seoScore || 0) > 90;

      return matchesSearch && matchesStatus && matchesCategory && matchesTab;
    });
  }, [posts, postSearch, postStatusFilter, postCategoryFilter, postsTabFilter, user]);

  const handleBulkAction = (action: string) => {
    if (selectedPostIds.length === 0) return;
    if (action === 'delete') {
      setBulkActionToConfirm({ action: 'delete', ids: selectedPostIds });
    } else if (action === 'publish' || action === 'unpublish') {
      const newStatus = action === 'publish' ? 'published' : 'draft';
      setPosts(prev => prev.map(p => selectedPostIds.includes(p.id) ? { 
        ...p, 
        status: newStatus as ContentStatus, 
        updatedAt: new Date().toISOString().split('T')[0] 
      } : p));
      setSelectedPostIds([]);
    }
  };

  const executeBulkDelete = () => {
    if (bulkActionToConfirm) {
      setPosts(prev => prev.filter(p => !bulkActionToConfirm.ids.includes(p.id)));
      setSelectedPostIds([]);
      setBulkActionToConfirm(null);
    }
  };

  const executeTrash = () => {
    if (itemToTrash) {
      setPosts(prev => prev.filter(p => p.id !== itemToTrash));
      setItemToTrash(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-medium text-slate-800">Posts</h1>
        <button onClick={onNewPost} className="px-3 py-1 bg-white border border-[#2271b1] text-[#2271b1] text-[11px] font-bold rounded hover:bg-blue-50 transition-colors">Add New</button>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-slate-500">
        <button onClick={() => setPostsTabFilter('All')} className={`${postsTabFilter === 'All' ? 'font-bold text-slate-900' : 'hover:text-[#2271b1]'}`}>All ({stats.all})</button>
        <span className="mx-1 opacity-30">|</span>
        <button onClick={() => setPostsTabFilter('Mine')} className={`${postsTabFilter === 'Mine' ? 'font-bold text-slate-900' : 'hover:text-[#2271b1]'}`}>Mine ({stats.mine})</button>
        <span className="mx-1 opacity-30">|</span>
        <button onClick={() => setPostsTabFilter('Published')} className={`${postsTabFilter === 'Published' ? 'font-bold text-slate-900' : 'hover:text-[#2271b1]'}`}>Published ({stats.published})</button>
        <span className="mx-1 opacity-30">|</span>
        <button onClick={() => setPostsTabFilter('Drafts')} className={`${postsTabFilter === 'Drafts' ? 'font-bold text-slate-900' : 'hover:text-[#2271b1]'}`}>Drafts ({stats.drafts})</button>
        <span className="mx-1 opacity-30">|</span>
        <button onClick={() => setPostsTabFilter('Pillar')} className={`${postsTabFilter === 'Pillar' ? 'font-bold text-slate-900' : 'hover:text-[#2271b1]'}`}>Pillar ({stats.pillar})</button>
      </div>

      <div className="bg-[#f6f7f7] border border-slate-300 rounded p-2 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <select 
            onChange={(e) => handleBulkAction(e.target.value)}
            className="border border-slate-300 text-[11px] px-2 py-1 rounded bg-white outline-none"
            defaultValue=""
          >
            <option value="" disabled>Bulk actions</option>
            <option value="publish">Publish</option>
            <option value="unpublish">Unpublish</option>
            <option value="delete">Delete</option>
          </select>
          <button onClick={() => handleBulkAction('apply')} className="px-3 py-1 border border-slate-300 bg-white text-[11px] font-bold rounded hover:bg-slate-50">Apply</button>
          <div className="w-px h-4 bg-slate-300 mx-1"></div>
          <select 
            value={postCategoryFilter}
            onChange={(e) => setPostCategoryFilter(e.target.value)}
            className="border border-slate-300 text-[11px] px-2 py-1 rounded bg-white outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="px-3 py-1 border border-slate-300 bg-white text-[11px] font-bold rounded hover:bg-slate-50">Filter</button>
        </div>
        <div className="flex items-center gap-px border border-slate-300 rounded overflow-hidden">
           <input 
            type="text" 
            placeholder="Search Posts" 
            value={postSearch}
            onChange={(e) => setPostSearch(e.target.value)}
            className="px-3 py-1 text-[11px] outline-none bg-white w-48"
           />
           <button className="px-4 py-1 bg-white border-l border-slate-300 text-[11px] font-bold hover:bg-slate-50">Search</button>
        </div>
      </div>

      <div className="bg-white border border-slate-300 shadow-sm overflow-hidden rounded">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-white border-b border-slate-300 font-bold text-slate-800 uppercase text-[10px]">
            <tr>
              <th className="px-3 py-2 w-8"><input type="checkbox" className="rounded border-slate-300" /></th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2 text-center w-10"><FlagVN /></th>
              <th className="px-3 py-2 w-24">Author</th>
              <th className="px-3 py-2 w-32">Categories</th>
              <th className="px-3 py-2 w-32">Tags</th>
              <th className="px-3 py-2 text-center w-10"><MessageSquare size={14} className="text-slate-500 inline" /></th>
              <th className="px-3 py-2 w-32">Date</th>
              <th className="px-3 py-2 text-right w-24">SEO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPosts.map(post => (
              <tr key={post.id} className="hover:bg-[#f6f7f7] group transition-colors">
                <td className="px-3 py-4 align-top">
                  <input 
                    type="checkbox" 
                    checked={selectedPostIds.includes(post.id)}
                    onChange={(e) => setSelectedPostIds(e.target.checked ? [...selectedPostIds, post.id] : selectedPostIds.filter(id => id !== post.id))}
                    className="rounded border-slate-300" 
                  />
                </td>
                <td className="px-3 py-4 align-top">
                  <div className="space-y-1">
                    <button onClick={() => onEditPost(post)} className="font-bold text-[#2271b1] hover:text-[#135e96] block leading-tight text-left">
                      {post.title}
                    </button>
                    <div className="flex items-center gap-2 text-[10px] text-[#2271b1] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                       <button onClick={() => onEditPost(post)} className="hover:underline">Edit</button>
                       <span className="text-slate-300">|</span>
                       <button onClick={() => setItemToTrash(post.id)} className="text-red-600 hover:underline">Trash</button>
                       <span className="text-slate-300">|</span>
                       <button className="hover:underline">View</button>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 align-top text-center"><FlagVN /></td>
                <td className="px-3 py-4 align-top"><span className="text-[#2271b1] hover:underline cursor-pointer">{post.author}</span></td>
                <td className="px-3 py-4 align-top">
                   <div className="text-[#2271b1] flex flex-wrap gap-1">
                      {post.categoryIds && post.categoryIds.length > 0 ? post.categoryIds.map((cid, idx) => (
                        <span key={cid} className="hover:underline cursor-pointer">
                          {categories.find(c => c.id === cid)?.name || 'Unknown'}{idx < post.categoryIds.length - 1 ? ',' : ''}
                        </span>
                      )) : '—'}
                   </div>
                </td>
                <td className="px-3 py-4 align-top text-[#2271b1] hover:underline cursor-pointer">{post.tags?.join(', ') || '—'}</td>
                <td className="px-3 py-4 align-top text-center">
                  <div className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600 border border-slate-200">12</div>
                </td>
                <td className="px-3 py-4 align-top text-[11px] text-slate-500">
                   <p className="font-medium text-slate-700 capitalize">{post.status}</p>
                   <p className="leading-tight">{post.publishedAt || post.createdAt}</p>
                </td>
                <td className="px-3 py-4 align-top text-right">
                   <div className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-white ${post.seoScore && post.seoScore > 80 ? 'bg-success' : 'bg-amber'}`}>
                      {post.seoScore || '—'}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {(itemToTrash || bulkActionToConfirm) && (
        <div className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Trash Post?</h3>
            <p className="text-sm text-slate-500 mb-8 text-center leading-relaxed">
              {bulkActionToConfirm 
                ? `You are about to trash ${bulkActionToConfirm.ids.length} posts. Are you sure?` 
                : 'Are you sure you want to move this post to the trash? You can restore it later if needed.'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => { setItemToTrash(null); setBulkActionToConfirm(null); }} 
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={bulkActionToConfirm ? executeBulkDelete : executeTrash} 
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm"
              >
                Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;