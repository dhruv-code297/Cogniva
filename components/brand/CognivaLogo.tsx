import React from "react";
import Link from "next/link";

interface CognivaLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  href?: string;
}

export function CognivaLogo({
  size = 36,
  className = "",
  showWordmark = true,
  wordmarkClassName = "text-xl font-bold tracking-tight text-slate-900",
  href,
}: CognivaLogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="cogniva-bg-grad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="cogniva-spark-grad" x1="20" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="cogniva-ambient-glow" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Rounded base */}
          <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#cogniva-bg-grad)" />
          <rect x="4.5" y="4.5" width="55" height="55" rx="15.5" stroke="#334155" strokeOpacity="0.7" strokeWidth="1" />

          {/* Glow */}
          <circle cx="32" cy="32" r="16" fill="url(#cogniva-ambient-glow)" />

          {/* Core 4-point cognitive star */}
          <path
            d="M32 15C32 24.3888 24.3888 32 15 32C24.3888 32 32 39.6112 32 49C32 39.6112 39.6112 32 49 32C39.6112 32 32 24.3888 32 15Z"
            fill="url(#cogniva-spark-grad)"
          />

          {/* Center detail */}
          <path d="M32 27L36 32L32 37L28 32L32 27Z" fill="#0F172A" opacity="0.15" />
          <circle cx="32" cy="32" r="2.5" fill="#0F172A" />

          {/* Satellite spark nodes */}
          <circle cx="45" cy="19" r="2" fill="#38BDF8" opacity="0.9" />
          <circle cx="19" cy="45" r="1.5" fill="#818CF8" opacity="0.8" />
        </svg>
      </div>

      {showWordmark && (
        <span className={wordmarkClassName}>
          Cogniva
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
