
import React, { useState } from 'react';
import { ShieldCheck, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '../../types';

interface LoginProps {
  users: UserType[];
  onLoginSuccess: (user: UserType) => void;
  onBack: () => void;
}

const SprouXLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className} fill="currentColor">
    <path d="M239.3,92.5c-15.6,0-29.3,6.3-39.3,16.4l-30.7-30.7c17.5-17.5,41.7-28.3,68.4-28.3h61.3v82.7h-60.8l30.7,30.7c4.6-1,9.3-1.6,14.2-1.6 c31.8,0,57.7,25.8,57.7,57.7c0,31.8-25.8,57.7-57.7,57.7h-61.3v-82.7h60.8l-30.7-30.7c-4.6,1-9.3,1.6-14.2,1.6 c-31.8,0-57.7-25.8-57.7-57.7C181.6,118.3,207.5,92.5,239.3,92.5z" transform="translate(-70, -10)" />
    <path d="M195 130 L265 200 M265 130 L195 200" stroke="white" strokeWidth="35" strokeLinecap="square" transform="translate(-30, -15)" />
  </svg>
);

const Login: React.FC<LoginProps> = ({ users, onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Giả lập quá trình xác thực
    setTimeout(() => {
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        onLoginSuccess(foundUser);
        setIsLoading(false);
        // Chuyển hướng ngay lập tức sau khi thành công
        navigate('/admin');
      } else {
        setError('Invalid username or password.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-sm:max-w-sm max-w-sm">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-[1.25rem] shadow-xl flex items-center justify-center text-primary mb-4 border border-slate-200">
            <SprouXLogo className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">SprouX <span className="text-primary font-sans font-normal text-lg">Admin</span></h1>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-slate-900/10 border border-slate-200">
          {error && (
            <div className="mb-6 p-4 bg-destructive/5 border-l-4 border-destructive text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username or Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <UserIcon size={18} />
                </div>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-300"
                  placeholder="admin@sproux.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Remember Me</span>
              </label>
              <button type="button" className="text-sm font-medium text-primary hover:text-teal-800 transition-colors">Forgot Password?</button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-teal-800 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Log In
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
