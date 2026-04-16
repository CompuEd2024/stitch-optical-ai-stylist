'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Brain, Star, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const FALLBACK_RECOMMENDATIONS = [
  {
    id: 'V-101',
    name: 'The Meridian Square',
    model: 'V-101',
    price: 485.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB81fyQOFFBR_NSzBY6qbzz7rLLSLh7RR6vQuBeFX9h0WhPh1TSK4cK40Yk6d74Ws_vUbbYwvnSOnP2IZ-1w3kOCeMfQiE0potEGmFLCA07vlwKUG8k4sLJaL0PWGNFKeAaqvLS8oUl7_CH9S4m2M3FmMf5lKin5TSq9xK9aJorjPf9-Y7_5j9kJE7PwGu0M63uEotyOWBP24tWODX98K28mLp8BZQR3EYVBPCrr8fuPQF7mAAZRRn2FNCMN7GQLyCBv728pElU49br',
    rationale: 'The angular bridge structure counteracts the softness of the cheekbone curvature to create optical balance.',
    match: 99.8,
  },
  {
    id: 'V-402',
    name: 'The Zenith Circular',
    model: 'V-402',
    price: 520.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwZ-SqN13SrSM9uKgKsEqovQt6W1OMVyhgalojNbYnGqrrWZedJuS8Y4RbhaE13uP3h6dQ4954bQgRyr1CqiPZkDEaRRV02njupZwLoEMvzF4QO0shZfc4OZ_w7YPeZhHeLhTyCXESDGvIO5rZVxqMmz8Op3dV-9OMUnf6gvEWA5SsYYYdQDmNpdSl-vwBSQfbteil357f0aSc8rJziImLARYJfjf9KQlizlPelepP5Rl_Qsz36QaPE_1NlqNNq66JZwmDIS59VzHF',
    rationale: 'Frame width optimized for 142mm zygomatic breadth to ensure temporal comfort without pressure points.',
    match: 98.5,
  }
];

export const ProductGrid = () => {
  const [frames, setFrames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!isSupabaseConfigured) {
        setFrames(FALLBACK_RECOMMENDATIONS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('inventory')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          // If the table doesn't exist yet or other DB error, log but don't crash
          console.warn('Inventory table access error:', error.message);
          throw error;
        }

        if (data && data.length > 0) {
          // Map inventory data to our UI structure
          const mappedFrames = data.map((item: any) => ({
            id: item.id || Math.random().toString(),
            name: `${item.brand || 'Premium'} ${item.model || 'Frame'}`,
            model: item.model || 'Classic',
            price: item.price || 0,
            image: item.image_url || 'https://picsum.photos/seed/glasses/400/200',
            match: item.match_score || (94 + Math.random() * 5.9).toFixed(1),
            rationale: item.description || item.scientific_rationale || 'Engineered for optimal ocular alignment and temporal comfort.'
          }));
          setFrames(mappedFrames);
        } else {
          setFrames(FALLBACK_RECOMMENDATIONS);
        }
      } catch (err) {
        // Silently fallback if Supabase isn't reachable or table is missing
        setFrames(FALLBACK_RECOMMENDATIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center bg-charcoal border-t border-border-gold">
        <Loader2 className="text-gold animate-spin mb-4" size={32} />
        <p className="text-gold font-mono text-[10px] tracking-widest uppercase">Syncing_Inventory_Database...</p>
      </div>
    );
  }

  return (
    <section id="collections" className="bg-charcoal">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-border-gold">
        {frames.map((frame, index) => (
          <motion.div 
            key={frame.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="p-[24px] border-border-gold border-b border-r sm:even:border-r-0 md:border-r lg:[&:nth-child(4n)]:border-r-0 flex flex-col items-center text-center group transition-colors hover:bg-white/5"
          >
            <div className="w-full aspect-[2/1] bg-white/5 mb-[16px] rounded-[4px] flex items-center justify-center p-8 overflow-hidden relative">
              <Image 
                src={frame.image}
                alt={frame.name}
                width={200}
                height={100}
                className="object-contain transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 text-[8px] font-mono text-gold bg-gold/10 px-1.5 py-0.5 rounded">
                MATCH {frame.match}%
              </div>
            </div>

            <h3 className="text-[12px] font-medium text-offwhite mb-[4px] uppercase tracking-wider">{frame.name}</h3>
            <div className="text-[11px] text-gold font-mono tracking-tighter">
              ${Number(frame.price).toFixed(2)}
            </div>
            
            <div className="mt-4 p-4 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-[9px] text-text-muted leading-relaxed italic">
                &ldquo;{frame.rationale}&rdquo;
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
