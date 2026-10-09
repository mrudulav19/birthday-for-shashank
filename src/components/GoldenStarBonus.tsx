import React from 'react';
import { motion } from 'motion/react';
import { OrigamiStar } from './OrigamiStar';
import { Sparkles } from 'lucide-react';

interface GoldenStarBonusProps {
  onGoldenStarClick: () => void;
}

export const GoldenStarBonus: React.FC<GoldenStarBonusProps> = ({ onGoldenStarClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: -40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.3 }}
      className="relative flex flex-col items-center text-center z-30 my-6 max-w-md mx-auto"
    >
      {/* Golden Aura Glow */}
      <div 
        className="absolute -inset-10 rounded-full blur-3xl pointer-events-none opacity-60 animate-golden-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.55) 0%, rgba(245, 158, 11, 0.3) 50%, transparent 75%)',
        }}
      />

      {/* Golden Star Interactive Button */}
      <motion.button
        whileHover={{ scale: 1.15, rotate: 6 }}
        whileTap={{ scale: 0.95 }}
        onClick={onGoldenStarClick}
        className="relative group p-4 cursor-pointer focus:outline-hidden focus-visible:ring-4 focus-visible:ring-amber-300 rounded-full"
        aria-label="The special golden star. Click to open the final birthday letter."
      >
        {/* Swirling Sparkles rings */}
        <div className="absolute inset-0 rounded-full border border-amber-300/30 animate-ping opacity-30" />
        <div className="absolute -inset-2 rounded-full border border-amber-400/20 animate-pulse" />

        <OrigamiStar
          colorTheme="gold"
          size={78}
          isGoldenSpecial={true}
          isGlowing={true}
          className="filter drop-shadow-[0_0_24px_rgba(251,191,36,0.95)]"
        />

        {/* Little floating sparkles */}
        <motion.span
          animate={{ y: [-4, 4, -4], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1 text-amber-200 text-lg"
        >
          ✨
        </motion.span>
        <motion.span
          animate={{ y: [4, -4, 4], opacity: [0.5, 0.9, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -bottom-1 -left-1 text-amber-300 text-base"
        >
          ✨
        </motion.span>
      </motion.button>

      {/* Heading and Subheading specified in requirements */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-3 px-4"
      >
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-200 tracking-wide flex items-center justify-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>One last star, just for you.</span>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </h2>

        <p className="font-handwriting text-xl sm:text-2xl text-amber-100/90 italic mt-1.5 leading-relaxed">
          &ldquo;Some things are too important to fit inside a little wish.&rdquo;
        </p>

        <p className="text-xs uppercase tracking-widest text-amber-300/70 font-serif font-medium mt-3 animate-pulse">
          Tap the golden star to open ♡
        </p>
      </motion.div>
    </motion.div>
  );
};
