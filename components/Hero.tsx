'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Fingerprint, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { FaceScannerModal, ScanResults } from './FaceScannerModal';
import { getTopRecommendations, getInventoryFromDB, RecommendationResult } from '@/lib/recommendations';

export const Hero = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [results, setResults] = useState<ScanResults>({
    ipd: '64.5mm',
    faceShape: 'Oval',
    symmetry: '0.982',
    bridgeWidth: '18.0mm',
    styleRecommendation: 'Balanced proportions suit angular geometric frames.'
  });

  const handleScanComplete = async (newResults: ScanResults) => {
    setResults(newResults);
    setIsAnalyzing(true);
    try {
      const inventory = await getInventoryFromDB();
      const topMatches = getTopRecommendations(inventory, newResults, 3);
      setRecommendations(topMatches);
    } catch (err) {
      console.error("Recommendation fetch error:", err);
    } finally {
      setIsAnalyzing(false);
    }
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
          Envision Imaging Engine // V4.2
        </motion.span>
        
        <h1 className="font-serif text-[64px] font-light leading-[1.1] mb-[24px] text-offwhite max-w-[600px]">
          The Science of <br />
          <span className="text-gold italic">Visionary Style.</span>
        </h1>
        
        <p className="text-[16px] leading-[1.6] text-text-muted max-w-[480px] mb-[40px]">
          {results.styleRecommendation ? results.styleRecommendation : "Leveraging sub-millimeter IPD analysis and geometric facial mapping to create optical frames that aren't just worn—they are engineered for your unique structure."}
        </p>

        {results.scientificAnalysis && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-[40px] p-6 bg-gold/5 border border-gold/20 rounded-lg"
          >
            <h4 className="text-[10px] uppercase tracking-[3px] text-gold mb-3 flex items-center gap-2">
              <Fingerprint size={14} /> Comprehensive Geometric Analysis
            </h4>
            <div className="text-[14px] text-text-muted leading-relaxed font-sans max-h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gold/20">
              <div className="whitespace-pre-wrap">{results.scientificAnalysis}</div>
            </div>
            {results.facialDimensions && (
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gold/10 pt-4">
                {Object.entries(results.facialDimensions).map(([key, val]) => (
                  <div key={key}>
                    <div className="text-[9px] uppercase text-text-muted/60">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="text-[13px] text-gold font-mono">{val}mm</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {isAnalyzing && (
          <div className="mb-[40px] flex items-center justify-center p-12 border border-dashed border-gold/30 bg-gold/5">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="text-gold animate-spin" size={32} />
              <p className="text-[10px] uppercase tracking-[3px] text-gold font-bold">Matching Architectural Inventory...</p>
            </div>
          </div>
        )}

        {recommendations.length > 0 && !isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-[64px] space-y-12"
          >
            <h4 className="text-[10px] uppercase tracking-[4px] text-gold mb-8 flex items-center gap-2 font-bold border-l-2 border-gold pl-4">
              <Sparkles size={16} /> ARCHITECTURAL CURATION_V1.0
            </h4>
            <div className="flex flex-col gap-12">
              {recommendations.map((rec) => (
                <div key={rec.id} className="group bg-charcoal border-l border-gold/40 p-0 transition-all hover:border-gold flex flex-col xl:flex-row gap-8 items-stretch overflow-hidden">
                  <div className="relative w-full xl:w-[480px] h-[320px] bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-all overflow-hidden flex-shrink-0">
                    {rec.image_url ? (
                      <Image 
                        src={rec.image_url} 
                        alt={rec.model} 
                        fill 
                        className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 brightness-110"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-white/5">
                        <div className="text-[10px] text-gold uppercase font-bold tracking-[3px] text-center px-4 opacity-50">IMAGE_NOT_FOUND_IN_GEOMETRY</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-8 space-y-8 flex flex-col justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <h5 className="text-[20px] font-serif text-offwhite uppercase tracking-[2px] leading-tight">{rec.brand} <span className="text-gold italic">{rec.model}</span></h5>
                          <p className="text-[11px] text-text-muted/80 uppercase tracking-widest font-mono">{rec.material} // {rec.shape} // ${rec.price}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-gold font-mono text-[32px] leading-none mb-1 font-bold">{rec.matchScore}%</div>
                          <div className="text-[9px] uppercase text-text-muted tracking-[2px]">OPTICIAN_PRECISION_SCORE</div>
                        </div>
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm">
                        <p className="text-[13px] text-offwhite/90 leading-[1.8] whitespace-pre-line font-sans tracking-wide">
                          {rec.scientificRationale}
                        </p>
                      </div>
                    </div>
                    
                    <button className="w-full xl:w-fit px-12 py-4 bg-gold text-charcoal text-[11px] font-bold uppercase tracking-[2px] hover:bg-gold-hover transition-all self-end">
                      Initialize Virtual Fitting
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex gap-[16px]">
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="bg-gold text-charcoal px-[32px] py-[16px] text-[12px] font-semibold uppercase tracking-[1.5px] hover:bg-gold-hover transition-colors"
          >
            Start Your Face Analysis
          </button>
          <button className="bg-transparent border border-gold text-gold px-[32px] py-[16px] text-[12px] font-semibold uppercase tracking-[1.5px] hover:bg-gold/5 transition-colors">
            View Analytics
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
