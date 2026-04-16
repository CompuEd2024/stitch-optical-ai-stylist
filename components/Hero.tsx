'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Fingerprint, ShieldCheck } from 'lucide-react';
import { FaceScannerModal, ScanResults } from './FaceScannerModal';

export const Hero = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [results, setResults] = useState<ScanResults>({
    ipd: '64.5mm',
    faceShape: 'Oval',
    symmetry: '0.982',
    bridgeWidth: '18.0mm',
    styleRecommendation: 'Balanced proportions suit angular geometric frames.'
  });

  const handleScanComplete = (newResults: ScanResults) => {
    setResults(newResults);
  };

  return (
    <section className="relative min-h-[768px] flex flex-col md:grid md:grid-cols-[1fr_400px] border-b border-border-gold overflow-hidden bg-charcoal mt-[97px]">
      {isScannerOpen && (
        <FaceScannerModal 
          key={isScannerOpen ? 'open' : 'closed'}
          isOpen={isScannerOpen} 
          onClose={() => setIsScannerOpen(false)} 
          onComplete={handleScanComplete}
        />
      )}

      {/* Left Column: Hero Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="p-[48px] flex flex-col justify-center border-r border-border-gold"
      >
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] uppercase tracking-[3px] text-gold mb-[16px]"
        >
          Aqueous Collection // 2024
        </motion.span>
        
        <h1 className="font-serif text-[64px] font-light leading-[1.1] mb-[24px] text-offwhite max-w-[600px]">
          The Science of Visionary Style.
        </h1>
        
        <p className="text-[16px] leading-[1.6] text-text-muted max-w-[480px] mb-[40px]">
          {results.styleRecommendation ? results.styleRecommendation : "Leveraging sub-millimeter IPD analysis and geometric facial mapping to create optical frames that aren't just worn—they are engineered for your unique structure."}
        </p>

        <div className="flex gap-[16px]">
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="bg-gold text-charcoal px-[32px] py-[16px] text-[12px] font-semibold uppercase tracking-[1.5px] hover:bg-gold-hover transition-colors"
          >
            Begin Scan
          </button>
          <button className="bg-transparent border border-gold text-gold px-[32px] py-[16px] text-[12px] font-semibold uppercase tracking-[1.5px] hover:bg-gold/5 transition-colors">
            View Lookbook
          </button>
        </div>
      </motion.div>

      {/* Right Column: Analysis Panel */}
      <section className="bg-slate-panel p-[48px] flex flex-col">
        <div className="text-[14px] uppercase tracking-[2px] mb-[32px] flex items-center gap-[12px] text-offwhite">
          <span className="w-2 h-2 rounded-full bg-gold" />
          Real-time Biometrics
        </div>
        
        <div className="space-y-[24px]">
          {[
            { label: 'Interpupillary Distance (IPD)', value: results.ipd },
            { label: 'Facial Symmetry Index', value: results.symmetry },
            { label: 'Face Shape Detected', value: results.faceShape },
            { label: 'Recommended Bridge', value: results.bridgeWidth },
          ].map((stat, i) => (
            <motion.div 
              key={results.ipd + i} // Re-animate on update
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-[16px] bg-white/5 border-l-2 border-gold"
            >
              <div className="text-[10px] uppercase text-text-muted mb-[4px] tracking-wider">{stat.label}</div>
              <div className="font-mono text-[20px] text-gold leading-none">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-auto border border-dashed border-border-gold p-6 flex items-center justify-center relative aspect-square md:aspect-auto h-[200px]">
          <svg className="w-[120px] h-[120px] stroke-gold opacity-50 transition-all" viewBox="0 0 24 24" fill="none" strokeWidth="0.5">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
            <circle cx="12" cy="12" r="3" />
            <path d="M8 12h8M12 8v8" />
          </svg>
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[1px] bg-gold shadow-[0_0_10px_#C5A059]" 
          />
          <div className="absolute bottom-2 text-[9px] text-gold tracking-widest uppercase font-bold">Sensors Active</div>
        </div>
      </section>
    </section>
  );
};
