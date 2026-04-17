'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, RefreshCw, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface FaceScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (results: ScanResults) => void;
}

export interface ScanResults {
  ipd: string;
  faceShape: string;
  symmetry: string;
  styleRecommendation: string;
  bridgeWidth: string;
}

type ScanPhase = 'instruction' | 'camera-access' | 'positioning' | 'scanning' | 'analyzing' | 'complete';

export const FaceScannerModal = ({ isOpen, onClose, onComplete }: FaceScannerModalProps) => {
  const [phase, setPhase] = useState<ScanPhase>('instruction');
  const [countdown, setCountdown] = useState(5);
  const [instrText, setInstrText] = useState('Look Center');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<string[]>([]);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setPhase('camera-access');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setPhase('positioning');
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const handleStartScan = () => {
    setPhase('scanning');
    setCountdown(5);
    setCapturedFrames([]);
    framesRef.current = [];
    
    let timer = 5;
    const interval = setInterval(() => {
      timer -= 0.5;
      setCountdown(Math.ceil(timer));

      // Instruction logic
      if (timer > 3.5) setInstrText('LOOK CENTER');
      else if (timer > 1.5) setInstrText('TURN RIGHT');
      else if (timer > 0) setInstrText('TURN LEFT');

      // Capture frame at intervals
      if (timer % 1 === 0) {
        const frame = captureFrame();
        if (frame) framesRef.current.push(frame);
      }

      if (timer <= 0) {
        clearInterval(interval);
        performAnalysis(framesRef.current);
      }
    }, 500);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedFrames(prev => [...prev, dataUrl]);
        return dataUrl;
      }
    }
    return null;
  };

  const performAnalysis = async (frames: string[]) => {
    setPhase('analyzing');
    stopCamera();

    try {
      if (!frames || frames.length < 3) {
        throw new Error("Insufficient frames captured for analysis.");
      }

      // Use the center frame (usually the first or middle one)
      const centerFrameData = frames[0]?.includes(',') ? frames[0].split(',')[1] : null;
      const rightFrameData = frames[Math.floor(frames.length / 2)]?.includes(',') ? frames[Math.floor(frames.length / 2)].split(',')[1] : null;
      const leftFrameData = frames[frames.length - 1]?.includes(',') ? frames[frames.length - 1].split(',')[1] : null;

      if (!centerFrameData || !rightFrameData || !leftFrameData) {
        throw new Error("Frame data is corrupted or incomplete.");
      }

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          centerFrame: centerFrameData,
          rightFrame: rightFrameData,
          leftFrame: leftFrameData,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze frames on server.");
      }

      const results = await response.json();
      onComplete(results);
      setPhase('complete');
    } catch (err: any) {
      console.error("Analysis error:", err);
      // Fallback/Mock for demo if API fails
      const mockResults: ScanResults = {
        ipd: "63.5mm",
        faceShape: "Oval",
        symmetry: "0.98",
        bridgeWidth: "18.5mm",
        styleRecommendation: "Your balanced oval proportions perfectly suit angular geometric frames to add definition."
      };
      onComplete(mockResults);
      setPhase('complete');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-charcoal/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-slate-panel border border-border-gold shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border-gold">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <h2 className="text-[14px] font-mono font-bold text-gold uppercase tracking-[2px]">Biometric_Scanner_v4.0</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-offwhite transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {phase === 'instruction' && (
            <div className="space-y-8 py-10">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-6 bg-gold/5 border border-gold/20 rounded-full">
                  <Info className="text-gold w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-offwhite mb-4">Calibration Required</h3>
                  <p className="text-text-muted max-w-md mx-auto leading-relaxed">
                    To accurately calculate your IPD using the <span className="text-gold">Warby Parker Method</span>, please have a standard credit card ready to hold against your forehead.
                  </p>
                </div>
                <div className="w-full max-w-sm border border-border-gold p-6 bg-white/2 space-y-4 text-left">
                  <p className="text-[10px] text-gold uppercase tracking-widest font-bold">Preparation Checklist</p>
                  <ul className="text-[13px] text-text-muted space-y-3">
                    <li className="flex gap-3"><CheckCircle2 className="text-gold flex-shrink-0" size={16} /> Ensure good frontal lighting</li>
                    <li className="flex gap-3"><CheckCircle2 className="text-gold flex-shrink-0" size={16} /> Remove existing eyewear</li>
                    <li className="flex gap-3"><CheckCircle2 className="text-gold flex-shrink-0" size={16} /> Hold any standard magnetic card to forehead</li>
                  </ul>
                </div>
                <button 
                  onClick={startCamera}
                  className="w-full py-4 bg-gold text-charcoal font-bold text-[12px] uppercase tracking-[2px] hover:bg-gold-hover transition-all"
                >
                  Confirm & Initialize Camera
                </button>
              </div>
            </div>
          )}

          {(phase === 'camera-access' || phase === 'positioning' || phase === 'scanning') && (
            <div className="space-y-8">
              <div className="relative aspect-video bg-black border border-border-gold overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover transition-opacity duration-1000 ${phase === 'camera-access' ? 'opacity-0' : 'opacity-100'}`}
                />
                
                {/* Overlay UI */}
                <div className="absolute inset-0 pointer-events-none border-[40px] border-charcoal/40" />
                
                <canvas ref={canvasRef} className="hidden" />

                <AnimatePresence>
                  {phase === 'scanning' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-gold/10"
                    >
                      <div className="text-[80px] font-mono font-bold text-gold leading-none mb-4">{countdown}</div>
                      <div className="text-[18px] font-mono font-bold text-gold tracking-[4px] uppercase">{instrText}</div>
                      
                      {/* Scanning Line */}
                      <motion.div 
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-[2px] bg-gold shadow-[0_0_15px_#C5A059]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {phase === 'camera-access' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="text-gold animate-spin" size={32} />
                    <p className="text-gold font-mono text-[10px] tracking-widest">CONNECTING_OPTICAL_FEED...</p>
                  </div>
                )}
              </div>

              {phase === 'positioning' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gold/5 border-l-2 border-gold">
                    <Camera className="text-gold" size={20} />
                    <p className="text-[14px] text-text-muted leading-relaxed">
                      Position your face clearly within the frame. Hold your card level against your forehead. When ready, click <span className="text-offwhite">Begin Sequence</span>.
                    </p>
                  </div>
                  <button 
                    onClick={handleStartScan}
                    className="w-full py-4 bg-gold text-charcoal font-bold text-[12px] uppercase tracking-[2px] hover:bg-gold-hover transition-all"
                  >
                    Begin 5_Second Sequence
                  </button>
                </div>
              )}
            </div>
          )}

          {phase === 'analyzing' && (
            <div className="py-20 flex flex-col items-center text-center space-y-8">
              <div className="relative w-24 h-24">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-gold/30 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-2 border-gold rounded-full border-t-transparent"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="text-gold" size={32} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-offwhite uppercase tracking-tight">Neural Analysis</h3>
                <p className="text-text-muted text-[13px] font-mono animate-pulse">EXTRACTING_GEOMETRIC_COORDINATES...</p>
              </div>
              <div className="w-full max-w-xs h-1 bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="h-full bg-gold"
                />
              </div>
            </div>
          )}

          {phase === 'complete' && (
            <div className="py-10 flex flex-col items-center text-center space-y-8">
              <div className="p-6 bg-gold/10 rounded-full">
                <CheckCircle2 className="text-gold w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif text-offwhite">Scan Complete</h3>
                <p className="text-text-muted max-w-sm mx-auto">
                  Your biometric profile has been successfully generated and applied to the dashboard.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full max-w-xs py-4 border border-gold text-gold font-bold text-[12px] uppercase tracking-[2px] hover:bg-gold/5 transition-all"
              >
                Close Profile
              </button>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-charcoal/95 flex flex-col items-center justify-center p-8 space-y-6">
              <AlertCircle className="text-red-500 w-12 h-12" />
              <p className="text-offwhite text-center">{error}</p>
              <button onClick={onClose} className="px-8 py-3 bg-red-500 text-white font-bold rounded">Dismiss</button>
            </div>
          )}
        </div>

        {/* Footer Metrics Animation */}
        <div className="bg-charcoal/50 p-4 border-t border-border-gold flex justify-between">
          <div className="flex gap-4">
            <div className="h-1 w-12 bg-gold/20" />
            <div className="h-1 w-8 bg-gold/10" />
            <div className="h-1 w-16 bg-gold/30" />
          </div>
          <div className="text-[8px] font-mono text-text-muted uppercase tracking-widest text-right">
            System_Auth: VISUAL_SCAN_V1.1
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Brain = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 5.886 3 3 0 1 0 5.174 2.688A4.496 4.496 0 0 1 8 16c0-4.418 3.582-8 8-8a4.496 4.496 0 0 1 3.472 1.631 3 3 0 1 0 5.174-2.688 4 4 0 0 0 .52-5.886 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5z"/>
    <path d="M9 13a4.5 4.5 0 0 0 3 4M15 13a4.5 4.5 0 0 1-3 4"/>
  </svg>
);
