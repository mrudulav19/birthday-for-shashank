/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundStars } from './components/BackgroundStars';
import { HeaderBar } from './components/HeaderBar';
import { GlassJar } from './components/GlassJar';
import { StarCollection } from './components/StarCollection';
import { WishCardModal } from './components/WishCardModal';
import { GoldenStarBonus } from './components/GoldenStarBonus';
import { BirthdayLetter } from './components/BirthdayLetter';
import { FinalMoment } from './components/FinalMoment';
import { PoppingStarAnimation } from './components/PoppingStarAnimation';
import { WISHES_DATA } from './data/wishes';
import { Wish } from './types';
import { soundManager } from './utils/sound';

const STORAGE_KEY = 'shashank_29_stars_progress_v1';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  // Ordered sequence of wishes for this run (randomized once per playthrough)
  const [shuffledWishIds, setShuffledWishIds] = useState<number[]>([]);
  
  // State: List of wish IDs that have popped out of the jar
  const [releasedWishIds, setReleasedWishIds] = useState<number[]>([]);
  
  // State: Set of wish IDs that have actually been opened and read
  const [openedWishIds, setOpenedWishIds] = useState<Set<number>>(new Set());

  // Active view: 'jar' | 'letter' | 'final'
  const [viewMode, setViewMode] = useState<'jar' | 'letter' | 'final'>('jar');

  // Currently open wish modal
  const [activeWish, setActiveWish] = useState<Wish | null>(null);

  // Animation locks & triggers
  const [isWobbling, setIsWobbling] = useState<boolean>(false);
  const [isPopping, setIsPopping] = useState<boolean>(false);
  const [justPoppedWish, setJustPoppedWish] = useState<Wish | null>(null);

  // Subtle opening banner that fades after a few seconds
  const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(true);

  // Map of all wishes by ID for quick lookup
  const wishesById = useMemo(() => {
    const map = new Map<number, Wish>();
    WISHES_DATA.forEach((w) => map.set(w.id, w));
    return map;
  }, []);

  // Initialize or restore from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed.shuffledWishIds) &&
          parsed.shuffledWishIds.length === WISHES_DATA.length
        ) {
          setShuffledWishIds(parsed.shuffledWishIds);
          setReleasedWishIds(parsed.releasedWishIds || []);
          setOpenedWishIds(new Set(parsed.openedWishIds || []));
          if (parsed.viewMode) {
            setViewMode(parsed.viewMode);
          }
          return;
        }
      }
    } catch {
      // LocalStorage unavailable, continue to fresh init
    }

    // Fresh initialization: generate randomized sequence of the 29 wishes
    const initialShuffled = shuffleArray(WISHES_DATA.map((w) => w.id));
    setShuffledWishIds(initialShuffled);
  }, []);

  // Save progress to LocalStorage on changes
  useEffect(() => {
    if (shuffledWishIds.length === 0) return;
    try {
      const dataToSave = {
        shuffledWishIds,
        releasedWishIds,
        openedWishIds: Array.from(openedWishIds),
        viewMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // ignore
    }
  }, [shuffledWishIds, releasedWishIds, openedWishIds, viewMode]);

  // Subtle opening message timer: fades away after 5.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 5500);
    return () => clearTimeout(timer);
  }, []);

  // Total remaining stars in the jar
  const remainingInJarCount = Math.max(0, WISHES_DATA.length - releasedWishIds.length);
  const discoveredCount = openedWishIds.size;
  const isAllWishesOpened = discoveredCount === WISHES_DATA.length;

  // The wishes that have been released so far
  const releasedWishes: Wish[] = useMemo(() => {
    return releasedWishIds
      .map((id) => wishesById.get(id))
      .filter((w): w is Wish => Boolean(w));
  }, [releasedWishIds, wishesById]);

  // Handler: Click the Jar to pop a star
  const handleJarClick = useCallback(() => {
    if (isPopping || isWobbling || remainingInJarCount <= 0) {
      return;
    }

    // Identify next unreleased wish in sequence
    const nextWishId = shuffledWishIds[releasedWishIds.length];
    if (!nextWishId) return;

    const nextWish = wishesById.get(nextWishId);
    if (!nextWish) return;

    // Trigger animations and sounds
    setIsWobbling(true);
    setIsPopping(true);
    setJustPoppedWish(nextWish);
    soundManager.playJarPop();

    // Jar wobble ends after 650ms
    setTimeout(() => {
      setIsWobbling(false);
    }, 650);
  }, [isPopping, isWobbling, remainingInJarCount, shuffledWishIds, releasedWishIds.length, wishesById]);

  // Handler: Star popping trajectory animation completed
  const handlePoppingAnimationComplete = useCallback(() => {
    if (justPoppedWish) {
      setReleasedWishIds((prev) => [...prev, justPoppedWish.id]);
    }
    setJustPoppedWish(null);
    setIsPopping(false);
  }, [justPoppedWish]);

  // Handler: Click a released star to open wish note
  const handleOpenStar = useCallback((wish: Wish) => {
    soundManager.playStarOpen();
    setActiveWish(wish);
    // Mark wish as opened
    setOpenedWishIds((prev) => {
      const next = new Set(prev);
      next.add(wish.id);
      return next;
    });
  }, []);

  // Handler: Close wish note
  const handleCloseWishModal = useCallback(() => {
    setActiveWish(null);
  }, []);

  // Handler: Click the Special Golden Star
  const handleGoldenStarClick = useCallback(() => {
    soundManager.playGoldenFanfare();
    setViewMode('letter');
  }, []);

  // Handler: Reset entire experience
  const handleResetExperience = useCallback(() => {
    const newShuffled = shuffleArray(WISHES_DATA.map((w) => w.id));
    setShuffledWishIds(newShuffled);
    setReleasedWishIds([]);
    setOpenedWishIds(new Set());
    setViewMode('jar');
    setActiveWish(null);
    setIsPopping(false);
    setIsWobbling(false);
    setJustPoppedWish(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="relative min-h-screen text-[#f4efe6] overflow-x-hidden font-sans selection:bg-amber-400/30 selection:text-amber-100 flex flex-col">
      {/* Background Starry Night Canvas */}
      <BackgroundStars />

      {/* Header with sound, progress counter, and reset */}
      <HeaderBar
        discoveredCount={discoveredCount}
        totalCount={WISHES_DATA.length}
        onReset={handleResetExperience}
        onOpenLetter={() => setViewMode('letter')}
        canOpenLetter={isAllWishesOpened}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start w-full">
        {/* Subtle opening greeting message that fades away */}
        <AnimatePresence>
          {showWelcomeMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
              className="my-1 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-200/90 text-xs font-serif italic text-center pointer-events-none shadow-xs"
            >
              &ldquo;A little something made with all my love.&rdquo;
            </motion.div>
          )}
        </AnimatePresence>

        {/* View 1: The Interactive Star Jar Experience */}
        {viewMode === 'jar' && (
          <div className="w-full flex flex-col items-center px-4 py-4 sm:py-6">
            {/* Header Titles */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-xl mx-auto mb-6"
            >
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100 tracking-tight drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]">
                29 Little Stars for Shashank
              </h1>

              <p className="font-handwriting text-xl sm:text-2xl text-amber-100/90 mt-2.5 leading-snug">
                &ldquo;For your 29th birthday, I made you a little universe of wishes. One star at a time, just for you.&rdquo;
              </p>
            </motion.div>

            {/* Special Golden Star Bonus: appears above jar ONLY after all 29 wishes opened! */}
            <AnimatePresence>
              {isAllWishesOpened && (
                <GoldenStarBonus onGoldenStarClick={handleGoldenStarClick} />
              )}
            </AnimatePresence>

            {/* Glass Jar Section */}
            <div className="relative my-4 flex flex-col items-center">
              {/* Popping Star in Flight */}
              {isPopping && (
                <PoppingStarAnimation
                  wish={justPoppedWish}
                  onAnimationComplete={handlePoppingAnimationComplete}
                />
              )}

              {/* The Glass Jar */}
              <GlassJar
                remainingCount={remainingInJarCount}
                totalCount={WISHES_DATA.length}
                isWobbling={isWobbling}
                isAllWishesOpened={isAllWishesOpened}
                onJarClick={handleJarClick}
                disabled={isPopping}
              />

              {/* Text Below Jar */}
              <div className="mt-5 text-center flex flex-col items-center">
                {remainingInJarCount > 0 ? (
                  <>
                    <p className="font-handwriting text-2xl text-amber-200/95 tracking-wide animate-pulse">
                      Go on, pick a star. ♡
                    </p>

                    <p className="text-xs font-serif text-amber-100/60 mt-1 uppercase tracking-widest">
                      {remainingInJarCount === 29 ? (
                        <span>29 wishes waiting for you</span>
                      ) : (
                        <span>{remainingInJarCount} {remainingInJarCount === 1 ? 'wish' : 'wishes'} waiting for you in the jar</span>
                      )}
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="font-handwriting text-2xl text-amber-300">
                      The jar is empty, but your universe is full. ♡
                    </p>
                    <p className="text-xs font-serif text-amber-100/60 mt-1">
                      {isAllWishesOpened 
                        ? 'All 29 wishes have been unlocked!' 
                        : `Open all released stars below (${discoveredCount} of 29 read so far)`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Released Stars Display / Keepsake Collection */}
            <StarCollection
              releasedWishes={releasedWishes}
              openedWishIds={openedWishIds}
              onStarClick={handleOpenStar}
              activeWishId={activeWish?.id}
            />
          </div>
        )}

        {/* View 2: The Handwritten Birthday Letter */}
        {viewMode === 'letter' && (
          <BirthdayLetter
            onContinueToFinal={() => setViewMode('final')}
            onBackToJar={() => setViewMode('jar')}
          />
        )}

        {/* View 3: The Final Moment */}
        {viewMode === 'final' && (
          <FinalMoment
            onRestartExperience={handleResetExperience}
            onReviewWishes={() => setViewMode('jar')}
          />
        )}
      </main>

      {/* Wish Card Modal Dialog */}
      {activeWish && (
        <WishCardModal
          wish={activeWish}
          onClose={handleCloseWishModal}
        />
      )}
    </div>
  );
}
