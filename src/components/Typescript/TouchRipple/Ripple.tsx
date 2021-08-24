import React, { useEffect, useLayoutEffect, useState } from 'react';
import clsx from 'clsx';
import useEventCallback from './utils/useEventCallback';

const useEnhancedEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface RippleProps {
  classes: Object;
  rippleX?: number | any;
  rippleY?: number | any;
  rippleSize?: number | any;
  in?: boolean;
  onExited?: () => void;
  timeout: number | undefined;
}

export const Ripple: React.FC<RippleProps> = (props: RippleProps) => {
  const {
    rippleX,
    rippleY,
    rippleSize,
    in: inProp,
    onExited = () => {},
    timeout,
  } = props;

  const [leaving, setLeaving] = useState<boolean>(false);

  const rippleClassName = clsx('ripple', 'rippleVisible');

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX,
  };

  const childClassName = clsx('child', {
    childLeaving: leaving,
  });

  const handleExited = useEventCallback(onExited);

  useEnhancedEffect(() => {
    if (!inProp) {
      setLeaving(true);

      const timeoutId = setTimeout(handleExited, timeout);
      return () => {
        clearTimeout(timeoutId);
      };
    }
    return undefined;
  }, [handleExited, inProp, timeout]);

  return (
    <span className={rippleClassName} style={rippleStyles}>
      <span className={childClassName} />
    </span>
  );
};
