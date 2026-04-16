'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { StylistSelection } from '@/components/StylistSelection';
import { ProductGrid } from '@/components/ProductGrid';
import { Footer } from '@/components/Footer';
import { motion } from 'motion/react';

const TrustBar = () => {
  return (
    <section className="bg-charcoal py-16 border-b border-border-gold">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-[10px] font-serif font-light text-text-muted tracking-[0.4em] uppercase mb-12">
          Trusted by leading optical shops & manufacturers
        </p>
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          {['LUMINA', 'VISTA', 'OPTIC.CO', 'FRAMEWORK', 'CLARITY'].map((brand) => (
            <div key={brand} className="text-2xl font-serif font-light text-offwhite tracking-[2px]">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-charcoal">
      <Header />
      <Hero />
      <TrustBar />
      
      <section id="how-it-works" className="py-32 bg-charcoal border-b border-border-gold">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <h2 className="text-5xl font-serif font-light text-offwhite mb-8 leading-[1.1] tracking-tight">
              Scientific precision, <br />
              <span className="text-gold italic underline decoration-gold/20">simplified for you.</span>
            </h2>
            <p className="text-text-muted text-[18px] leading-relaxed font-sans font-medium">
              Our three-step process combines clinical optometry standards with seamless mobile accessibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border-gold">
            {[
              { 
                step: '01', 
                title: 'Professional Scan', 
                desc: 'Use any smartphone camera to perform a high-fidelity 3D scan of your facial structure in under 30 seconds.' 
              },
              { 
                step: '02', 
                title: 'AI Analysis', 
                desc: 'Our neural network compares your data against 10,000+ frame styles to determine optimal bridge width and temple length.' 
              },
              { 
                step: '03', 
                title: 'Virtual Discovery', 
                desc: 'Browse a curated selection of frames that are guaranteed to fit your face comfortably and look naturally balanced.' 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="group p-12 border-border-gold md:border-r last:border-r-0 hover:bg-white/2 transition-colors"
              >
                <div className="text-[12px] font-mono font-bold text-gold mb-8 tracking-widest">
                  PHASE_{item.step}
                </div>
                <div className="relative z-10 space-y-4">
                  <h3 className="text-[16px] uppercase tracking-[2px] text-offwhite">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed text-[14px]">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StylistSelection />
      <ProductGrid />
      
      <Footer />
    </main>
  );
}
