import React, { useMemo } from 'react';

export const BackgroundStars: React.FC = () => {
  // Precompute stars with deterministic positions so they don't jump around on re-renders
  const backgroundStars = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 65; i++) {
      const top = (i * 17.3) % 100;
      const left = (i * 23.7) % 100;
      const size = (i % 3 === 0) ? 2.5 : (i % 2 === 0) ? 1.8 : 1.2;
      const duration = 2.5 + (i % 5) * 1.2;
      const delay = (i % 7) * 0.6;
      const opacity = 0.25 + (i % 4) * 0.2;
      const isGold = i % 5 === 0;

      stars.push({
        id: i,
        top: `${top}%`,
        left: `${left}%`,
        size,
        duration: `${duration}s`,
        delay: `${delay}s`,
        opacity,
        isGold,
      });
    }
    return stars;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep dreamy celestial gradient: dusky lavender to midnight deep blue */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#0f1026] via-[#141533] to-[#0a0a16]" 
      />

      {/* Subtle warm nebula glow in center-top */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(168,85,247,0.25) 45%, rgba(251,191,36,0.15) 75%, transparent 100%)',
        }}
      />

      {/* Soft warm gold pool near the jar base */}
      <div 
        className="absolute top-[55%] left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.35) 0%, rgba(217,119,6,0.15) 60%, transparent 100%)',
        }}
      />

      {/* Tiny twinkling stars */}
      {backgroundStars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.isGold ? '#fef08a' : '#ffffff',
            boxShadow: star.isGold 
              ? '0 0 6px rgba(254, 240, 138, 0.8)' 
              : '0 0 4px rgba(255, 255, 255, 0.6)',
            animation: `twinkle ${star.duration} ease-in-out infinite`,
            animationDelay: star.delay,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};
