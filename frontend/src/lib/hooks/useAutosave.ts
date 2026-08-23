import { useRef, useCallback } from 'react';

export function useAutosave(saveFn: (data: any) => Promise<void>, delayMs = 2500) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSave = useCallback((data: any) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveFn(data);
    }, delayMs);
  }, [saveFn, delayMs]);

  return triggerSave;
}
