
import React from 'react';
import { Check, Zap, Rocket, HelpCircle, Coins } from 'lucide-react';
import * as Icons from 'lucide-react';
import { PageData } from '../types';

interface PricingProps {
  page?: PageData;
  onDynamicLink?: (path: string) => void;
}

const DynamicIcon = ({ name, size, className }: { name: string; size: number; className?: string }) => {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon size={size} className={className} />;
};

const Pricing: React.FC<PricingProps> = ({ page, onDynamicLink }) => {
  if (!page) return null;

  const headline = page.blocks.find(b => b.id === 'pricing-hero-title')?.value || 'Choose Your Plan';
  const subheadline = page.blocks.find(b => b.id === 'pricing-hero-desc')?.value || 'Flexible options to suit your workflow.';

  const planBlocks = page.blocks.filter(b => b.type === 'pricing-plan');
  const faqBlocks = page.blocks.filter(b => b.type === 'faq-item');

  const plans = planBlocks.map((block, idx) => {
    try {
      const data = JSON.parse(block.value);
      return {
        id: block.id,
        icon: <DynamicIcon name={data.icon || 'Rocket'} size={28} />,
        title: data.name,
        price: data.price,
        subtitle: data.description,
        features: data.features || [],
        buttonText: data.ctaText,
        buttonLink: data.link || block.metadata?.link || '#',
        highlight: data.highlight,
        isHighlighted: block.metadata?.highlighted,
        accentClass: data.ctaVariant === 'primary' ? 'text-primary' : data.ctaVariant === 'secondary' ? 'text-amber' : 'text-slate-600',
        bgClass: block.metadata?.highlighted ? 'bg-teal-50/30' : 'bg-white',
        btnClass: data.ctaVariant === 'primary' 
          ? 'bg-primary text-white hover:bg-teal-800' 
          : data.ctaVariant === 'secondary' 
            ? 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
            : 'bg-slate-900 text-white hover:bg-slate-800'
      };
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  const faqs = faqBlocks.map(block => {
    try {
      return JSON.parse(block.value);
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6">
            {headline.includes('Plan') ? (
              <>
                {headline.split('Plan')[0]}
                <span className="text-primary">Plan</span>
              </>
            ) : headline}
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            {subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan: any) => (
            <div key={plan.id} className={`relative group ${plan.bgClass} rounded-[2.5rem] p-10 border ${plan.isHighlighted ? 'border-primary/20 lg:-translate-y-4' : 'border-slate-200'} shadow-sm flex flex-col transition-all duration-300`}>
              {plan.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{plan.highlight}</div>}
              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${plan.accentClass} ${plan.isHighlighted ? 'bg-white shadow-sm' : 'bg-slate-50'} mb-6`}>{plan.icon}</div>
                <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">{plan.title}</h3>
                <p className="text-slate-500 font-medium text-sm">{plan.subtitle}</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-1"><span className="text-5xl font-serif font-bold text-slate-900">{plan.price}</span></div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature: string, i: number) => <li key={i} className="flex items-center gap-3"><Check size={12} className="text-success" /><span className="text-slate-700 text-sm font-medium">{feature}</span></li>)}
              </ul>
              <button 
                onClick={() => onDynamicLink?.(plan.buttonLink)}
                className={`w-full py-5 font-bold rounded-2xl transition-all ${plan.btnClass}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq: any, idx: number) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex gap-3 mb-2"><HelpCircle size={20} className="text-primary mt-0.5" /><h4 className="font-bold text-slate-900">{faq.question}</h4></div>
                <div className="text-slate-600 text-sm leading-relaxed pl-8" dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
