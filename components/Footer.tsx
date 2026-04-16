'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Linkedin, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-charcoal border-t border-border-gold py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="text-2xl font-serif font-light tracking-[4px] text-gold uppercase">
              Stitch
            </Link>
            <p className="text-[12px] text-text-muted leading-relaxed font-medium">
              Redefining eyewear fitting through clinical precision and sophisticated AI analysis.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 border border-border-gold rounded-full text-gold hover:bg-gold hover:text-charcoal transition-all">
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-serif uppercase tracking-[3px] text-gold">Product</h4>
            <div className="flex flex-col gap-4">
              {['Collections', 'The Lab', 'Bespoke', 'Archives'].map((item) => (
                <Link key={item} href="#" className="text-[12px] font-medium text-text-muted hover:text-gold transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-serif uppercase tracking-[3px] text-gold">Company</h4>
            <div className="flex flex-col gap-4">
              {['About Us', 'For Shops', 'Scientific Board', 'Careers'].map((item) => (
                <Link key={item} href="#" className="text-[12px] font-medium text-text-muted hover:text-gold transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-serif uppercase tracking-[3px] text-gold">Legal</h4>
            <div className="flex flex-col gap-4">
              {['Privacy Policy', 'Terms of Service', 'Security Architecture', 'HIPAA'].map((item) => (
                <Link key={item} href="#" className="text-[12px] font-medium text-text-muted hover:text-gold transition-colors">{item}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-border-gold flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">
            © 2024 STITCH OPTICAL. MEDICAL-GRADE ENCRYPTION ENABLED.
          </p>
          <div className="flex gap-8 text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest text-gold">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> SENSORS READY</span>
            <span>V2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
