'use client';

import { useEffect, useRef, useState } from 'react';
import { incrementPropertyViews } from '@/lib/api';

interface Props {
  propertyId: number;
  initialViews: number;
}

export default function ViewCounter({ propertyId, initialViews }: Props) {
  const [views, setViews] = useState(initialViews);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    incrementPropertyViews(propertyId).then(() => {
      setViews((v) => v + 1);
    });
  }, [propertyId]);

  return (
    <div className="flex items-center gap-1.5 text-[15px] md:text-[16px] text-black/60">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>{views} Interessati</span>
    </div>
  );
}
