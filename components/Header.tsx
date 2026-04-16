'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Menu } from 'lucide-react';
import { motion } from 'motion/react';

export const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-charcoal/90 backdrop-blur-md border-b border-border-gold px-[48px] py-[32px]">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-serif font-light tracking-[4px] text-gold uppercase">
            Stitch
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-[32px]">
          {['Collections', 'The Lab', 'Bespoke', 'Archives'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-[12px] font-medium text-offwhite hover:text-gold transition-colors tracking-[1px] uppercase"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-[32px]">
          <div className="hidden lg:block text-[11px] uppercase tracking-[1px] text-offwhite/80">
            Account / Cart (0)
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 text-gold transition-colors"
          >
            <Menu size={20} />
          </motion.button>
        </div>
      </div>
    </header>
  );
};
