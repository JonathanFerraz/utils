import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

const useEnhancedEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function useEventCallback(fn: any) {
  const ref = useRef(fn);
  useEnhancedEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args) => (0 as any, ref.current)(...args), []);
}
