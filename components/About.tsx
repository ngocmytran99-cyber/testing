
import React, { useEffect } from 'react';
import { PageData } from '../types';

interface AboutProps {
  page?: PageData;
}

const About: React.FC<AboutProps> = ({ page }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!page) return null;

  const title = page.blocks.find(b => b.id.includes('title'))?.value || 'About SprouX';
  const content = page.blocks.find(b => b.id.includes('content'))?.value || '';

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">
            {title}
          </h1>
        </header>

        <div className="space-y-8 text-lg md:text-xl text-slate-600 leading-relaxed font-medium text-justify about-cms-content">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .about-cms-content p { margin-bottom: 2rem; }
        .about-cms-content strong { color: #0f172a; }
      `}} />
    </div>
  );
};

export default About;
