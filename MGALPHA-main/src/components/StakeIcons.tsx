import React from 'react';

interface StakeDiamondProps {
  className?: string;
  faded?: boolean;
}

export const StakeDiamond: React.FC<StakeDiamondProps> = ({
  className = 'w-7 h-7 sm:w-9 sm:h-9',
  faded = false,
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`${className} transition-transform duration-200 ${
        faded
          ? 'opacity-30 filter grayscale-[40%]'
          : 'drop-shadow-[0_0_10px_rgba(0,231,1,0.7)] animate-in zoom-in-75 duration-200'
      }`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="diamondShine" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#c2ffc2" />
          <stop offset="50%" stopColor="#00e701" />
          <stop offset="100%" stopColor="#008f01" />
        </radialGradient>
      </defs>

      {/* Outer subtle glow outline */}
      <polygon
        points="19,16 45,16 55,27 32,52 9,27"
        fill="rgba(0, 231, 1, 0.25)"
        className={faded ? 'hidden' : 'block'}
      />

      {/* Main Diamond Facets */}
      {/* Top Table / Upper facets */}
      <polygon points="21,17 43,17 32,27" fill="#69ff69" />
      <polygon points="21,17 9,27 21,27" fill="#00e701" />
      <polygon points="43,17 55,27 43,27" fill="#00b801" />
      <polygon points="21,27 43,27 32,27" fill="#4dff4d" />

      {/* Upper Side Trim Facets */}
      <polygon points="9,27 21,17 21,27" fill="#00c801" />
      <polygon points="55,27 43,17 43,27" fill="#009e01" />

      {/* Bottom Pavilion Facets */}
      <polygon points="9,27 21,27 32,50" fill="#008001" />
      <polygon points="21,27 43,27 32,50" fill="#00d401" />
      <polygon points="43,27 55,27 32,50" fill="#006b01" />

      {/* Highlight Crisp Facet Creases */}
      <polyline
        points="19,17 45,17 55,27 32,50 9,27 19,17"
        stroke="#99ff99"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1="21" y1="27" x2="43" y2="27" stroke="#b3ffb3" strokeWidth="1" />
      <line x1="32" y1="27" x2="32" y2="50" stroke="#80ff80" strokeWidth="1" />
      <line x1="21" y1="17" x2="32" y2="27" stroke="#b3ffb3" strokeWidth="1" />
      <line x1="43" y1="17" x2="32" y2="27" stroke="#b3ffb3" strokeWidth="1" />

      {/* Gleam Sparkle dot */}
      <circle cx="25" cy="22" r="1.5" fill="#ffffff" className={faded ? 'hidden' : 'block'} />
    </svg>
  );
};

interface StakeBombProps {
  className?: string;
  faded?: boolean;
}

export const StakeBomb: React.FC<StakeBombProps> = ({
  className = 'w-7 h-7 sm:w-9 sm:h-9',
  faded = false,
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`${className} transition-transform duration-200 ${
        faded
          ? 'opacity-25 filter grayscale-[50%]'
          : 'drop-shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-in zoom-in-75 duration-200'
      }`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bombGlow" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ff4d6d" />
          <stop offset="55%" stopColor="#e11d48" />
          <stop offset="90%" stopColor="#9f1239" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>
        <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Curved Fuse */}
      <path
        d="M36 22C38 18 42 16 46 17C48 17.5 49 19 50 17"
        stroke="#78716c"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Bomb Cap */}
      <rect x="30" y="21" width="8" height="4" rx="1.5" fill="#52525b" />

      {/* Main Bomb Sphere */}
      <circle cx="32" cy="37" r="16" fill="url(#bombGlow)" />

      {/* 3D Rim lighting */}
      <circle
        cx="32"
        cy="37"
        r="15"
        stroke="#fda4af"
        strokeWidth="1.2"
        strokeDasharray="25 60"
        strokeDashoffset="10"
        opacity="0.8"
      />

      {/* Sparkling fuse tip */}
      <g transform="translate(50, 16)">
        <circle cx="0" cy="0" r="5" fill="url(#sparkGlow)" />
        {/* Star Spark Rays */}
        <path
          d="M0 -6L0 6M-6 0L6 0M-4 -4L4 4M-4 4L4 -4"
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
      </g>
    </svg>
  );
};
