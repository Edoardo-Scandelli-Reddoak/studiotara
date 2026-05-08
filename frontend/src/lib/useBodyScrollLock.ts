"use client";

import { useEffect } from "react";

let lockCount = 0;

function applyLock() {
  if (lockCount === 0) {
    document.body.classList.add("no-scroll");
  }
  lockCount++;
}

function releaseLock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.classList.remove("no-scroll");
  }
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    applyLock();
    return () => releaseLock();
  }, [active]);
}
