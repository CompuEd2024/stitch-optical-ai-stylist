'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Lock, HelpCircle, ShieldCheck, Activity } from 'lucide-react';

export default function GetStarted() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="min-h-screen bg-charcoal text-offwhite flex flex-col font-sans">
      <header className="w-full bg-charcoal/80 backdrop-blur-md z-50 border-b border-border-gold">
        <div className="flex justify-between items-center px-[48px] py-[32px] max-w-7xl mx-auto w-full">
          <Link href="/" className="text-xl font-serif font-light text-gold uppercase tracking-[4px]">
            Envision Eyewear
          </Link>
          <div className="flex items-center gap-6 text-text-muted">
            <Lock size={18} />
            <HelpCircle size={18} />
          </div>
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gold/10 blur-[120px]" />
          <svg className="absolute inset-0 w-full h-full text-gold/5" preserveAspectRatio="none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.05" />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-[1fr_450px] gap-12 items-center">
          <div className="hidden lg:flex flex-col gap-8 pr-12 border-r border-border-gold h-full justify-center">
            <div className="space-y-6">
              <span className="text-[10px] uppercase text-gold tracking-[3px]">Secure Identification</span>
              <h1 className="font-serif font-light text-[56px] tracking-tight leading-tight text-offwhite italic">
                The Science of <br />
                <span className="text-gold">Visionary Style.</span>
              </h1>
              <p className="text-text-muted text-[16px] font-medium max-w-md leading-relaxed">
                Access your encrypted profile to review geometric facial metrics and personalized frame recommendations.
              </p>
            </div>

            <div className="relative h-[300px] w-full border border-border-gold p-8 flex items-center justify-center bg-white/2">
              <svg className="w-[120px] h-[120px] stroke-gold opacity-30" viewBox="0 0 24 24" fill="none" strokeWidth="0.5">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                <circle cx="12" cy="12" r="3" />
                <path d="M8 12h8M12 8v8" />
              </svg>
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-full text-gold">
                  <Activity size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-mono font-bold text-gold uppercase tracking-widest">SENSORS_READY</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-md bg-white p-12 shadow-2xl shadow-black/50"
            >
              <div className="flex border-b border-charcoal/10 mb-10">
                <button 
                  onClick={() => setMode('signin')}
                  className={`flex-1 pb-4 text-[12px] font-bold uppercase tracking-widest transition-all ${mode === 'signin' ? 'border-b-2 border-gold text-charcoal' : 'text-charcoal/40'}`}
                >
                  Log In
                </button>
                <button 
                  onClick={() => setMode('signup')}
                  className={`flex-1 pb-4 text-[12px] font-bold uppercase tracking-widest transition-all ${mode === 'signup' ? 'border-b-2 border-gold text-charcoal' : 'text-charcoal/40'}`}
                >
                  Register
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-[24px] font-serif font-light text-charcoal">
                    {mode === 'signin' ? 'Envision Secure Access' : 'Begin Analysis'}
                  </h2>
                </div>

                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Credential_ID</label>
                    <input 
                      type="email" 
                      placeholder="user@envision.optic"
                      className="w-full px-5 py-4 bg-charcoal/5 border-b border-charcoal/20 focus:border-gold focus:outline-none transition-all text-charcoal font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Secret_Key</label>
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-charcoal/5 border-b border-charcoal/20 focus:border-gold focus:outline-none transition-all text-charcoal font-sans"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-5 bg-gold text-charcoal font-bold text-[12px] uppercase tracking-[2px] hover:bg-gold-hover transition-all active:scale-[0.98]"
                  >
                    {mode === 'signin' ? 'Establish Session' : 'Create Identity'}
                  </button>
                </form>

                <div className="pt-8 border-t border-charcoal/10 space-y-4">
                  <div className="flex items-center gap-3 text-[9px] font-bold text-charcoal/40 uppercase tracking-[2px]">
                    <ShieldCheck size={14} className="text-gold" />
                    Biometric Data Protection Active
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 border-t border-border-gold bg-charcoal">
        <div className="flex flex-col md:flex-row justify-between items-center px-[48px] max-w-7xl mx-auto gap-4">
          <p className="text-text-muted font-mono font-bold text-[9px] uppercase tracking-widest">
            © 2024 ENVISION EYEWEAR. ENCRYPTED_CORE.
          </p>
          <div className="flex gap-8 text-text-muted font-mono font-bold text-[9px] uppercase tracking-widest">
            <Link href="#" className="hover:text-gold transition-colors">Privacy_Architecture</Link>
            <Link href="#" className="hover:text-gold transition-colors">Terms_Of_Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
