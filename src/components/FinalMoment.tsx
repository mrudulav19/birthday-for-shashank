import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { OrigamiStar } from './OrigamiStar';
import { RotateCcw, Heart, Sparkles } from 'lucide-react';
import { StarColorTheme } from '../types';

interface FinalMomentProps {
  onRestartExperience: () => void;
  onReviewWishes: () => void;
}

export const FinalMoment: React.FC<FinalMomentProps> = ({ onRestartExperience, onReviewWishes }) => {
  // Trigger gentle bursts of floating golden and pastel confetti/stars
  useEffect(() => {
    // Gentle pastel & gold shower
    const colors = ['#fde047', '#fbcfe8', '#e9d5ff', '#bae6fd', '#bbf7d0', '#ffffff'];

    const end = Date.now() + 3.5 * 1000;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        shapes: ['circle'],
        ticks: 200,
        gravity: 0.6,
        scalar: 1.1,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        shapes: ['circle'],
        ticks: 200,
        gravity: 0.6,
        scalar: 1.1,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const decorativeThemes: StarColorTheme[] = ['blossom', 'gold', 'lavender', 'sky', 'cream'];

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 text-center z-20 max-w-3xl mx-auto">
      {/* Soft celestial halo */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(244, 114, 182, 0.25) 50%, transparent 80%)'
        }}
      />

      {/* Floating Origami Stars around the center */}
      <div className="relative mb-8 flex items-center justify-center gap-3 sm:gap-6">
        {decorativeThemes.map((theme, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0, scale: 0 }}
            animate={{ 
              y: [0, -8, 0], 
              opacity: 1, 
              scale: i === 1 ? 1.25 : 1 
            }}
            transition={{
              y: { duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.6, delay: i * 0.1 },
              scale: { duration: 0.6, delay: i * 0.1 },
            }}
          >
            <OrigamiStar 
              colorTheme={theme} 
              size={i === 1 ? 56 : 38} 
              isGoldenSpecial={theme === 'gold'} 
              isGlowing={theme === 'gold'} 
            />
          </motion.div>
        ))}
      </div>

      {/* Main Emotional Message (exact wording from brief) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        className="max-w-xl px-4"
      >
        <p className="font-handwriting text-3xl sm:text-5xl md:text-5xl text-[#fff7ed] leading-relaxed tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
          &ldquo;And if I get to make one wish for your 29th year, it's that I get to be there for 30, too. ♡&rdquo;
        </p>
      </motion.div>

      {/* Spacing / Breathing room as requested */}
      <div className="h-16 sm:h-20" />

      {/* Bottom celebration signature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-amber-200 tracking-tight drop-shadow-[0_2px_12px_rgba(251,191,36,0.3)]">
            Happy birthday, my love.
          </h1>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>

        <p className="font-serif italic text-base sm:text-lg text-amber-100/75 tracking-wider mt-1">
          29 little stars. A million reasons to love you.
        </p>

        {/* Action buttons: Revisit wishes or reset experience */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onReviewWishes}
            className="px-6 py-2.5 rounded-full border border-amber-300/40 text-amber-100/90 hover:bg-amber-300/10 hover:text-amber-50 text-xs sm:text-sm font-serif tracking-wide transition-all cursor-pointer"
          >
            Review all 29 wishes
          </button>

          {/* Exactly required: "Experience the jar again" */}
          <button
            onClick={onRestartExperience}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/60 text-amber-200 hover:text-white text-xs sm:text-sm font-serif tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <RotateCcw size={14} className="group-hover:-rotate-90 transition-transform duration-300" />
            <span>Experience the jar again</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
