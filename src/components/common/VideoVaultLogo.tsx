"use client";

import React, { useMemo } from "react";

interface VideoVaultLogoProps {
  className?: string;
  size?: number;
}

export default function VideoVaultLogo({
  className,
  size = 48,
}: VideoVaultLogoProps) {
  // Generate unique IDs for SVG elements to prevent conflicts when multiple logos are rendered
  const uniqueId = useMemo(
    () => Math.random().toString(36).substring(2, 9),
    []
  );

  // Create unique identifiers for each SVG element
  const ids = {
    cameraGradient: `camera-gradient-${uniqueId}`,
    lensGradient: `lens-gradient-${uniqueId}`,
    playGradient: `play-gradient-${uniqueId}`,
    cameraShadow: `camera-shadow-${uniqueId}`,
    innerGlow: `inner-glow-${uniqueId}`,
    noisePattern: `noise-pattern-${uniqueId}`,
  };

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      width={size}
      height={size}
      style={{ minWidth: size, minHeight: size }}
    >
      <defs>
        <linearGradient
          id={ids.cameraGradient}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: "#0ea5e9", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#4f46e5", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#6366f1", stopOpacity: 1 }}
          />
        </linearGradient>

        <linearGradient
          id={ids.lensGradient}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#1e40af", stopOpacity: 1 }}
          />
        </linearGradient>

        <linearGradient
          id={ids.playGradient}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#7e22ce", stopOpacity: 1 }}
          />
        </linearGradient>

        <filter
          id={ids.cameraShadow}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow dx="0.6" dy="1" stdDeviation="1" floodOpacity="0.4" />
        </filter>

        <filter id={ids.innerGlow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <pattern
          id={ids.noisePattern}
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <rect width="100" height="100" fill="#ffffff" opacity="0.03" />
          <rect width="25" height="25" fill="#ffffff" opacity="0.05" />
          <rect
            x="25"
            y="25"
            width="25"
            height="25"
            fill="#ffffff"
            opacity="0.05"
          />
          <rect
            x="50"
            y="50"
            width="25"
            height="25"
            fill="#ffffff"
            opacity="0.05"
          />
          <rect
            x="75"
            y="75"
            width="25"
            height="25"
            fill="#ffffff"
            opacity="0.05"
          />
        </pattern>
      </defs>

      {/* Background glow effect */}
      <rect
        x="6"
        y="12"
        width="28"
        height="24"
        rx="7"
        ry="7"
        fill="#4f46e5"
        opacity="0.2"
        filter={`url(#${ids.innerGlow})`}
        transform="translate(1, 1)"
      />

      {/* Main camera body */}
      <rect
        x="6"
        y="12"
        width="28"
        height="24"
        rx="7"
        ry="7"
        fill={`url(#${ids.cameraGradient})`}
        filter={`url(#${ids.cameraShadow})`}
        stroke="#1e293b"
        strokeWidth="1.4"
      />

      {/* Texture overlay */}
      <rect
        x="6"
        y="12"
        width="28"
        height="24"
        rx="7"
        ry="7"
        fill={`url(#${ids.noisePattern})`}
      />

      {/* Glass effect overlay */}
      <rect
        x="6"
        y="12"
        width="28"
        height="12"
        rx="7"
        ry="7"
        fill="#ffffff"
        opacity="0.1"
      />

      {/* Camera lens/side */}
      <path
        d="M34,20 L42,16 L42,32 L34,28 Z"
        fill={`url(#${ids.lensGradient})`}
        stroke="#1e293b"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Lens texture */}
      <path
        d="M34,20 L42,16 L42,32 L34,28 Z"
        fill={`url(#${ids.noisePattern})`}
      />

      {/* Lens highlight */}
      <path d="M35,21 L41,18 L41,20 L35,23 Z" fill="#ffffff" opacity="0.15" />

      {/* LARGER Play button with glow */}
      <path
        d="M14,18 L28,24 L14,30 Z"
        fill={`url(#${ids.playGradient})`}
        stroke="#1e293b"
        strokeWidth="1"
        strokeLinejoin="round"
        filter={`url(#${ids.innerGlow})`}
      />

      {/* Play button highlight */}
      <path d="M15.6,20 L25,24 L15.6,28 Z" fill="#ffffff" opacity="0.3" />

      {/* Camera details */}
      <circle cx="11" cy="17" r="1.6" fill="#ffffff" opacity="0.7" />
      <circle cx="11" cy="17" r="0.8" fill="#1e293b" opacity="0.8" />

      {/* Modern accent lines */}
      <path
        d="M10,32 L30,32"
        stroke="#ffffff"
        strokeWidth="0.6"
        strokeDasharray="1.4 1.4"
        opacity="0.4"
      />

      {/* Decorative elements */}
      <circle cx="20" cy="15" r="0.6" fill="#ffffff" opacity="0.5" />
      <circle cx="24" cy="15" r="0.6" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}
