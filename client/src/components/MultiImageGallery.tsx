'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface MultiImageGalleryProps {
  images: string[];
  alt: string;
}

export const MultiImageGallery: React.FC<MultiImageGalleryProps> = ({ images, alt }) => {
  const safeImages = images && images.length > 0 ? images : ['/images/showcase/hero_scientist_clean.png'];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = safeImages[selectedIndex] || safeImages[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % safeImages.length);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Featured Big Image Stage */}
      <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-lg group">
        <Image
          src={currentImage}
          alt={`${alt} - Photo ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-center transition-all duration-500 group-hover:scale-103"
          priority
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Image Counter Badge */}
        <div className="absolute top-4 start-4 px-3 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-xs font-bold border border-white/10 shadow-sm">
          <span>{selectedIndex + 1} / {safeImages.length}</span>
        </div>

        {/* Lightbox Trigger */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 end-4 p-2 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white transition-colors backdrop-blur-md border border-white/10 shadow-sm cursor-pointer"
          aria-label="Enlarge image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Left & Right Stage Cycling Arrows (if more than 1 image) */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Image"
              className="absolute start-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/10 shadow-md transition-all active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Image"
              className="absolute end-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/10 shadow-md transition-all active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row (Interactive multi-image selection) */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto py-1 px-0.5 no-scrollbar">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 transition-all cursor-pointer border-2 ${
                idx === selectedIndex
                  ? 'border-blue-600 scale-102 shadow-md'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                sizes="100px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 end-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage}
              alt={alt}
              fill
              className="object-contain"
              priority
            />
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute start-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute end-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
