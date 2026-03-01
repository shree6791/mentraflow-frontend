import React from 'react';

/**
 * MentraFlow logo: decision point — one moment (circle) with paths branching from it.
 * The moment of decision. Works in light (teal) or dark (e.g. gold on dark) contexts.
 */
const MentraFlowLogo = ({ className = 'h-10 w-10', color = '#0E7C7B' }) => (
  <svg
    viewBox="0 0 32 32"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    {/* Central node — the moment of decision */}
    <circle cx="16" cy="14" r="5" fill={color} />
    {/* Branching paths: one down, two out */}
    <path
      d="M16 19 v6 M16 19 l-5 5 M16 19 l5 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default MentraFlowLogo;
