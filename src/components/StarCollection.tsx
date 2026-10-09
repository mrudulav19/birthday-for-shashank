import React from 'react';
import { motion } from 'motion/react';
import { OrigamiStar } from './OrigamiStar';
import { Wish } from '../types';
import { Sparkles, Check } from 'lucide-react';

interface StarCollectionProps {
  releasedWishes: Wish[];
  openedWishIds: Set<number>;
  onStarClick: (wish: Wish) => void;
  activeWishId?: number | null;
}

export const StarCollection: React.FC<StarCollectionProps> = ({
  releasedWishes,
  openedWishIds,
  onStarClick,
  activeWishId,
}) => {
  if (releasedWishes.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8 pb-16 z-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <h3 className="text-lg sm:text-xl font-serif text-amber-100 font-semibold tracking-wide">
            Released Stars ({releasedWishes.length} of 29)
          </h3>
        </div>
        <p className="text-xs font-serif italic text-amber-200/70">
          Click any star to unfold its secret birthday wish ♡
        </p>
      </div>

      {/* Grid / Scattered Keepsake Display */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-[#14152e]/60 backdrop-blur-md border border-white/10 shadow-xl">
        {releasedWishes.map((wish, index) => {
          const isOpened = openedWishIds.has(wish.id);
          const isSelected = activeWishId === wish.id;
          
          // Slight deterministic angle variation
          const rotationAngle = ((wish.id * 37) % 50) - 25;

          return (
            <motion.div
              key={wish.id}
              initial={{ scale: 0, y: -20, rotate: -90 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                rotate: rotationAngle,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: index === releasedWishes.length - 1 ? 0.05 : 0,
              }}
              className="flex flex-col items-center"
            >
              <motion.button
                whileHover={{ scale: 1.22, y: -4, rotate: rotationAngle + 10 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onStarClick(wish)}
                className={`relative group flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-300 ${
                  isSelected ? 'ring-2 ring-amber-400 bg-amber-400/20' : ''
                }`}
                aria-label={`Star ${wish.starNumber}: ${wish.title}. ${isOpened ? 'Already read' : 'Unopened'}`}
              >
                {/* Subtle pulse aura if unopened to invite click */}
                {!isOpened && (
                  <div className="absolute inset-1 rounded-full bg-amber-300/30 blur-sm animate-pulse pointer-events-none" />
                )}

                <OrigamiStar
                  colorTheme={wish.defaultColorTheme}
                  size={46}
                  isOpened={isOpened}
                  isGlowing={!isOpened}
                />

                {/* Star Number Badge underneath */}
                <div className="mt-1 flex items-center gap-1">
                  <span className={`text-[10px] font-serif font-medium tracking-wider px-1.5 py-0.5 rounded-full ${
                    isOpened 
                      ? 'text-white/60 bg-white/5 border border-white/10' 
                      : 'text-amber-200 bg-amber-400/20 border border-amber-300/30 font-bold'
                  }`}>
                    #{wish.starNumber < 10 ? `0${wish.starNumber}` : wish.starNumber}
                  </span>

                  {isOpened && (
                    <span title="Read" className="text-emerald-400 text-[10px]">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                </div>

                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-[#0c0d1e] border border-amber-300/30 px-2 py-0.5 rounded-md text-[10px] text-amber-200 whitespace-nowrap shadow-lg z-30 font-serif">
                  {wish.title}
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
