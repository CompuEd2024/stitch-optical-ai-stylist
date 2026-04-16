'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Heart, User, Sparkles } from 'lucide-react';

const PERSONAS = [
  {
    id: 'business',
    icon: <Briefcase size={24} />,
    title: 'Business',
    description: 'Black or Tortoise Shell to exude confidence and professional authority.',
    color: 'bg-navy/5',
    activeColor: 'bg-navy text-offwhite',
    accent: 'border-navy',
  },
  {
    id: 'mature',
    icon: <User size={24} />,
    title: 'Modern Classic',
    description: 'Standard shapes with contemporary twists like matte finishes and titanium.',
    color: 'bg-gold/5',
    activeColor: 'bg-gold text-offwhite',
    accent: 'border-gold',
  },
  {
    id: 'creative',
    icon: <Sparkles size={24} />,
    title: 'Creative',
    description: 'Bold accents and unconventional geometries for the artistic visionary.',
    color: 'bg-charcoal/5',
    activeColor: 'bg-charcoal text-offwhite',
    accent: 'border-charcoal',
  },
  {
    id: 'lifestyle',
    icon: <Heart size={24} />,
    title: 'Lifestyle',
    description: 'High contrast between frame color and skin undertone for a distinct fashion statement.',
    color: 'bg-slate-muted/5',
    activeColor: 'bg-slate-muted text-offwhite',
    accent: 'border-slate-muted',
  }
];

export const StylistSelection = () => {
  const [active, setActive] = useState(PERSONAS[0].id);

  return (
    <section id="stylist-selection" className="py-24 bg-charcoal border-b border-border-gold">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-serif uppercase tracking-[3px] text-gold">Optical Stylist Personality</span>
          <h2 className="text-[48px] font-serif font-light text-offwhite tracking-tight mt-6 mb-8 leading-[1.1]">
            How do you want to <br />be <span className="text-gold italic underline decoration-gold/30">perceived?</span>
          </h2>
          <p className="text-text-muted text-[16px] leading-relaxed max-w-xl">
            Our imaging engine applies proprietary styling rules based on your chosen persona, face shape, and prescription complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border-gold">
          {PERSONAS.map((persona) => (
            <motion.div
              key={persona.id}
              onClick={() => setActive(persona.id)}
              className={`p-10 cursor-pointer transition-all duration-300 border-border-gold ${
                active === persona.id ? 'bg-white/5 border-b-4 border-b-gold' : 'hover:bg-white/2 grayscale opacity-50'
              }`}
            >
              <div className="mb-8 text-gold">{persona.icon}</div>
              <h3 className="text-[14px] uppercase tracking-[2px] mb-4 text-offwhite">{persona.title}</h3>
              <p className={`text-[12px] leading-relaxed ${active === persona.id ? 'text-offwhite/80' : 'text-text-muted'}`}>
                {persona.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          layout
          className="mt-16 p-12 bg-slate-panel border border-border-gold flex flex-col md:flex-row gap-12 items-center"
        >
          <div className="flex-1 space-y-6">
            <h4 className="text-[11px] uppercase tracking-[3px] text-gold font-bold">
              Current Rule: {active.toUpperCase()} MODE
            </h4>
            <div className="space-y-0">
              {[
                'Applying rule of opposites for facial balance',
                'Verifying bridge fit metrics for facial breadth',
                'Optimizing lens thickness for prescription constraints'
              ].map((rule, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-border-gold last:border-0 text-offwhite/70">
                  <div className="w-1 h-1 bg-gold rounded-full" />
                  <p className="text-[13px] font-medium tracking-tight">{rule}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-white/2 border border-border-gold flex items-center justify-center p-8 overflow-hidden relative">
             <div className="absolute inset-0 opacity-10">
               <svg className="w-full h-full stroke-gold fill-none" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="40" strokeWidth="0.5" />
                 <path d="M50 10 L50 90 M10 50 L90 50" strokeWidth="0.5" />
               </svg>
             </div>
             <motion.div
               key={active}
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-gold"
             >
               {PERSONAS.find(p => p.id === active)?.icon}
             </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
