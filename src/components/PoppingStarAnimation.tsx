import React from 'react';
import { motion } from 'motion/react';
import { OrigamiStar } from './OrigamiStar';
import { Wish } from '../types';

interface PoppingStarAnimationProps {
  wish: Wish | null;
  onAnimationComplete: () => void;
}

export const PoppingStarAnimation: React.FC<PoppingStarAnimationProps> = ({
  wish,
  onAnimationComplete,
}) => {
  if (!wish) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
      {/* Popping trajectory:
          Starts at top mouth of the jar, shoots upward in an arc with a tumbling spin,
          then floats down gently with a bounce landing into the tray below
      */}
      <motion.div
        initial={{
          y: -130, // at jar mouth
          x: 0,
          scale: 0.35,
          rotate: 0,
          opacity: 0.9,
        }}
        animate={{
          y: [-130, -220, 210, 185, 200], // shoots up, arcs, drops, bounces, settles
          x: [0, -15, 10, -5, 0],
          scale: [0.35, 1.25, 1.05, 1.0, 1.0],
          rotate: [0, 180, 540, 680, 720],
          opacity: [0.9, 1, 1, 1, 1],
        }}
        transition={{
          duration: 1.15,
          times: [0, 0.28, 0.78, 0.88, 1],
          ease: 'easeInOut',
        }}
        onAnimationComplete={onAnimationComplete}
        className="relative"
      >
        <OrigamiStar
          colorTheme={wish.defaultColorTheme}
          size={52}
          isGlowing={true}
          isGoldenSpecial={wish.defaultColorTheme === 'gold'}
        />

        {/* Trail sparkles */}
        <motion.span
          animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="absolute -top-2 -right-2 text-amber-200 text-lg"
        >
          ✨
        </motion.span>
      </motion.div>
    </div>
  );
};
