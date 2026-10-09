import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wish } from '../types';
import { OrigamiStar } from './OrigamiStar';
import { X, Sparkles, Heart } from 'lucide-react';

interface WishCardModalProps {
  wish: Wish | null;
  onClose: () => void;
}

export const WishCardModal: React.FC<WishCardModalProps> = ({ wish, onClose }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typewriter / smooth reveal animation for the message
  useEffect(() => {
    if (!wish) {
      setDisplayedText('');
      setIsTypingComplete(false);
      return;
    }

    const fullText = wish.message;
    setDisplayedText('');
    setIsTypingComplete(false);

    // Fast, gentle typewriter stream that is pleasant and not slow
    let currentIndex = 0;
    const intervalTime = Math.max(12, Math.min(22, 1200 / fullText.length));

    const timer = setInterval(() => {
      currentIndex += 2; // two chars per tick for smooth pacing
      if (currentIndex >= fullText.length) {
        setDisplayedText(fullText);
        setIsTypingComplete(true);
        clearInterval(timer);
      } else {
        setDisplayedText(fullText.slice(0, currentIndex));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [wish]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!wish) return null;

  const starNumberFormatted = wish.starNumber < 10 ? `0${wish.starNumber}` : `${wish.starNumber}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#090a18]/80 backdrop-blur-md transition-opacity"
        />

        {/* The Folded Note Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg my-auto z-10"
        >
          {/* Card Outer Shadow & Glow */}
          <div 
            className="relative rounded-2xl p-6 sm:p-9 bg-parchment text-[#2d2217] shadow-2xl border-2 border-[#e6d8ba]"
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.65), 0 0 25px rgba(251, 191, 36, 0.25)',
            }}
          >
            {/* Delicate Inset Gold Border */}
            <div className="absolute inset-3 sm:inset-4 rounded-xl border border-[#d4af37]/40 pointer-events-none" />
            <div className="absolute inset-3.5 sm:inset-4.5 rounded-lg border border-[#d4af37]/20 pointer-events-none" />

            {/* Corner Star Doodles */}
            <span className="absolute top-5 left-5 text-[#c59b27] text-xs opacity-75 select-none font-serif">✦</span>
            <span className="absolute top-5 right-5 text-[#c59b27] text-xs opacity-75 select-none font-serif">✦</span>
            <span className="absolute bottom-5 left-5 text-[#c59b27] text-xs opacity-75 select-none font-serif">✦</span>
            <span className="absolute bottom-5 right-5 text-[#c59b27] text-xs opacity-75 select-none font-serif">✦</span>

            {/* Close Icon in corner for clear exit */}
            <button
              onClick={onClose}
              aria-label="Close wish card"
              className="absolute top-4 right-4 p-2 text-[#785b39] hover:text-[#382613] hover:bg-[#ebd9b4]/50 rounded-full transition-colors z-20"
            >
              <X size={18} />
            </button>

            {/* Top Star Decoration & Header */}
            <div className="flex flex-col items-center text-center mb-5">
              <motion.div
                initial={{ rotate: -20, scale: 0.6 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="mb-2 relative"
              >
                <OrigamiStar colorTheme={wish.defaultColorTheme} size={52} isGlowing={true} />
                <motion.span 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-2 text-amber-500 text-sm"
                >
                  ✨
                </motion.span>
              </motion.div>

              {/* Required Header Label */}
              <span className="inline-flex items-center gap-1.5 text-xs font-serif uppercase tracking-widest text-[#a07833] font-semibold">
                <span>A little wish for you</span>
                <Sparkles size={13} className="text-amber-500" />
              </span>

              {/* Star Number & Title */}
              <h3 className="text-xl sm:text-2xl font-serif text-[#3e2b17] mt-1.5 font-bold tracking-tight">
                Star {starNumberFormatted} — {wish.title}
              </h3>
            </div>

            {/* Folded Paper Crease Line Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-dashed border-[#d8c39e]" />
              <span className="absolute bg-[#faf6ee] px-3 text-[#b38f4a] font-serif text-xs italic">
                folded with love
              </span>
            </div>

            {/* Birthday Wish Content */}
            <div className="min-h-[110px] my-4 px-2 sm:px-4 flex items-center justify-center">
              <p 
                className="font-handwriting text-2xl sm:text-[26px] leading-relaxed text-[#2c1d0f] text-center select-text tracking-wide"
                style={{ wordBreak: 'break-word' }}
              >
                &ldquo;{displayedText}&rdquo;
                {!isTypingComplete && (
                  <span className="inline-block w-1.5 h-5 ml-1 bg-amber-600 animate-pulse align-middle" />
                )}
              </p>
            </div>

            {/* Bottom Button Action */}
            <div className="mt-7 flex flex-col items-center">
              <button
                onClick={onClose}
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#d4af37] text-[#2c1d0f] font-serif font-bold text-base shadow-md hover:shadow-lg hover:from-[#c9a32c] hover:to-[#c9a32c] active:scale-97 transition-all duration-200 cursor-pointer"
              >
                <span>Keep this wish</span>
                <Heart size={16} className="text-[#a42828] fill-[#a42828] group-hover:scale-115 transition-transform" />
              </button>

              <span className="text-[11px] font-serif italic text-[#8a7250] mt-2.5">
                Saved in your little constellation of wishes
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
