'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { direction } = useLanguage();
  const isRtl = direction === 'rtl';

  useEffect(() => {
    const updateProgress = () => {
      const scrollEl = document.scrollingElement || document.documentElement;
      const totalScroll = scrollEl.scrollHeight - window.innerHeight;

      if (totalScroll <= 0) {
        if (barRef.current) barRef.current.style.width = '0%';
        if (containerRef.current) containerRef.current.style.opacity = '0';
        return;
      }

      const currentScroll = window.scrollY || window.pageYOffset || scrollEl.scrollTop || 0;
      const pct = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));

      if (barRef.current) {
        barRef.current.style.width = `${pct}%`;
      }
      if (containerRef.current) {
        containerRef.current.style.opacity = currentScroll > 5 ? '1' : '0';
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    document.addEventListener('scroll', updateProgress, { passive: true });

    // Initial check
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      document.removeEventListener('scroll', updateProgress);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 h-[3.5px] z-[9999] pointer-events-none transition-opacity duration-200"
    >
      {/* Background track (semi-transparent subtle track) */}
      <div className="absolute inset-0 bg-slate-200/40" />

      {/* Dynamic Progress Fill with Brand Gradient & Glow - real-time direct DOM tracking */}
      <div
        ref={barRef}
        className={`h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 relative shadow-[0_0_10px_rgba(37,99,235,0.7)] ${
          isRtl ? 'right-0 ml-auto' : 'left-0 mr-auto'
        }`}
        style={{ width: '0%' }}
      >
        {/* Glowing Head / Leading Edge */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${
            isRtl ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
          } w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9),0_0_14px_rgba(59,130,246,0.9)]`}
        />
      </div>
    </div>
  );
}
