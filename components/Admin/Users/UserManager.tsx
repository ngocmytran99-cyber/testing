
import React, { useState, useMemo } from 'react';
import { Plus, Search, Mail, Shield, ShieldCheck, MoreVertical, Edit2, Trash2, X, Eye, EyeOff, CheckCircle2, AlertTriangle, UserCircle } from 'lucide-react';
import { User, UserRole } from '../../../types';

interface UserManagerProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
}

const UserManager: React.FC<UserManagerProps> = ({ users, setUsers, currentUser }) => {
  const [search, setSearch] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleSaveUser = (user: User) => {
    setUsers(prev => {
      const exists = prev.some(u => u.id === user.id);
      if (exists) {
        return prev.map(u => u.id === user.id ? user : u);
      }
      return [user, ...prev];
    });
    setShowEditor(false);
    setEditingUser(null);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      if (userToDelete.id === currentUser?.id) {
        alert("You cannot delete your own account.");
        setUserToDelete(null);
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-medium text-slate-800">User Accounts</h1>
          <button 
            onClick={() => { setEditingUser(null); setShowEditor(true); }}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-primary/10"
          >
            <Plus size={14}/> Add New User
          </button>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all w-64 shadow-sm"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">User Info</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map(user => (
              <tr key={user.id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold overflow-hidden">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        {user.name}
                        {user.id === currentUser?.id && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase">You</span>}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail size={12}/> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    user.role === 'administrator' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {user.role === 'administrator' ? <ShieldCheck size={12}/> : <Shield size={12}/>}
                    {user.role}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-slate-500 font-medium">{user.lastLogin || 'Never'}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingUser(user); setShowEditor(true); }}
                      className="p-2 text-slate-400 hover:text-primary transition-colors" 
                      title="Edit User"
                    >
                      <Edit2 size={16}/>
                    </button>
                    <button 
                      onClick={() => setUserToDelete(user)}
                      className={`p-2 text-slate-400 hover:text-destructive transition-colors ${user.id === currentUser?.id ? 'cursor-not-allowed opacity-30' : ''}`}
                      disabled={user.id === currentUser?.id}
                      title="Delete User"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Editor Modal */}
      {showEditor && (
        <UserEditor 
          user={editingUser} 
          onSave={handleSaveUser} 
          onCancel={() => setShowEditor(false)} 
        />
      )}

      {/* Delete Confirmation */}
      {userToDelete && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Account?</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Are you sure you want to remove <strong>{userToDelete.name}</strong>? This action will permanently revoke their access to the CMS.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setUserToDelete(null)} 
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm} 
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

// --- Subcomponent: User Editor ---

interface UserEditorProps {
  user: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const UserEditor: React.FC<UserEditorProps> = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState<User>(user || {
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    email: '',
    role: 'editor',
    password: '',
    avatar: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-8 duration-500">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user ? 'Edit User Profile' : 'Create New System User'}</h2>
            <p className="text-xs text-slate-500 mt-1">Management of internal SprouX personnel</p>
          </div>
          <button onClick={onCancel} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex justify-center mb-4">
             <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 group-hover:border-primary group-hover:text-primary transition-all overflow-hidden">
                   {form.avatar ? <img src={form.avatar} className="w-full h-full object-cover" /> : <UserCircle size={40} />}
                </div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-[2rem] transition-opacity">
                   <Plus size={20} className="text-white" />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary transition-all"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary transition-all"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="john@sproux.ai"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Level (Role)</label>
            <div className="grid grid-cols-2 gap-3">
              <RoleSelector 
                label="Administrator" 
                desc="Full system access"
                active={form.role === 'administrator'} 
                onClick={() => setForm({...form, role: 'administrator'})} 
              />
              <RoleSelector 
                label="Editor" 
                desc="Content only"
                active={form.role === 'editor'} 
                onClick={() => setForm({...form, role: 'editor'})} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">User Password</label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary transition-all"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-teal-800 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18}/> {user ? 'Update Profile' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RoleSelector = ({ label, desc, active, onClick }: any) => (
  <button 
    type="button" 
    onClick={onClick}
    className={`p-4 rounded-2xl border text-left transition-all ${
      active 
        ? 'bg-primary/5 border-primary ring-4 ring-primary/5' 
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}
  >
    <div className={`text-xs font-black uppercase tracking-widest mb-0.5 ${active ? 'text-primary' : 'text-slate-900'}`}>{label}</div>
    <div className="text-[10px] text-slate-400 font-medium">{desc}</div>
  </button>
);

export default UserManager;
