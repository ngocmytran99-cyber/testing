
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Position from './components/Solution';
import WhySprouX from './components/WhySprouX';
import CreatorsGrid from './components/CreatorsGrid';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Pricing from './components/Pricing';
import HowItWorks from './components/HowItWorks';
import HelpDesk from './components/HelpDesk';
import CMS from './components/Admin/CMS';
import Blog from './components/Blog';
import PostDetail from './components/PostDetail';
import About from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Disclaimer from './components/Disclaimer';
import Login from './components/Admin/Login';
import { FileQuestion, Home, Loader2, Sparkles } from 'lucide-react';
import { User, BlogPost, Category, MediaAttachment, PageData, ContentBlock, HelpDeskCategory, HelpDeskTopic, HelpDeskArticle, GlobalSettings, ViewType } from './types';

// Firebase Imports
import { initializeApp } from "@firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  writeBatch,
  deleteDoc
} from "@firebase/firestore";
import { getStorage } from "@firebase/storage";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoP5lKZFDBZu1bszUGQN6dfMAz2_0TzXA",
  authDomain: "sproux-webs.firebaseapp.com",
  projectId: "sproux-webs",
  storageBucket: "sproux-webs.firebasestorage.app",
  messagingSenderId: "604204906274",
  appId: "1:604204906274:web:e3a6cb654dd0510721577b",
  measurementId: "G-5ZX2QDP7NC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

(window as any).firebaseStorage = storage;
(window as any).firebaseDb = db;

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <Sparkles className="text-primary w-16 h-16 relative z-10 animate-bounce" />
    </div>
    <div className="flex items-center gap-3 text-slate-800 font-serif text-xl font-bold">
      <Loader2 className="animate-spin text-primary" size={24} />
      <span>Loading SprouX...</span>
    </div>
  </div>
);

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
        <FileQuestion size={40} />
      </div>
      <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-500 mb-8 text-center max-w-sm">
        The page you're looking for doesn't exist or is currently unavailable.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-teal-800 transition-all"
      >
        <Home size={18} /> Back to Home
      </button>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Page Wrappers ---

const HomePage = ({ pages }: { pages: PageData[] }) => {
  const page = pages.find(p => p.id === 'p-home');
  const navigate = useNavigate();
  
  if (!page) return <LoadingScreen />;
  if (page.status !== 'published') return <NotFound />;
  
  const content: Record<string, string> = {};
  const metadata: Record<string, any> = {};
  
  page.blocks.forEach(b => {
    content[b.id] = b.value;
    metadata[b.id] = b.metadata;
    if (b.type === 'image' && b.metadata?.alt) content[`${b.id}-alt`] = b.metadata.alt;
  });

  const handleDynamicLink = (path: string) => {
    if (!path) return;
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      navigate(cleanPath === '/home' ? '/' : cleanPath);
    }
  };

  return (
    <>
      <Hero onNavigate={(v) => navigate(v === 'home' ? '/' : `/${v}`)} content={content} metadata={metadata} onDynamicLink={handleDynamicLink} />
      <Problem content={content} />
      <Position content={content} />
      <WhySprouX content={content} />
      <CreatorsGrid content={content} metadata={metadata} onDynamicLink={handleDynamicLink} />
      <FinalCTA content={content} metadata={metadata} onNavigate={(v) => navigate(v === 'home' ? '/' : `/${v}`)} onDynamicLink={handleDynamicLink} />
    </>
  );
};

const PostDetailWrapper = ({ posts, user }: { posts: BlogPost[], user: User | null }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.slug === slug);
  if (!post) return <NotFound />;
  
  return (
    <PostDetail 
      post={post} 
      onBack={() => navigate(user ? '/admin' : '/blog')} 
    />
  );
};

const REQUIRED_PAGES: PageData[] = [
  { id: 'p-home', title: 'Home Page', slug: '/', status: 'published', updatedAt: '2024-03-20', blocks: [
    { id: 'nav-cta-text', type: 'text', value: 'Start free trial', label: 'Nav CTA Text', metadata: { group: 'Navigation', link: 'pricing' } },
    { id: 'nav-login-text', type: 'text', value: 'Login', label: 'Nav Login Text', metadata: { group: 'Navigation', link: '/admin/login' } },
    { id: 'nav-community-text', type: 'text', value: 'Community', label: 'Nav Community Text', metadata: { group: 'Navigation', link: '#' } },
    { id: 'hero-title', type: 'text', value: 'Turn Your <span class="gradient-text">Knowledge</span> Into <br /> <span class="gradient-text">Financial Autonomy</span>', label: 'Hero Headline', metadata: { group: 'Hero Section' } },
    { id: 'hero-cta-primary', type: 'text', value: 'Launch Your First Product', label: 'Hero Primary CTA', metadata: { group: 'Hero Section', link: 'pricing' } },
    { id: 'hero-cta-secondary', type: 'text', value: 'See How It Works', label: 'Hero Secondary CTA', metadata: { group: 'Hero Section', link: 'how-it-works' } },
    { id: 'creators-title', type: 'text', value: 'Join the New Generation of Knowledge Entrepreneurs', label: 'Creators Section Title', metadata: { group: 'Creators Section' } },
    { id: 'creators-cta', type: 'text', value: 'Be Our Co-Creator', label: 'Creators Main CTA', metadata: { group: 'Creators Section', link: '#' } },
    { id: 'cta-btn', type: 'text', value: 'Launch Now', label: 'Home Final CTA Button', metadata: { group: 'Final CTA', link: 'pricing' } }
  ] },
  { id: 'p-pricing', title: 'Pricing', slug: '/pricing', status: 'published', updatedAt: '2024-03-20', blocks: [] },
  { id: 'p-blog', title: 'Blog Page', slug: '/blog', status: 'published', updatedAt: '2024-03-20', blocks: [] },
  { id: 'p-help', title: 'Help Desk', slug: '/help', status: 'published', updatedAt: '2024-03-20', blocks: [] }
];

const DEFAULT_SETTINGS: GlobalSettings = {
  siteTitle: 'SprouX', tagline: 'Turn Knowledge into Financial Autonomy', siteIcon: '', headerLogo: '', footerLogo: '',
  siteUrl: 'https://sproux.ai', adminEmail: 'admin@sproux.com', defaultRole: 'Administrator', language: 'English (United States)',
  timezone: 'UTC+7', defaultCategory: 'Uncategorized', defaultFormat: 'Standard', defaultEditor: 'classic', allowEditorSwitch: false,
  mailServer: 'mail.example.com', mailPort: 110, mailLogin: 'login@example.com', mailPassword: '', updateServices: 'https://rpc.pingomatic.com/',
  homepageDisplay: 'posts', pageOnFront: 'Home', pageForPosts: '— Select —', postsPerPage: 10, postsInFeed: 10, feedFullText: true,
  searchEngineVisibility: false, allowComments: true, requireNameEmail: true, requireLogin: false, moderationKeys: '',
  thumbWidth: 150, thumbHeight: 150, organizeUploads: true, permalinkStructure: 'postname', privacyPageId: '7'
};

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaAttachment[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [hdCategories, setHdCategories] = useState<HelpDeskCategory[]>([]);
  const [hdTopics, setHdTopics] = useState<HelpDeskTopic[]>([]);
  const [hdArticles, setHdArticles] = useState<HelpDeskArticle[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const postsRef = useRef(posts);
  const pagesRef = useRef(pages);
  const categoriesRef = useRef(categories);
  const usersRef = useRef(users);
  useEffect(() => { postsRef.current = posts; pagesRef.current = pages; categoriesRef.current = categories; usersRef.current = users; }, [posts, pages, categories, users]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collections = ['posts', 'categories', 'mediaItems', 'pages', 'hdCategories', 'hdTopics', 'hdArticles', 'users', 'settings'];
        const snapshots = await Promise.all(collections.map(c => getDocs(collection(db, c))));
        
        const data: any = {};
        snapshots.forEach((snap, idx) => {
          data[collections[idx]] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });

        // Ensure state is updated before Seeding check
        setPosts(data.posts);
        setCategories(data.categories);
        setMediaItems(data.mediaItems);
        setPages(data.pages);
        setHdCategories(data.hdCategories);
        setHdTopics(data.hdTopics);
        setHdArticles(data.hdArticles);
        setUsers(data.users);
        const globalSet = data.settings.find((s: any) => s.id === 'global');
        if (globalSet) setGlobalSettings(prev => ({ ...prev, ...globalSet }));

        // SEEDING LOGIC: Cực kỳ quan trọng để ko bị 404 khi deploy mới
        const missingPages = REQUIRED_PAGES.filter(rp => !data.pages.some((p: any) => p.id === rp.id));
        if (missingPages.length > 0) {
          const batch = writeBatch(db);
          missingPages.forEach(mp => batch.set(doc(db, 'pages', mp.id), mp));
          await batch.commit(); // Phải đợi Firebase hoàn tất
          setPages(prev => [...prev, ...missingPages]);
        }

        if (data.users.length === 0) {
          const admin = { id: 'admin-01', email: 'admin@sproux.com', name: 'Trần Ngọc Mỹ', role: 'administrator', password: 'admin123', lastLogin: 'Today' };
          await setDoc(doc(db, 'users', admin.id), admin);
          setUsers([admin as User]);
        }

        setIsInitializing(false);
      } catch (error) {
        console.error("Initialization error:", error);
        setIsInitializing(false);
      }
    };
    fetchData();
  }, []);

  const persistSetPages = async (val: PageData[] | ((prev: PageData[]) => PageData[])) => {
    const nextValue = typeof val === 'function' ? val(pagesRef.current) : val;
    setPages(nextValue);
    const batch = writeBatch(db);
    nextValue.forEach(page => batch.set(doc(db, 'pages', page.id), page));
    await batch.commit();
  };

  if (isInitializing) return <LoadingScreen />;

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen selection:bg-teal-100 selection:text-teal-900 flex flex-col">
        <Routes>
          <Route element={
            <div className="flex flex-col min-h-screen">
              <Navbar 
                onNavigate={(v) => window.location.hash = v} 
                currentView={window.location.hash.split('/')[1] || 'home'} 
                user={user} onLogout={() => setUser(null)} logoUrl={globalSettings.headerLogo} 
                categories={categories}
              />
              <main className="flex-grow"><Outlet /></main>
              <Footer onNavigate={(v) => window.location.hash = v} settings={globalSettings} />
            </div>
          }>
            <Route path="/" element={<HomePage pages={pages} />} />
            <Route path="/pricing" element={<Pricing page={pages.find(p => p.id === 'p-pricing')} />} />
            <Route path="/how-it-works" element={<HowItWorks onNavigate={(v: any) => window.location.hash = v} page={pages.find(p => p.id === 'p-how-it-works')} />} />
            <Route path="/blog" element={<Blog posts={posts.filter(p => p.status === 'published')} categories={categories} page={pages.find(p => p.id === 'p-blog')} />} />
            <Route path="/article/:slug" element={<PostDetailWrapper posts={posts} user={user} />} />
            <Route path="/help" element={<HelpDesk categories={hdCategories} topics={hdTopics} articles={hdArticles} page={pages.find(p => p.id === 'p-help')} />} />
            <Route path="/help/article/:articleSlug" element={<HelpDesk categories={hdCategories} topics={hdTopics} articles={hdArticles} page={pages.find(p => p.id === 'p-help')} />} />
            <Route path="/about" element={<About page={pages.find(p => p.id === 'p-about')} />} />
            <Route path="/privacy" element={<PrivacyPolicy page={pages.find(p => p.id === 'p-privacy')} />} />
            <Route path="/terms" element={<TermsOfService page={pages.find(p => p.id === 'p-terms')} />} />
            <Route path="/disclaimer" element={<Disclaimer page={pages.find(p => p.id === 'p-disclaimer')} />} />
          </Route>
          <Route path="/admin/login" element={<Login users={users} onLoginSuccess={setUser} onBack={() => window.location.hash = '/'} />} />
          <Route path="/admin/*" element={user ? <CMS user={user} onLogout={() => setUser(null)} pages={pages} setPages={persistSetPages} posts={posts} setPosts={() => {}} categories={categories} setCategories={() => {}} mediaItems={mediaItems} setMediaItems={() => {}} hdCategories={hdCategories} setHdCategories={() => {}} hdTopics={hdTopics} setHdTopics={() => {}} hdArticles={hdArticles} setHdArticles={() => {}} users={users} setUsers={() => {}} globalSettings={globalSettings} setGlobalSettings={() => {}} activeTab="dashboard" setActiveTab={() => {}} postsSubTab="all" setPostsSubTab={() => {}} isEditorOpen={false} setIsEditorOpen={() => {}} editingPost={null} setEditingPost={() => {}} onNavigate={() => {}} /> : <Navigate to="/admin/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
