'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  type?: 'up' | 'left' | 'right' | 'scale';
  delay?: number; // delay in milliseconds
  className?: string;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  type = 'up',
  delay = 0,
  className = '',
  threshold = 0.12,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const getBaseClass = () => {
    switch (type) {
      case 'left':
        return 'reveal-left';
      case 'right':
        return 'reveal-right';
      case 'scale':
        return 'reveal-scale';
      default:
        return 'reveal-init';
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: delay > 0 ? `${delay}ms` : undefined }}
      className={`${getBaseClass()} ${isRevealed ? 'is-revealed' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
