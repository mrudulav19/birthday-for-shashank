import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface HeaderBarProps {
  discoveredCount: number;
  totalCount: number;
  onReset: () => void;
  onOpenLetter?: () => void;
  canOpenLetter?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  discoveredCount,
  totalCount,
  onReset,
  onOpenLetter,
  canOpenLetter,
}) => {
  const [isSoundOn, setIsSoundOn] = useState(soundManager.isEnabled());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const toggleSound = () => {
    const next = !isSoundOn;
    soundManager.setEnabled(next);
    setIsSoundOn(next);
  };

  return (
    <>
      <header className="relative w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between z-30">
        {/* Left: Little brand note */}
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-lg select-none">✨</span>
          <span className="font-serif text-sm sm:text-base text-amber-100/90 tracking-wide font-medium">
            29 Little Stars
          </span>
          <span className="hidden sm:inline text-xs font-serif text-amber-200/50">
            · for Shashank's 29th
          </span>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Progress display */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-serif text-amber-200/90 shadow-2xs">
            <Sparkles size={12} className="text-amber-300" />
            <span>{discoveredCount} of {totalCount} wishes discovered</span>
          </div>

          {/* Quick jump to Letter if all opened */}
          {canOpenLetter && onOpenLetter && (
            <button
              onClick={onOpenLetter}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 text-xs font-serif transition-colors cursor-pointer"
            >
              <Heart size={12} className="fill-amber-400 text-amber-400" />
              <span>Read Letter</span>
            </button>
          )}

          {/* Sound Toggle (Muted by default) */}
          <button
            onClick={toggleSound}
            aria-label={isSoundOn ? 'Mute sound' : 'Unmute sound'}
            title={isSoundOn ? 'Sound is on (click to mute)' : 'Sound is off (click to enable gentle chimes)'}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-amber-100/80 hover:text-amber-50 transition-colors cursor-pointer"
          >
            {isSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => setShowConfirmReset(true)}
            aria-label="Restart experience"
            title="Start over from the beginning"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-amber-100/80 hover:text-amber-50 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#191a38] border border-amber-300/30 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-xl font-serif text-amber-200 font-bold mb-2">
              Start again?
            </h3>
            <p className="text-sm font-sans text-amber-100/80 mb-6 leading-relaxed">
              This will put all 29 folded stars back into the jar so you can pop them all over again.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-xs font-serif text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
              >
                Keep Progress
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  onReset();
                }}
                className="px-4 py-2 rounded-xl text-xs font-serif font-bold text-[#2a1b0b] bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer shadow-md"
              >
                Reset Jar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
