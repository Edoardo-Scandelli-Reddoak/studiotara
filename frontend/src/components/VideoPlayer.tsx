'use client';

import { useState } from 'react';

interface Props {
  videoId: string;
  title?: string;
}

export default function VideoPlayer({ videoId, title = 'Video Studio Tara' }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full h-full group cursor-pointer bg-gradient-to-br from-[#092d74] via-[#1155da] to-[#0f45b1] overflow-hidden"
      aria-label={`Riproduci ${title}`}
    >
      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-[180px] h-[180px] rounded-full bg-white/[0.04]" />
      <div className="absolute -bottom-16 -left-16 w-[220px] h-[220px] rounded-full bg-white/[0.04]" />
      <div className="absolute top-1/4 right-1/4 w-[100px] h-[100px] rounded-full bg-white/[0.03]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 md:gap-5">
        {/* Play button */}
        <div className="w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-full bg-white flex items-center justify-center shadow-[0_6px_30px_rgba(0,0,0,0.25)] group-hover:scale-110 transition-transform duration-300">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="#d2072a"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1"
          >
            <path d="M8.5 6.2a1 1 0 0 1 1.04.04l8 5.5a1 1 0 0 1 0 1.66l-8 5.08A1 1 0 0 1 8 17.58V6.92a1 1 0 0 1 .5-.72z" rx="1" />
          </svg>
        </div>

        {/* Label */}
        <p className="text-white/80 text-[13px] md:text-[14px] font-medium tracking-[0.5px] group-hover:text-white transition-colors duration-300">
          Guarda il video
        </p>
      </div>
    </button>
  );
}
