'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { incrementPropertyViews } from '@/lib/api';

interface Props {
  propertyId: string;
  initialViews: number;
  children?: ReactNode;
}

const ViewsContext = createContext<number | null>(null);

function PropertyVisit({ propertyId, initialViews, children }: Props) {
  const [views, setViews] = useState(initialViews);
  const request = useRef<Promise<number | null> | null>(null);

  useEffect(() => {
    let active = true;
    // Both responsive displays share this request. Reuse it when React replays
    // the effect in Strict Mode, while allowing the replay to receive its result.
    request.current ??= incrementPropertyViews(propertyId);
    request.current.then((count) => {
      if (active && count != null) setViews(count);
    });
    return () => { active = false; };
  }, [propertyId]);

  return <ViewsContext.Provider value={views}>{children}</ViewsContext.Provider>;
}

export function ViewCounterProvider(props: Props) {
  // A property change is a new visit: reset the count and request, and prevent
  // the previous property's pending response from updating the new display.
  return <PropertyVisit key={props.propertyId} {...props} />;
}

export default function ViewCounter() {
  const views = useContext(ViewsContext);
  if (views === null) throw new Error('ViewCounter requires a ViewCounterProvider');

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
