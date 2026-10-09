import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OrigamiStar } from './OrigamiStar';
import { StarColorTheme } from '../types';

interface GlassJarProps {
  remainingCount: number;
  totalCount: number;
  isWobbling: boolean;
  isAllWishesOpened: boolean;
  onJarClick: () => void;
  disabled?: boolean;
}

interface JarStarData {
  id: number;
  colorTheme: StarColorTheme;
  x: number; // percentage inside jar belly (15% to 85%)
  y: number; // percentage from bottom (10% to 80%)
  rotation: number;
  scale: number;
}

export const GlassJar: React.FC<GlassJarProps> = ({
  remainingCount,
  totalCount,
  isWobbling,
  isAllWishesOpened,
  onJarClick,
  disabled = false,
}) => {
  // Generate 29 deterministic positions for the stars inside the jar
  // arranged from bottom to top so that as remainingCount drops, stars disappear from the top first!
  const jarStars: JarStarData[] = useMemo(() => {
    const themes: StarColorTheme[] = [
      'gold', 'blossom', 'lavender', 'cream', 'sky', 'mint',
      'gold', 'blossom', 'cream', 'lavender', 'mint', 'sky',
      'gold', 'blossom', 'lavender', 'cream', 'gold', 'sky',
      'mint', 'blossom', 'lavender', 'gold', 'cream', 'sky',
      'mint', 'blossom', 'gold', 'lavender', 'cream'
    ];

    const stars: JarStarData[] = [];
    for (let i = 0; i < totalCount; i++) {
      // Stratify vertically into layers so lower index = lower in the jar
      const layer = Math.floor(i / 5); // 0 to 5
      const layerOffset = (i % 5);
      
      // Calculate realistic pile position
      const baseY = 14 + layer * 12 + ((i * 7) % 6); // 14% to ~78% from bottom
      const minX = 22 + (layer > 3 ? (layer - 3) * 3 : 0);
      const maxX = 78 - (layer > 3 ? (layer - 3) * 3 : 0);
      const baseX = minX + (layerOffset * ((maxX - minX) / 4)) + ((i * 13) % 8 - 4);
      
      const rotation = ((i * 47) % 360) - 180;
      const scale = 0.65 + ((i * 11) % 4) * 0.06;

      stars.push({
        id: i,
        colorTheme: themes[i % themes.length],
        x: Math.max(18, Math.min(82, baseX)),
        y: baseY,
        rotation,
        scale,
      });
    }
    return stars;
  }, [totalCount]);

  // The stars currently visible inside the jar (only show the first remainingCount stars)
  const visibleJarStars = useMemo(() => {
    return jarStars.slice(0, remainingCount);
  }, [jarStars, remainingCount]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Soft floor shadow for jar */}
      <div 
        className="absolute -bottom-4 w-56 h-8 rounded-full blur-md opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(15, 10, 30, 0.9) 0%, rgba(251, 191, 36, 0.2) 50%, transparent 80%)'
        }}
      />

      {/* The interactive Jar Container */}
      <motion.div
        animate={isWobbling ? {
          rotate: [0, -3.5, 3.5, -2, 2, 0],
          scale: [1, 1.025, 1.01, 1.02, 1],
          y: [0, -3, 0],
        } : {}}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
        whileHover={!disabled && remainingCount > 0 ? { scale: 1.02, y: -2 } : {}}
        whileTap={!disabled && remainingCount > 0 ? { scale: 0.98 } : {}}
        onClick={() => {
          if (!disabled && remainingCount > 0) {
            onJarClick();
          }
        }}
        className={`relative w-56 sm:w-64 h-80 sm:h-92 flex flex-col items-center cursor-pointer transition-all ${
          remainingCount === 0 ? 'cursor-default' : ''
        }`}
        role="button"
        tabIndex={0}
        aria-label={
          remainingCount > 0 
            ? `Star jar with ${remainingCount} wishes remaining. Click to pop out a star!` 
            : 'Star jar. All wishes have been collected.'
        }
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && remainingCount > 0) {
            e.preventDefault();
            onJarClick();
          }
        }}
      >
        {/* Soft Golden/Pastel Glow behind Jar */}
        <div 
          className={`absolute inset-4 rounded-3xl blur-2xl transition-all duration-1000 pointer-events-none ${
            isAllWishesOpened
              ? 'bg-amber-400/40 opacity-90 scale-110 animate-golden-pulse'
              : remainingCount > 0
              ? 'bg-amber-300/15 opacity-70'
              : 'bg-indigo-900/20 opacity-30'
          }`}
        />

        {/* 1. Cork Stopper */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Top cork grip */}
          <div 
            className="w-20 h-4 rounded-t-md shadow-inner border border-amber-900/30"
            style={{
              background: 'linear-gradient(to right, #92400e, #b45309, #d97706, #b45309, #78350f)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.3)',
            }}
          />
          {/* Cork body wedged into neck */}
          <div 
            className="w-24 h-6 rounded-b-sm border-x border-b border-amber-900/40"
            style={{
              background: 'linear-gradient(to right, #78350f, #92400e, #b45309, #92400e, #78350f)',
              boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.4)',
            }}
          />
        </div>

        {/* 2. Glass Jar Lip & Neck */}
        <div className="relative z-10 w-28 h-5 -mt-1 rounded-t-lg border-2 border-white/40 bg-white/10 backdrop-blur-xs flex items-center justify-center shadow-xs">
          {/* Glass rim specular shine */}
          <div className="absolute inset-x-2 top-0.5 h-[1.5px] bg-white/70 rounded-full" />

          {/* Twine String wrapped around the jar neck */}
          <div className="absolute -bottom-1 inset-x-0 h-2 bg-[#b48a58] rounded-xs shadow-xs border-y border-[#7d562b]/50">
            {/* Rustic Tag hanging from the neck */}
            <div className="absolute top-2 left-6 z-30 transform -rotate-6 origin-top">
              {/* String from neck to tag */}
              <div className="w-[1.5px] h-3 bg-[#b48a58] mx-auto" />
              {/* Kraft Paper Tag */}
              <div 
                className="px-2 py-1 bg-[#f4ecd8] border border-[#d6c4a5] rounded-xs shadow-md text-[10px] font-serif text-[#633a1e] tracking-wider whitespace-nowrap flex items-center gap-1 hover:rotate-2 transition-transform select-none"
                style={{
                  boxShadow: '1px 2px 5px rgba(0,0,0,0.25)',
                }}
              >
                <span>for Shashank</span>
                <span className="text-amber-500 text-[9px]">✨</span>
                {/* Tiny sweet paw doodle accent */}
                <span className="text-[#a87a46] text-[8px] opacity-80" title="Golden retriever paws">🐾</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Glass Jar Body (The Belly) */}
        <div 
          className="relative z-10 w-full flex-1 rounded-b-[40px] rounded-t-[18px] border-2 border-white/35 overflow-hidden backdrop-blur-[2px] transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 40%, rgba(200, 220, 255, 0.04) 100%)',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.15), inset 0 -10px 25px rgba(200,225,255,0.1), 0 15px 35px rgba(0,0,0,0.35)',
          }}
        >
          {/* Specular Curved Highlight on Left Side of Jar */}
          <div 
            className="absolute left-2 top-3 bottom-4 w-4 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)',
              filter: 'blur(1px)',
            }}
          />

          {/* Secondary Soft Rim Reflection on Right */}
          <div 
            className="absolute right-2 top-4 bottom-6 w-2 rounded-full pointer-events-none opacity-45"
            style={{
              background: 'linear-gradient(to left, rgba(255,255,255,0.3) 0%, transparent 100%)',
            }}
          />

          {/* Bottom Glass Lens Thick Base Reflection */}
          <div 
            className="absolute bottom-1 inset-x-4 h-5 rounded-b-[34px] border-t border-white/20 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,0.2) 0%, transparent 100%)',
            }}
          />

          {/* Paper Origami Stars Stacked Inside the Jar */}
          <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence>
              {visibleJarStars.map((star) => (
                <motion.div
                  key={star.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: star.scale, opacity: 0.95 }}
                  exit={{ 
                    y: -120, 
                    scale: 1.1, 
                    opacity: 0, 
                    transition: { duration: 0.45, ease: 'easeOut' } 
                  }}
                  className="absolute"
                  style={{
                    left: `${star.x}%`,
                    bottom: `${star.y}%`,
                    transform: `translate(-50%, 50%) rotate(${star.rotation}deg)`,
                  }}
                >
                  <OrigamiStar 
                    colorTheme={star.colorTheme} 
                    size={34}
                    isGoldenSpecial={star.colorTheme === 'gold'}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty state soft message inside jar when all stars have been released */}
          {remainingCount === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none"
            >
              <span className="text-amber-200/80 font-handwriting text-xl sm:text-2xl leading-tight">
                All 29 stars released!
              </span>
              <span className="text-white/50 text-xs font-sans mt-1">
                Open every wish below ✨
              </span>
            </motion.div>
          )}

          {/* Glass Sparkle Burst Animation on click near mouth */}
          {isWobbling && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4, y: 15 }}
              animate={{ opacity: 1, scale: 1.3, y: -10 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-center"
            >
              <span className="text-amber-200 text-2xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-ping">
                ✨
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
