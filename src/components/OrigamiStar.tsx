import React from 'react';
import { StarColorTheme } from '../types';

interface OrigamiStarProps {
  colorTheme?: StarColorTheme;
  size?: number;
  className?: string;
  isGoldenSpecial?: boolean;
  isOpened?: boolean;
  isGlowing?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

// Color palettes for 3D folded facets (light, mid, shadow, highlight, glow)
const COLOR_PALETTES: Record<StarColorTheme, {
  light: string;
  mid: string;
  shadow: string;
  dark: string;
  highlight: string;
  glow: string;
  border: string;
}> = {
  blossom: {
    light: '#ffe4ec',
    mid: '#fbcfe8',
    shadow: '#f472b6',
    dark: '#db2777',
    highlight: '#ffffff',
    glow: 'rgba(244, 114, 182, 0.45)',
    border: 'rgba(219, 39, 119, 0.25)',
  },
  lavender: {
    light: '#f3e8ff',
    mid: '#e9d5ff',
    shadow: '#c084fc',
    dark: '#9333ea',
    highlight: '#ffffff',
    glow: 'rgba(192, 132, 252, 0.45)',
    border: 'rgba(147, 51, 234, 0.25)',
  },
  cream: {
    light: '#fffef0',
    mid: '#fef3c7',
    shadow: '#fde047',
    dark: '#d97706',
    highlight: '#ffffff',
    glow: 'rgba(253, 224, 71, 0.45)',
    border: 'rgba(217, 119, 6, 0.25)',
  },
  sky: {
    light: '#f0f9ff',
    mid: '#bae6fd',
    shadow: '#7dd3fc',
    dark: '#0284c7',
    highlight: '#ffffff',
    glow: 'rgba(125, 211, 252, 0.45)',
    border: 'rgba(2, 132, 199, 0.25)',
  },
  mint: {
    light: '#f0fdf4',
    mid: '#bbf7d0',
    shadow: '#86efac',
    dark: '#16a34a',
    highlight: '#ffffff',
    glow: 'rgba(134, 239, 172, 0.45)',
    border: 'rgba(22, 163, 74, 0.25)',
  },
  gold: {
    light: '#fffbeb',
    mid: '#fde047',
    shadow: '#eab308',
    dark: '#b45309',
    highlight: '#ffffff',
    glow: 'rgba(250, 204, 21, 0.75)',
    border: 'rgba(180, 83, 9, 0.35)',
  },
};

export const OrigamiStar: React.FC<OrigamiStarProps> = ({
  colorTheme = 'blossom',
  size = 48,
  className = '',
  isGoldenSpecial = false,
  isOpened = false,
  isGlowing = false,
  onClick,
  style,
}) => {
  const theme = isGoldenSpecial ? COLOR_PALETTES.gold : COLOR_PALETTES[colorTheme];
  const uniqueId = React.useId().replace(/:/g, '');

  // Precomputed 2D projection points for puffy origami lucky star:
  // Center is slightly offset to give 3D tilt perspective: (50, 48)
  // 5 outer points (tips) and 5 inner points (valleys)
  // Each arm has 2 triangular facets meeting at ridge line: center -> tip
  const cx = 50;
  const cy = 48;

  // Outer Tips (T0..T4) and Inner Valleys (V0..V4)
  // T0 (top), T1 (top-right), T2 (bottom-right), T3 (bottom-left), T4 (top-left)
  const T = [
    { x: 50, y: 8 },    // Top
    { x: 91, y: 38 },   // Top Right
    { x: 75, y: 88 },   // Bottom Right
    { x: 25, y: 88 },   // Bottom Left
    { x: 9, y: 38 },    // Top Left
  ];

  const V = [
    { x: 65, y: 35 },   // Valley 0 (between T0 and T1)
    { x: 66, y: 64 },   // Valley 1 (between T1 and T2)
    { x: 50, y: 72 },   // Valley 2 (between T2 and T3)
    { x: 34, y: 64 },   // Valley 3 (between T3 and T4)
    { x: 35, y: 35 },   // Valley 4 (between T4 and T0)
  ];

  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      className={`relative inline-flex items-center justify-center select-none transition-transform ${
        onClick ? 'cursor-pointer active:scale-95' : ''
      } ${className}`}
    >
      {/* Subtle outer aura/glow if glowing or special golden */}
      {(isGlowing || isGoldenSpecial) && (
        <div
          className={`absolute inset-0 rounded-full blur-md pointer-events-none transition-opacity ${
            isGoldenSpecial
              ? 'bg-amber-400/50 scale-125 animate-golden-pulse'
              : 'bg-white/35 scale-110'
          }`}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]"
      >
        <defs>
          {/* Subtle gradient for paper depth */}
          <linearGradient id={`grad-light-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.highlight} stopOpacity="0.9" />
            <stop offset="60%" stopColor={theme.light} />
            <stop offset="100%" stopColor={theme.mid} />
          </linearGradient>

          <linearGradient id={`grad-mid-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.light} />
            <stop offset="50%" stopColor={theme.mid} />
            <stop offset="100%" stopColor={theme.shadow} />
          </linearGradient>

          <linearGradient id={`grad-shadow-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.mid} />
            <stop offset="70%" stopColor={theme.shadow} />
            <stop offset="100%" stopColor={theme.dark} />
          </linearGradient>

          <linearGradient id={`grad-gold-special-${uniqueId}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="35%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Paper drop shadow filter */}
          <filter id={`shadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Base Star Silhouette with shadow */}
        <path
          d={`M ${T[0].x} ${T[0].y} L ${V[0].x} ${V[0].y} L ${T[1].x} ${T[1].y} L ${V[1].x} ${V[1].y} L ${T[2].x} ${T[2].y} L ${V[2].x} ${V[2].y} L ${T[3].x} ${T[3].y} L ${V[3].x} ${V[3].y} L ${T[4].x} ${T[4].y} L ${V[4].x} ${V[4].y} Z`}
          fill={theme.shadow}
          filter={`url(#shadow-${uniqueId})`}
        />

        {/* 10 Folded Facets of the Origami Star (Puffy 3D Facet Geometry) */}
        {/* Arm 0 (Top): Left facet & Right facet */}
        <polygon
          points={`${cx},${cy} ${T[0].x},${T[0].y} ${V[4].x},${V[4].y}`}
          fill={isGoldenSpecial ? `url(#grad-gold-special-${uniqueId})` : `url(#grad-light-${uniqueId})`}
        />
        <polygon
          points={`${cx},${cy} ${T[0].x},${T[0].y} ${V[0].x},${V[0].y}`}
          fill={isGoldenSpecial ? theme.mid : `url(#grad-mid-${uniqueId})`}
        />

        {/* Arm 1 (Top-Right): Left facet & Right facet */}
        <polygon
          points={`${cx},${cy} ${T[1].x},${T[1].y} ${V[0].x},${V[0].y}`}
          fill={isGoldenSpecial ? theme.light : `url(#grad-light-${uniqueId})`}
        />
        <polygon
          points={`${cx},${cy} ${T[1].x},${T[1].y} ${V[1].x},${V[1].y}`}
          fill={isGoldenSpecial ? theme.shadow : `url(#grad-shadow-${uniqueId})`}
        />

        {/* Arm 2 (Bottom-Right): Left facet & Right facet */}
        <polygon
          points={`${cx},${cy} ${T[2].x},${T[2].y} ${V[1].x},${V[1].y}`}
          fill={isGoldenSpecial ? theme.mid : `url(#grad-mid-${uniqueId})`}
        />
        <polygon
          points={`${cx},${cy} ${T[2].x},${T[2].y} ${V[2].x},${V[2].y}`}
          fill={isGoldenSpecial ? theme.dark : `url(#grad-shadow-${uniqueId})`}
        />

        {/* Arm 3 (Bottom-Left): Left facet & Right facet */}
        <polygon
          points={`${cx},${cy} ${T[3].x},${T[3].y} ${V[2].x},${V[2].y}`}
          fill={isGoldenSpecial ? theme.shadow : `url(#grad-shadow-${uniqueId})`}
        />
        <polygon
          points={`${cx},${cy} ${T[3].x},${T[3].y} ${V[3].x},${V[3].y}`}
          fill={isGoldenSpecial ? theme.mid : `url(#grad-mid-${uniqueId})`}
        />

        {/* Arm 4 (Top-Left): Left facet & Right facet */}
        <polygon
          points={`${cx},${cy} ${T[4].x},${T[4].y} ${V[3].x},${V[3].y}`}
          fill={isGoldenSpecial ? theme.mid : `url(#grad-light-${uniqueId})`}
        />
        <polygon
          points={`${cx},${cy} ${T[4].x},${T[4].y} ${V[4].x},${V[4].y}`}
          fill={isGoldenSpecial ? theme.light : `url(#grad-light-${uniqueId})`}
        />

        {/* Crease & Ridge Fold Lines for realistic origami paper texture */}
        <line x1={cx} y1={cy} x2={T[0].x} y2={T[0].y} stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
        <line x1={cx} y1={cy} x2={T[1].x} y2={T[1].y} stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <line x1={cx} y1={cy} x2={T[2].x} y2={T[2].y} stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
        <line x1={cx} y1={cy} x2={T[3].x} y2={T[3].y} stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
        <line x1={cx} y1={cy} x2={T[4].x} y2={T[4].y} stroke="rgba(255,255,255,0.6)" strokeWidth="1" />

        {/* Valley fold creases */}
        <line x1={cx} y1={cy} x2={V[0].x} y2={V[0].y} stroke="rgba(0,0,0,0.2)" strokeWidth="0.9" />
        <line x1={cx} y1={cy} x2={V[1].x} y2={V[1].y} stroke="rgba(0,0,0,0.28)" strokeWidth="0.9" />
        <line x1={cx} y1={cy} x2={V[2].x} y2={V[2].y} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
        <line x1={cx} y1={cy} x2={V[3].x} y2={V[3].y} stroke="rgba(0,0,0,0.25)" strokeWidth="0.9" />
        <line x1={cx} y1={cy} x2={V[4].x} y2={V[4].y} stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />

        {/* Puffy center apex highlight */}
        <circle
          cx={cx}
          cy={cy}
          r={isGoldenSpecial ? 3.5 : 2.5}
          fill={theme.highlight}
          opacity="0.85"
        />

        {/* Golden star extra sparkle accents */}
        {isGoldenSpecial && (
          <>
            <path
              d="M 50 20 L 52 26 L 58 28 L 52 30 L 50 36 L 48 30 L 42 28 L 48 26 Z"
              fill="#ffffff"
              opacity="0.9"
            />
            <circle cx="70" cy="35" r="1.5" fill="#ffffff" opacity="0.9" />
            <circle cx="30" cy="40" r="1.5" fill="#ffffff" opacity="0.9" />
          </>
        )}

        {/* Subtle indicator dot if star has already been opened */}
        {isOpened && !isGoldenSpecial && (
          <circle cx={cx} cy={cy} r="3" fill="#ffffff" stroke={theme.dark} strokeWidth="0.8" />
        )}
      </svg>
    </div>
  );
};
