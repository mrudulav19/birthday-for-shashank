import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { OrigamiStar } from './OrigamiStar';
import { BIRTHDAY_LETTER_PARAGRAPHS } from '../data/wishes';
import { ArrowRight, Heart } from 'lucide-react';

interface BirthdayLetterProps {
  onContinueToFinal: () => void;
  onBackToJar?: () => void;
}

export const BirthdayLetter: React.FC<BirthdayLetterProps> = ({ onContinueToFinal, onBackToJar }) => {
  // Stagger paragraph reveal
  const [visibleParagraphsCount, setVisibleParagraphsCount] = useState<number>(1);

  useEffect(() => {
    // Unfold paragraphs progressively
    const total = BIRTHDAY_LETTER_PARAGRAPHS.length;
    if (visibleParagraphsCount < total) {
      const timer = setTimeout(() => {
        setVisibleParagraphsCount((prev) => Math.min(prev + 1, total));
      }, 700); // 700ms between paragraphs: enjoyable without being tedious
      return () => clearTimeout(timer);
    }
  }, [visibleParagraphsCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 z-20 flex flex-col items-center"
    >
      {/* Golden star resting gently near the stationery */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 12 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="absolute -top-3 right-6 sm:right-10 z-30"
      >
        <OrigamiStar colorTheme="gold" size={62} isGoldenSpecial={true} isGlowing={true} />
      </motion.div>

      {/* The Stationery Paper */}
      <div 
        className="relative w-full rounded-2xl p-7 sm:p-12 sm:px-14 bg-parchment text-[#2b1f14] shadow-2xl border-2 border-[#e6d7bb]"
        style={{
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(251, 191, 36, 0.2)',
        }}
      >
        {/* Delicate Double Gold Inset Borders */}
        <div className="absolute inset-3 sm:inset-5 rounded-xl border border-[#d4af37]/40 pointer-events-none" />
        <div className="absolute inset-4 sm:inset-6 rounded-lg border border-[#d4af37]/20 pointer-events-none" />

        {/* Corner Star Doodles */}
        <span className="absolute top-5 left-5 text-[#c59b27] text-sm opacity-75 select-none font-serif">✦</span>
        <span className="absolute top-5 right-5 text-[#c59b27] text-sm opacity-75 select-none font-serif">✦</span>
        <span className="absolute bottom-5 left-5 text-[#c59b27] text-sm opacity-75 select-none font-serif">✦</span>
        <span className="absolute bottom-5 right-5 text-[#c59b27] text-sm opacity-75 select-none font-serif">✦</span>

        {/* Letter Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between border-b border-[#e5d5b7] pb-4 mb-6">
            <span className="text-xs font-serif uppercase tracking-widest text-[#a07833]">
              October 2026 · For your 29th birthday
            </span>
            <span className="text-xs font-handwriting text-[#8c6527] text-base">
              from your wife ♡
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#3a2512] font-semibold tracking-tight">
            Dear Shashank,
          </h2>
        </div>

        {/* Letter Body Paragraphs */}
        <div className="space-y-6 font-handwriting text-2xl sm:text-[27px] leading-relaxed text-[#2f1e10] select-text">
          {BIRTHDAY_LETTER_PARAGRAPHS.map((paragraph, index) => {
            const isVisible = index < visibleParagraphsCount;
            const isLast = index === BIRTHDAY_LETTER_PARAGRAPHS.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={!isVisible ? 'hidden' : 'block'}
              >
                {isLast ? (
                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-serif text-xl sm:text-2xl italic text-[#4a2e16] font-medium">
                        {paragraph}
                      </p>
                    </div>

                    {/* Tiny golden-retriever paw doodle beside the signature */}
                    <div 
                      className="px-3 py-1.5 rounded-lg bg-[#f0e4cc] border border-[#dbc6a4] text-xs font-serif text-[#744c20] flex items-center gap-1.5 opacity-90 shadow-2xs select-none"
                      title="Golden retriever heart"
                    >
                      <span className="text-sm">🐾</span>
                      <span className="italic text-[11px]">always your team</span>
                    </div>
                  </div>
                ) : (
                  <p className="tracking-wide">
                    {paragraph}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Button to proceed to the final moment */}
        {visibleParagraphsCount >= BIRTHDAY_LETTER_PARAGRAPHS.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 pt-6 border-t border-[#e2d0af] flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            {onBackToJar ? (
              <button
                onClick={onBackToJar}
                className="text-xs font-serif text-[#8f6d3b] hover:text-[#523714] underline underline-offset-4 cursor-pointer transition-colors"
              >
                ← Look back at the 29 stars
              </button>
            ) : <div />}

            {/* Exactly labeled: "One last thing ♡" */}
            <button
              onClick={onContinueToFinal}
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f1cb60] to-[#d4af37] text-[#2b1b0b] font-serif font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:from-[#c59e2b] hover:to-[#c59e2b] active:scale-97 transition-all duration-200 cursor-pointer"
            >
              <span>One last thing</span>
              <Heart size={16} className="text-[#a42828] fill-[#a42828] group-hover:scale-125 transition-transform" />
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
