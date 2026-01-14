
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  ArrowLeft,
  Globe,
  CheckCircle2,
  X,
  LogOut,
  TrendingUp,
  Users as UsersIcon,
  LifeBuoy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Fixed: import ViewType from the central types file
import { User, BlogPost, Category, MediaAttachment, PageData, ContentBlock, HelpDeskCategory, HelpDeskTopic, HelpDeskArticle, GlobalSettings, ViewType } from '../../types';
import Settings, { SettingsTab } from './Settings';
import PostList from './Posts/PostList';
import PostEditor from './Posts/PostEditor';
import CategoriesManager from './Posts/CategoriesManager';
import MediaLibrary from './Media/MediaLibrary';
import PageList from './Pages/PageList';
import VisualEditor from './Pages/VisualEditor';
import HelpDeskManager from './HelpDesk/HelpDeskManager';
import UserManager from './Users/UserManager';

interface CMSProps {
  onNavigate: (view: ViewType) => void;
  user: User | null;
  onLogout?: () => void;
  posts: BlogPost[];
  setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  mediaItems: MediaAttachment[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaAttachment[]>>;
  pages: PageData[];
  setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
  // Help Desk Props
  hdCategories: HelpDeskCategory[];
  setHdCategories: React.Dispatch<React.SetStateAction<HelpDeskCategory[]>>;
  hdTopics: HelpDeskTopic[];
  setHdTopics: React.Dispatch<React.SetStateAction<HelpDeskTopic[]>>;
  hdArticles: HelpDeskArticle[];
  setHdArticles: React.Dispatch<React.SetStateAction<HelpDeskArticle[]>>;
  // Users management
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  // Global settings
  globalSettings: GlobalSettings;
  setGlobalSettings: (settings: GlobalSettings) => void;
  // Lifted UI State Props
  activeTab: 'dashboard' | 'posts' | 'pages' | 'media' | 'settings' | 'helpdesk' | 'users';
  setActiveTab: (tab: 'dashboard' | 'posts' | 'pages' | 'media' | 'settings' | 'helpdesk' | 'users') => void;
  postsSubTab: 'all' | 'add' | 'categories';
  setPostsSubTab: (subTab: 'all' | 'add' | 'categories') => void;
  isEditorOpen: boolean;
  setIsEditorOpen: (isOpen: boolean) => void;
  editingPost: Partial<BlogPost> | null;
  setEditingPost: (post: Partial<BlogPost> | null) => void;
  onPreviewPost?: (post: Partial<BlogPost>) => void;
}

const CMS: React.FC<CMSProps> = ({ 
  user, 
  onLogout, 
  posts, 
  setPosts, 
  categories, 
  setCategories,
  mediaItems,
  setMediaItems,
  pages,
  setPages,
  hdCategories, setHdCategories,
  hdTopics, setHdTopics,
  hdArticles, setHdArticles,
  users, setUsers,
  globalSettings,
  setGlobalSettings,
  // Lifted props
  activeTab, setActiveTab,
  postsSubTab, setPostsSubTab,
  isEditorOpen, setIsEditorOpen,
  editingPost, setEditingPost
}) => {
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsTab>('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeVisualPage, setActiveVisualPage] = useState<PageData | null>(null);
  const navigate = useNavigate();
  
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaPurpose, setMediaPurpose] = useState<'content' | 'cover'>('content');

  // Role Checks
  const isAdministrator = user?.role === 'administrator';

  const generateSlug = (text: string) => {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleEditPage = (page: PageData) => {
    const draft = JSON.parse(JSON.stringify(page)) as PageData;
    setActiveVisualPage(draft);
  };

  const handleSavePageContent = (id: string, updatedBlocks: ContentBlock[], status?: 'draft' | 'published' | 'private') => {
    const now = new Date().toISOString().split('T')[0];
    setPages(prevPages => prevPages.map(p => p.id === id ? { 
      ...p, 
      blocks: updatedBlocks, 
      status: status || p.status,
      updatedAt: now 
    } : p));
    setActiveVisualPage(null);
    alert('Changes published to live site successfully.');
  };

  const handleQuickStatusToggle = (id: string, newStatus: 'draft' | 'published' | 'private') => {
    const now = new Date().toISOString().split('T')[0];
    setPages(prevPages => prevPages.map(p => p.id === id ? { ...p, status: newStatus, updatedAt: now } : p));
  };

  const handleNewPost = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setEditingPost({
      id: newId,
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      author: user?.name || 'Admin',
      authorId: user?.id || 'guest',
      status: 'draft',
      publishedAt: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      categoryIds: [],
      tags: [],
      coverImage: '',
      seo: { title: '', description: '', ogTitle: '', ogDescription: '', canonical: '' },
      seoScore: 0
    });
    setPostsSubTab('add');
    setIsEditorOpen(true);
    setHasUnsavedChanges(false);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setPostsSubTab('add');
    setIsEditorOpen(true);
    setHasUnsavedChanges(false);
  };

  const handleSavePost = async (data: Partial<BlogPost>, shouldClose: boolean = false): Promise<void> => {
    if (!data.title) {
      alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }
    
    const finalSlug = data.slug || generateSlug(data.title || '');
    
    if (posts.some(p => p.slug === finalSlug && p.id !== data.id)) {
      alert('URL (Slug) này đã tồn tại. Vui lòng chọn một URL khác.');
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    
    const postData: BlogPost = {
      ...data,
      id: data.id || Math.random().toString(36).substr(2, 9),
      title: data.title || 'Untitled',
      slug: finalSlug,
      content: data.content || '',
      excerpt: data.excerpt || (data.content ? data.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' : ''),
      author: data.author || user?.name || 'Admin',
      authorId: data.authorId || user?.id || 'admin',
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? (data.publishedAt || now) : '',
      createdAt: data.createdAt || now,
      updatedAt: now,
      categoryIds: data.categoryIds || [],
      tags: data.tags || [],
      coverImage: data.coverImage || '',
      seoScore: data.seoScore || 0,
      seo: data.seo || { title: '', description: '' }
    } as BlogPost;

    setPosts(prevPosts => {
      const exists = prevPosts.some(p => p.id === postData.id);
      if (exists) {
        return prevPosts.map(p => p.id === postData.id ? postData : p);
      } else {
        return [postData, ...prevPosts];
      }
    });

    setHasUnsavedChanges(false);
    
    if (shouldClose) {
      setIsEditorOpen(false);
      setPostsSubTab('all');
      setEditingPost(null);
      alert('Bài viết đã được đăng thành công!');
    } else {
      setEditingPost(postData);
      alert('Bản nháp đã được lưu!');
    }
  };

  const openMediaLibrary = (purpose: 'content' | 'cover') => {
    setMediaPurpose(purpose);
    setShowMediaModal(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaPurpose === 'content') {
      if ((window as any).insertImageToEditor) {
        (window as any).insertImageToEditor(url);
      }
    } else {
      if (editingPost) {
        setEditingPost({...editingPost, coverImage: url});
        setHasUnsavedChanges(true);
      }
    }
    setShowMediaModal(false);
  };

  const stats = {
    all: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      {/* CMS Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
             <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">SprouX Admin</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Secure Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <SidebarLink icon={<LayoutDashboard size={18}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsEditorOpen(false); }} />
          
          <div className="space-y-1">
            <SidebarLink icon={<FileText size={18}/>} label="Posts" active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} />
            {activeTab === 'posts' && (
              <div className="pl-11 pr-4 space-y-1 py-1">
                <SubNavLink label="All Posts" active={postsSubTab === 'all' && !isEditorOpen} onClick={() => { setPostsSubTab('all'); setIsEditorOpen(false); }} />
                <SubNavLink label="Add New" active={postsSubTab === 'add' && isEditorOpen} onClick={handleNewPost} />
                <SubNavLink label="Categories" active={postsSubTab === 'categories'} onClick={() => { setPostsSubTab('categories'); setIsEditorOpen(false); }} />
              </div>
            )}
          </div>

          <SidebarLink icon={<Globe size={18}/>} label="Pages" active={activeTab === 'pages'} onClick={() => { setActiveTab('pages'); setIsEditorOpen(false); }} />
          
          <SidebarLink 
            icon={<LifeBuoy size={18}/>} 
            label="Help Desk" 
            active={activeTab === 'helpdesk'} 
            onClick={() => { setActiveTab('helpdesk'); setIsEditorOpen(false); }} 
          />

          <SidebarLink icon={<ImageIcon size={18}/>} label="Media Library" active={activeTab === 'media'} onClick={() => { setActiveTab('media'); setIsEditorOpen(false); }} />
          
          {isAdministrator && (
            <>
              <div className="h-4"></div>
              <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Management</p>
              
              <SidebarLink icon={<UsersIcon size={18}/>} label="Users" active={activeTab === 'users'} onClick={() => { setActiveTab('users'); setIsEditorOpen(false); }} />

              <div className="space-y-1">
                <SidebarLink icon={<SettingsIcon size={18}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                {activeTab === 'settings' && (
                  <div className="pl-11 pr-4 space-y-1 py-1">
                    {(['general', 'writing', 'reading', 'discussion', 'media', 'permalinks', 'privacy'] as SettingsTab[]).map(tab => (
                      <SubNavLink key={tab} label={tab.charAt(0).toUpperCase() + tab.slice(1)} active={settingsSubTab === tab} onClick={() => setSettingsSubTab(tab)} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800 space-y-2">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 w-full p-3 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Site
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 w-full p-3 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium text-slate-500"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-20 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900 capitalize">
              {activeTab === 'posts' ? (isEditorOpen ? (editingPost?.id ? 'Edit Post' : 'Add New Post') : 'Articles') : 
               activeTab === 'media' ? 'Media Library' :
               activeTab === 'pages' ? 'Page Content' :
               activeTab === 'helpdesk' ? 'Help Desk Module' :
               activeTab === 'users' ? 'User Management' :
               activeTab}
            </h2>
            {hasUnsavedChanges && (
              <span className="text-[10px] font-bold text-amber bg-amber/5 px-2 py-0.5 rounded-full border border-amber/10 animate-pulse italic">
                Unsaved Changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
               <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">{user?.name}</div>
                  <div className="text-[10px] font-bold text-primary uppercase">{user?.role}</div>
               </div>
               <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  {user?.name.charAt(0)}
               </div>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-100/30 p-8">
          {activeTab === 'posts' && postsSubTab === 'all' && !isEditorOpen && (
            <PostList 
              posts={posts} 
              setPosts={setPosts} 
              categories={categories} 
              user={user} 
              onEditPost={handleEditPost} 
              onNewPost={handleNewPost} 
            />
          )}

          {activeTab === 'posts' && postsSubTab === 'add' && isEditorOpen && editingPost && (
            <PostEditor 
              editingPost={editingPost}
              setEditingPost={setEditingPost as any}
              categories={categories}
              onSave={handleSavePost}
              openMediaLibrary={openMediaLibrary}
              setHasUnsavedChanges={setHasUnsavedChanges}
              onPreview={(post) => navigate(`/article/${post.slug}`)}
            />
          )}

          {activeTab === 'posts' && postsSubTab === 'categories' && (
            <CategoriesManager 
              categories={categories}
              setCategories={setCategories}
              posts={posts}
            />
          )}

          {activeTab === 'pages' && (
            <PageList 
              pages={pages} 
              onEdit={handleEditPage}
              onStatusToggle={handleQuickStatusToggle}
            />
          )}

          {activeTab === 'helpdesk' && (
            <HelpDeskManager 
              categories={hdCategories} setCategories={setHdCategories}
              topics={hdTopics} setTopics={setHdTopics}
              articles={hdArticles} setArticles={setHdArticles}
              mediaItems={mediaItems}
            />
          )}

          {activeTab === 'users' && isAdministrator && (
            <UserManager users={users} setUsers={setUsers} currentUser={user} />
          )}

          {activeTab === 'media' && (
            <MediaLibrary 
              mediaItems={mediaItems} 
              setMediaItems={setMediaItems} 
              user={user}
            />
          )}

          {activeTab === 'settings' && isAdministrator && (
            <Settings 
              activeSubTab={settingsSubTab} 
              globalSettings={globalSettings}
              setGlobalSettings={setGlobalSettings}
            />
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<TrendingUp className="text-primary"/>} label="Live Articles" value={stats.published.toString()} trend="+2 this month" />
                <StatCard icon={<UsersIcon className="text-violet"/>} label="Total Views" value="12,402" trend="+12%" />
                <StatCard icon={<FileText className="text-amber"/>} label="Drafts" value={stats.drafts.toString()} trend="Pending review" />
                <StatCard icon={<CheckCircle2 className="text-success"/>} label="Uptime" value="100%" trend="Healthy" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white w-full max-w-5xl h-[650px] flex flex-col shadow-2xl rounded-lg overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-[#f6f7f7]">
                 <div className="flex items-center space-x-8">
                    <h2 className="text-lg font-bold text-slate-700">Select Media ({mediaPurpose === 'content' ? 'Insert into Content' : 'Set Featured Image'})</h2>
                    <div className="flex space-x-6"><button className="px-2 py-2 text-sm border-b-2 border-blue-600 font-bold transition-colors">Library</button></div>
                 </div>
                 <button onClick={() => setShowMediaModal(false)} className="text-slate-400 hover:text-slate-800 p-1"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto bg-[#f0f0f1] p-8">
                 <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                    {mediaItems.map(item => (
                       <div key={item.id} className="aspect-square bg-white border-2 border-slate-200 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-all"
                        onClick={() => handleMediaSelect(item.url)}>
                          {item.fileType === 'image' ? <img src={item.url} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={24} /></div>}
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeVisualPage && (
        <VisualEditor 
          page={activeVisualPage}
          mediaItems={mediaItems}
          onSave={handleSavePageContent}
          onClose={() => setActiveVisualPage(null)}
        />
      )}
    </div>
  );
};

const SidebarLink: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-800 text-slate-400'}`}>
    {icon}<span>{label}</span>
  </button>
);

const SubNavLink: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${active ? 'text-primary bg-primary/5' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}>
    {label}
  </button>
);

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, trend: string }> = ({ icon, label, value, trend }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">{icon}</div>
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
    <p className="text-[10px] font-bold text-slate-400 mt-1">{trend}</p>
  </div>
);

export default CMS;