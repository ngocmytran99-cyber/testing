
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

// --- Helper Components ---

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
  
  if (!page || page.status !== 'published') return <NotFound />;
  
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
      <Hero 
        onNavigate={(v) => navigate(v === 'home' ? '/' : `/${v}`)} 
        content={content} 
        metadata={metadata} 
        onDynamicLink={handleDynamicLink}
      />
      <Problem content={content} />
      <Position content={content} />
      <WhySprouX content={content} />
      <CreatorsGrid content={content} metadata={metadata} onDynamicLink={handleDynamicLink} />
      <FinalCTA 
        content={content} 
        metadata={metadata}
        onNavigate={(v) => navigate(v === 'home' ? '/' : `/${v}`)} 
        onDynamicLink={handleDynamicLink}
      />
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

const LoginPageWrapper = ({ users, setUser }: any) => {
  const navigate = useNavigate();
  return (
    <Login 
      users={users} 
      onLoginSuccess={setUser} 
      onBack={() => navigate('/')} 
    />
  );
};

// --- Layout Component ---

const PublicLayout = ({ user, onLogout, settings, categories, pages }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const currentView = pathParts[1] || 'home';

  // Extract navbar specific content from home page blocks
  const homePage = pages.find((p: any) => p.id === 'p-home');
  const navContent: Record<string, string> = {};
  const navMetadata: Record<string, any> = {};
  
  if (homePage) {
    homePage.blocks.forEach((b: any) => {
      if (b.id.startsWith('nav-')) {
        navContent[b.id] = b.value;
        navMetadata[b.id] = b.metadata;
      }
    });
  }

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
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onNavigate={(v) => navigate(v === 'home' ? '/' : `/${v}`)} 
        currentView={currentView} 
        user={user} 
        onLogout={onLogout} 
        logoUrl={settings.headerLogo} 
        categories={categories}
        onDynamicLink={handleDynamicLink}
        content={navContent}
        metadata={navMetadata}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <div className="mt-auto">
        <Footer 
          onNavigate={(v) => navigate(v === 'home' ? '/' : `/${v}`)} 
          settings={settings} 
        />
      </div>
    </div>
  );
};

const DEFAULT_SETTINGS: GlobalSettings = {
  siteTitle: 'SprouX',
  tagline: 'Turn Knowledge into Financial Autonomy',
  siteIcon: '',
  headerLogo: '',
  footerLogo: '',
  siteUrl: 'https://sproux.ai',
  adminEmail: 'admin@sproux.com',
  defaultRole: 'Administrator',
  language: 'English (United States)',
  timezone: 'UTC+7',
  defaultCategory: 'Uncategorized',
  defaultFormat: 'Standard',
  defaultEditor: 'classic',
  allowEditorSwitch: false,
  mailServer: 'mail.example.com',
  mailPort: 110,
  mailLogin: 'login@example.com',
  mailPassword: '',
  updateServices: 'https://rpc.pingomatic.com/',
  homepageDisplay: 'posts',
  pageOnFront: 'Home',
  pageForPosts: '— Select —',
  postsPerPage: 10,
  postsInFeed: 10,
  feedFullText: true,
  searchEngineVisibility: false,
  allowComments: true,
  requireNameEmail: true,
  requireLogin: false,
  moderationKeys: '',
  thumbWidth: 150,
  thumbHeight: 150,
  organizeUploads: true,
  permalinkStructure: 'postname',
  privacyPageId: '7'
};

const REQUIRED_PAGES: PageData[] = [
  { id: 'p-home', title: 'Home Page', slug: '/', status: 'published', updatedAt: '2024-03-20', blocks: [
    // Navbar Blocks
    { id: 'nav-cta-text', type: 'text', value: 'Start free trial', label: 'Nav CTA Text', metadata: { group: 'Navigation', link: 'pricing' } },
    { id: 'nav-login-text', type: 'text', value: 'Login', label: 'Nav Login Text', metadata: { group: 'Navigation', link: '/admin/login' } },
    { id: 'nav-community-text', type: 'text', value: 'Community', label: 'Nav Community Text', metadata: { group: 'Navigation', link: '#' } },
    // Hero Blocks
    { id: 'hero-title', type: 'text', value: 'Turn Your <span class="gradient-text">Knowledge</span> Into <br /> <span class="gradient-text">Financial Autonomy</span>', label: 'Hero Headline', metadata: { group: 'Hero Section' } },
    { id: 'hero-cta-primary', type: 'text', value: 'Launch Your First Product', label: 'Hero Primary CTA', metadata: { group: 'Hero Section', link: 'pricing' } },
    { id: 'hero-cta-secondary', type: 'text', value: 'See How It Works', label: 'Hero Secondary CTA', metadata: { group: 'Hero Section', link: 'how-it-works' } },
    // Creators Blocks
    { id: 'creators-title', type: 'text', value: 'Join the New Generation of Knowledge Entrepreneurs', label: 'Creators Section Title', metadata: { group: 'Creators Section' } },
    { id: 'creators-cta', type: 'text', value: 'Be Our Co-Creator', label: 'Creators Main CTA', metadata: { group: 'Creators Section', link: '#' } },
    { id: 'creator-1-link', type: 'text', value: 'View Profile', label: 'Creator 1 Profile Link', metadata: { group: 'Creators Section', link: '#' } },
    { id: 'creator-2-link', type: 'text', value: 'View Profile', label: 'Creator 2 Profile Link', metadata: { group: 'Creators Section', link: '#' } },
    { id: 'creator-3-link', type: 'text', value: 'View Profile', label: 'Creator 3 Profile Link', metadata: { group: 'Creators Section', link: '#' } },
    // Final CTA
    { id: 'cta-btn', type: 'text', value: 'Launch Now', label: 'Home Final CTA Button', metadata: { group: 'Final CTA', link: 'pricing' } }
  ] },
  { id: 'p-how-it-works', title: 'How It Works', slug: '/how-it-works', status: 'published', updatedAt: '2024-03-20', blocks: [
    { id: 'hiw-hero-cta', type: 'text', value: 'Get Started', label: 'HIW Hero CTA', metadata: { group: 'Hero Section', link: 'pricing' } },
    { id: 'hiw-fcta-btn', type: 'text', value: 'Begin My Launch', label: 'HIW Final CTA Button', metadata: { group: 'Final CTA', link: 'pricing' } }
  ] },
  { id: 'p-pricing', title: 'Pricing', slug: '/pricing', status: 'published', updatedAt: '2024-03-20', blocks: [] },
  { id: 'p-blog', title: 'Blog Page', slug: '/blog', status: 'published', updatedAt: '2024-03-20', blocks: [] },
  { id: 'p-help', title: 'Help Desk', slug: '/help', status: 'published', updatedAt: '2024-03-20', blocks: [
    { id: 'help-contact-chat', type: 'text', value: 'Chat with us', label: 'Help Contact Chat Btn', metadata: { group: 'Contact Section', link: '#' } },
    { id: 'help-contact-email', type: 'text', value: 'Email Support', label: 'Help Contact Email Btn', metadata: { group: 'Contact Section', link: 'mailto:support@sproux.ai' } }
  ] },
  { id: 'p-about', title: 'About SprouX', slug: '/about', status: 'published', updatedAt: '2024-03-20', blocks: [] },
  { id: 'p-privacy', title: 'Privacy Policy', slug: '/privacy', status: 'published', updatedAt: '2024-03-20', blocks: [] },
  { id: 'p-terms', title: 'Terms of Service', slug: '/terms', status: 'published', updatedAt: '2024-03-20', blocks: [] },
  { id: 'p-disclaimer', title: 'Disclaimer', slug: '/disclaimer', status: 'published', updatedAt: '2024-03-20', blocks: [] }
];

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaAttachment[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [hdCategories, setHdCategories] = useState<HelpDeskCategory[]>([]);
  const [hdTopics, setHdTopics] = useState<HelpDeskTopic[]>([]);
  const [hdArticles, setHdArticles] = useState<HelpDeskArticle[]>([]);

  // Refs for tracking latest state to prevent stale closure issues
  const postsRef = useRef(posts);
  const pagesRef = useRef(pages);
  const categoriesRef = useRef(categories);
  const hdCategoriesRef = useRef(hdCategories);
  const hdTopicsRef = useRef(hdTopics);
  const hdArticlesRef = useRef(hdArticles);
  const usersRef = useRef(users);

  useEffect(() => { postsRef.current = posts; }, [posts]);
  useEffect(() => { pagesRef.current = pages; }, [pages]);
  useEffect(() => { categoriesRef.current = categories; }, [categories]);
  useEffect(() => { hdCategoriesRef.current = hdCategories; }, [hdCategories]);
  useEffect(() => { hdTopicsRef.current = hdTopics; }, [hdTopics]);
  useEffect(() => { hdArticlesRef.current = hdArticles; }, [hdArticles]);
  useEffect(() => { usersRef.current = users; }, [users]);

  // CMS UI state
  const [cmsTab, setCmsTab] = useState<'dashboard' | 'posts' | 'pages' | 'media' | 'settings' | 'helpdesk' | 'users'>('dashboard');
  const [cmsPostsSubTab, setCmsPostsSubTab] = useState<'all' | 'add' | 'categories'>('all');
  const [cmsIsEditorOpen, setCmsIsEditorOpen] = useState(false);
  const [cmsEditingPost, setCmsEditingPost] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colConfigs = [
          { name: 'posts', setter: setPosts },
          { name: 'categories', setter: setCategories },
          { name: 'mediaItems', setter: setMediaItems },
          { name: 'pages', setter: setPages },
          { name: 'hdCategories', setter: setHdCategories },
          { name: 'hdTopics', setter: setHdTopics },
          { name: 'hdArticles', setter: setHdArticles },
          { name: 'users', setter: setUsers },
          { name: 'settings', setter: (data: any) => {
            const settings = data.find((d: any) => d.id === 'global');
            if (settings) setGlobalSettings(prev => ({ ...prev, ...settings }));
          }}
        ];

        const results = await Promise.all(
          colConfigs.map(config => getDocs(collection(db, config.name)))
        );

        for (let i = 0; i < results.length; i++) {
          const snapshot = results[i];
          const config = colConfigs[i];
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          config.setter(data);

          if (config.name === 'pages') {
             const missing = REQUIRED_PAGES.filter(rp => !data.some(p => p.id === rp.id));
             if (missing.length > 0) {
               const batch = writeBatch(db);
               missing.forEach(mp => batch.set(doc(db, 'pages', mp.id), mp));
               await batch.commit();
               setPages(prev => [...prev, ...missing]);
             }
             
             const needsUpdate = data.filter(p => {
                const required = REQUIRED_PAGES.find(rp => rp.id === p.id);
                if (!required) return false;
                return required.blocks.some(rb => !p.blocks.some((b: any) => b.id === rb.id));
             });
             
             if (needsUpdate.length > 0) {
               const batch = writeBatch(db);
               needsUpdate.forEach(p => {
                  const required = REQUIRED_PAGES.find(rp => rp.id === p.id)!;
                  const newBlocks = [...p.blocks];
                  required.blocks.forEach(rb => {
                    if (!newBlocks.some((b: any) => b.id === rb.id)) newBlocks.push(rb);
                  });
                  batch.set(doc(db, 'pages', p.id), { ...p, blocks: newBlocks }, { merge: true });
               });
               await batch.commit();
               setPages(prev => prev.map(p => {
                  const up = needsUpdate.find(nu => nu.id === p.id);
                  if (!up) return p;
                  const required = REQUIRED_PAGES.find(rp => rp.id === p.id)!;
                  const nb = [...p.blocks];
                  required.blocks.forEach(rb => { if (!nb.some(b => b.id === rb.id)) nb.push(rb); });
                  return { ...p, blocks: nb };
               }));
             }
          }

          if (data.length === 0 && (config.name === 'users' || config.name === 'categories' || config.name === 'hdCategories' || config.name === 'hdTopics')) {
            await seedInitialData(config.name);
          }
        }

        setIsInitializing(false);
      } catch (error) {
        console.error("Firebase parallel fetch error:", error);
        setIsInitializing(false);
      }
    };
    fetchData();
  }, []);

  const seedInitialData = async (collectionName: string) => {
    const batch = writeBatch(db);
    let data: any[] = [];
    if (collectionName === 'users') {
      data = [{ id: 'admin-01', email: 'admin@sproux.com', name: 'Trần Ngọc Mỹ', role: 'administrator', password: 'admin123', lastLogin: 'Today, 10:45 AM' }];
    } else if (collectionName === 'categories') {
      data = [{ id: 'cat-1', name: 'Strategy', slug: 'strategy' }, { id: 'cat-2', name: 'AI Tools', slug: 'ai-tools' }];
    } else if (collectionName === 'hdCategories') {
      data = [
        { id: '1_start', label: 'Start as a Creator', description: 'Everything you need to set up your profile and start your journey.', icon: 'Rocket', audience: 'creator', order: 1 },
        { id: '2_launch', label: 'Launch & Run Your Campaign', description: 'Strategic guides on validation and pre-selling your expertise.', icon: 'Zap', audience: 'creator', order: 2 },
        { id: '3_deliver', label: 'Deliver & Get Paid', description: 'Understanding the delivery process and fund release workflow.', icon: 'ShieldCheck', audience: 'creator', order: 3 },
        { id: '4_trust', label: 'Trust & Disputes', description: 'Policy overview on how we protect both creators and backers.', icon: 'HelpCircle', audience: 'creator', order: 4 },
        { id: '5_account', label: 'Account & Access', description: 'Manage your settings, security, and team permissions.', icon: 'UserCircle', audience: 'creator', order: 5 },
        { id: '6_backer_basics', label: 'Backer Basics', description: 'How to support creators and manage your pledges.', icon: 'Heart', audience: 'backer', order: 6 },
        { id: '7_backer_trust', label: 'Safety & Verification', description: 'How we ensure your funds are used correctly and products delivered.', icon: 'ShieldCheck', audience: 'backer', order: 7 }
      ];
    } else if (collectionName === 'hdTopics') {
       data = [
         { id: '1_setup', categoryId: '1_start', label: 'Profile Setup', description: 'How to make your profile stand out.', icon: 'User' },
         { id: '2_verification', categoryId: '1_start', label: 'KYC & Verification', description: 'Secure your account identity.', icon: 'Shield' }
       ];
    } 
    for (const item of data) {
      const docRef = doc(db, collectionName, String(item.id || item.slug || 'default'));
      batch.set(docRef, item);
    }
    await batch.commit();
  };

  const persistGlobalSettings = async (settings: GlobalSettings) => {
    try {
      setGlobalSettings(settings);
      await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
    } catch (e) {
      alert("Failed to save global settings to Firebase.");
    }
  };

  const persistSetPosts = async (val: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => {
    try {
      const nextValue = typeof val === 'function' ? val(postsRef.current) : val;
      const removedIds = postsRef.current.map(p => String(p.id)).filter(id => !nextValue.map(nv => String(nv.id)).includes(id));
      setPosts(nextValue);
      const batch = writeBatch(db);
      nextValue.forEach(post => batch.set(doc(db, 'posts', String(post.id)), post));
      removedIds.forEach(id => batch.delete(doc(db, 'posts', id)));
      await batch.commit();
    } catch (e) {
      alert("Error persisting posts.");
    }
  };

  const persistSetPages = async (val: PageData[] | ((prev: PageData[]) => PageData[])) => {
    try {
      const nextValue = typeof val === 'function' ? val(pagesRef.current) : val;
      setPages(nextValue);
      const batch = writeBatch(db);
      nextValue.forEach(page => batch.set(doc(db, 'pages', page.id), page));
      await batch.commit();
    } catch (e) {
      alert("Error saving pages.");
    }
  };

  const persistSetCategories = async (val: Category[] | ((prev: Category[]) => Category[])) => {
    try {
      const nextValue = typeof val === 'function' ? val(categoriesRef.current) : val;
      const removedIds = categoriesRef.current.map(c => c.id).filter(id => !nextValue.map(nv => nv.id).includes(id));
      setCategories(nextValue);
      const batch = writeBatch(db);
      nextValue.forEach(cat => batch.set(doc(db, 'categories', cat.id), cat));
      removedIds.forEach(id => batch.delete(doc(db, 'categories', id)));
      await batch.commit();
    } catch (e) {
      alert("Error saving categories.");
    }
  };

  const persistSetHdCategories = async (val: HelpDeskCategory[] | ((prev: HelpDeskCategory[]) => HelpDeskCategory[])) => {
    try {
      const nextValue = typeof val === 'function' ? val(hdCategoriesRef.current) : val;
      const removedIds = hdCategoriesRef.current.map(c => c.id).filter(id => !nextValue.map(nv => String(nv.id)).includes(id));
      setHdCategories(nextValue);
      const batch = writeBatch(db);
      nextValue.forEach(cat => batch.set(doc(db, 'hdCategories', cat.id), cat));
      removedIds.forEach(id => batch.delete(doc(db, 'hdCategories', id)));
      await batch.commit();
    } catch (e) {
      alert("Failed to save Help Desk Categories.");
    }
  };

  const persistSetHdTopics = async (val: HelpDeskTopic[] | ((prev: HelpDeskTopic[]) => HelpDeskTopic[])) => {
    try {
      const nextValue = typeof val === 'function' ? val(hdTopicsRef.current) : val;
      const removedIds = hdTopicsRef.current.map(t => t.id).filter(id => !nextValue.map(nv => String(nv.id)).includes(id));
      setHdTopics(nextValue);
      const batch = writeBatch(db);
      nextValue.forEach(topic => batch.set(doc(db, 'hdTopics', topic.id), topic));
      removedIds.forEach(id => batch.delete(doc(db, 'hdTopics', id)));
      await batch.commit();
    } catch (e) {
      alert("Failed to save Help Desk Topics.");
    }
  };

  const persistSetHdArticles = async (val: HelpDeskArticle[] | ((prev: HelpDeskArticle[]) => HelpDeskArticle[])) => {
    try {
      const nextValue = typeof val === 'function' ? val(hdArticlesRef.current) : val;
      const removedIds = hdArticlesRef.current.map(a => String(a.id)).filter(id => !nextValue.map(nv => String(nv.id)).includes(id));
      setHdArticles(nextValue);
      const batch = writeBatch(db);
      nextValue.forEach(article => {
        if (!article.id) return;
        batch.set(doc(db, 'hdArticles', String(article.id)), article);
      });
      removedIds.forEach(id => {
        if (!id) return;
        batch.delete(doc(db, 'hdArticles', id));
      });
      await batch.commit();
    } catch (e) {
      alert("Could not save Help Desk Articles.");
    }
  };

  const persistSetUsers = async (val: User[] | ((prev: User[]) => User[])) => {
    try {
      const nextValue = typeof val === 'function' ? val(usersRef.current) : val;
      const removedIds = usersRef.current.map(u => u.id).filter(id => !nextValue.map(nv => String(nv.id)).includes(id));
      setUsers(nextValue);
      const batch = writeBatch(db);
      nextValue.forEach(u => batch.set(doc(db, 'users', u.id), u));
      removedIds.forEach(id => batch.delete(doc(db, 'users', id)));
      await batch.commit();
    } catch (e) {
      alert("Error saving users.");
    }
  };

  if (isInitializing) return <LoadingScreen />;

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen selection:bg-teal-100 selection:text-teal-900 flex flex-col">
        <Routes>
          <Route element={
            <PublicLayout 
              user={user} onLogout={() => setUser(null)} settings={globalSettings} categories={categories} pages={pages}
            />
          }>
            <Route path="/" element={<HomePage pages={pages} />} />
            <Route path="/pricing" element={<Pricing page={pages.find(p => p.id === 'p-pricing')} onDynamicLink={(path: string) => {
              if (path.startsWith('http')) window.open(path, '_blank');
              else window.location.hash = path;
            }} />} />
            <Route path="/how-it-works" element={<HowItWorks 
              page={pages.find(p => p.id === 'p-how-it-works')} 
              onNavigate={(v: any) => window.location.hash = v} 
            />} />
            <Route path="/blog" element={<Blog posts={posts.filter(p => p.status === 'published')} categories={categories} page={pages.find(p => p.id === 'p-blog')} />} />
            <Route path="/blog/category/:categorySlug" element={<Blog posts={posts.filter(p => p.status === 'published')} categories={categories} page={pages.find(p => p.id === 'p-blog')} />} />
            <Route path="/article/:slug" element={<PostDetailWrapper posts={posts} user={user} />} />
            <Route path="/help" element={<HelpDesk categories={hdCategories} topics={hdTopics} articles={hdArticles.filter(a => String(a.status || 'published') === 'published')} page={pages.find(p => p.id === 'p-help')} />} />
            <Route path="/help/category/:categoryId" element={<HelpDesk categories={hdCategories} topics={hdTopics} articles={hdArticles.filter(a => String(a.status || 'published') === 'published')} page={pages.find(p => p.id === 'p-help')} />} />
            <Route path="/help/topic/:topicId" element={<HelpDesk categories={hdCategories} topics={hdTopics} articles={hdArticles.filter(a => String(a.status || 'published') === 'published')} page={pages.find(p => p.id === 'p-help')} />} />
            <Route path="/help/article/:articleSlug" element={<HelpDesk categories={hdCategories} topics={hdTopics} articles={hdArticles.filter(a => String(a.status || 'published') === 'published')} page={pages.find(p => p.id === 'p-help')} />} />
            <Route path="/about" element={<About page={pages.find(p => p.id === 'p-about')} />} />
            <Route path="/privacy" element={<PrivacyPolicy page={pages.find(p => p.id === 'p-privacy')} />} />
            <Route path="/terms" element={<TermsOfService page={pages.find(p => p.id === 'p-terms')} />} />
            <Route path="/disclaimer" element={<Disclaimer page={pages.find(p => p.id === 'p-disclaimer')} />} />
          </Route>

          <Route path="/admin/login" element={<LoginPageWrapper users={users} setUser={setUser} />} />
          <Route 
            path="/admin/*" 
            element={
              user ? (
                <CMS 
                  onNavigate={(v) => {}} 
                  user={user} onLogout={() => setUser(null)}
                  posts={posts} setPosts={persistSetPosts}
                  categories={categories} setCategories={persistSetCategories}
                  mediaItems={mediaItems} setMediaItems={setMediaItems}
                  pages={pages} setPages={persistSetPages}
                  hdCategories={hdCategories} setHdCategories={persistSetHdCategories}
                  hdTopics={hdTopics} setHdTopics={persistSetHdTopics}
                  hdArticles={hdArticles} setHdArticles={persistSetHdArticles}
                  users={users} setUsers={persistSetUsers}
                  globalSettings={globalSettings} setGlobalSettings={persistGlobalSettings}
                  activeTab={cmsTab} setActiveTab={setCmsTab}
                  postsSubTab={cmsPostsSubTab} setPostsSubTab={setCmsPostsSubTab}
                  isEditorOpen={cmsIsEditorOpen} setIsEditorOpen={setCmsIsEditorOpen}
                  editingPost={cmsEditingPost} setEditingPost={setCmsEditingPost as any}
                />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            } 
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
