
import React, { useState } from 'react';
import { Upload, X, File as FileIcon, Loader2, Cloud, Plus } from 'lucide-react';
import { MediaAttachment, User } from '../../../types';
// Fixed: Using @firebase/storage instead of firebase/storage to match App.tsx and fix missing exports
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
// Fixed: Using @firebase/firestore instead of firebase/firestore to match App.tsx and fix missing exports
import { doc, setDoc } from "@firebase/firestore";

interface AddMediaProps {
  setMediaItems: React.Dispatch<React.SetStateAction<MediaAttachment[]>>;
  user: User | null;
  onComplete: () => void;
}

const AddMedia: React.FC<AddMediaProps> = ({ setMediaItems, user, onComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    const storage = (window as any).firebaseStorage;
    const db = (window as any).firebaseDb;
    
    if (!storage || !db) {
        alert("Firebase environment is not ready.");
        setUploading(false);
        return;
    }

    try {
      const uploadedItems: MediaAttachment[] = [];
      const filesArray = Array.from(files);

      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        setProgressText(`Uploading ${i + 1} of ${filesArray.length}: ${file.name}`);
        
        const fileRef = ref(storage, `media/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const firebaseUrl = await getDownloadURL(snapshot.ref);
        const newId = Math.random().toString(36).substr(2, 9);

        const newItem: MediaAttachment = {
          id: newId,
          fileName: file.name,
          fileType: file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : 'document',
          mimeType: file.type,
          fileSize: file.size,
          url: firebaseUrl,
          title: file.name.split('.')[0],
          uploadedBy: user?.name || 'Admin',
          createdAt: new Date().toISOString().split('T')[0]
        };

        // 1. Persistent Save (Firestore)
        await setDoc(doc(db, 'mediaItems', newId), newItem);
        
        // 2. Add to list
        uploadedItems.push(newItem);
      }

      setMediaItems(prev => [...uploadedItems, ...prev]);
      setUploading(false);
      onComplete();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload files to storage. Please check your connection.");
      setUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="animate-in fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Cloud size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-medium text-slate-800">Direct Cloud Upload</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Firebase Storage Persistence</p>
        </div>
      </div>
      
      <div 
        className={`w-full max-w-4xl mx-auto h-[400px] border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center p-12 transition-all duration-300 ${
          dragActive ? 'border-primary bg-primary/5 scale-[1.01] shadow-2xl shadow-primary/5' : 'border-slate-300 bg-white hover:border-slate-400 shadow-sm'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                <Loader2 size={64} className="text-primary animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
                <p className="text-xl font-serif font-bold text-slate-900">Uploading to SprouX Cloud...</p>
                <p className="text-sm font-medium text-slate-500 max-w-xs">{progressText}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-400 mb-8 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
              <Upload size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2 text-center">Drop assets to host securely</h2>
            <p className="text-slate-500 mb-10 text-center font-medium">Your files will be automatically optimized and served via CDN.</p>
            
            <div className="flex items-center gap-6">
                <label className="px-10 py-4 bg-primary text-white font-black rounded-2xl cursor-pointer hover:bg-teal-800 transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-2">
                <Plus size={18} /> Choose Files
                <input type="file" multiple className="hidden" onChange={onFileSelect} />
                </label>
                <div className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">or drag and drop</div>
            </div>
            
            <div className="mt-12 flex gap-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <div className="w-1.5 h-1.5 rounded-full bg-success"></div> Images
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div> Videos
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Documents
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddMedia;
