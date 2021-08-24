import { useEffect, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useEventCallback from './utils/useEventCallback';

const useEnhancedEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function Ripple(props) {
  const { rippleX, rippleY, rippleSize, in: inProp, onExited = () => {}, timeout } = props;

  const [leaving, setLeaving] = useState(false);

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
}

Ripple.propTypes = {
  classes: PropTypes.object,
  in: PropTypes.bool,
  onExited: PropTypes.func,
  pulsate: PropTypes.bool,
  rippleSize: PropTypes.number,
  rippleX: PropTypes.number,
  rippleY: PropTypes.number,
  timeout: PropTypes.number.isRequired,
};

export default Ripple;
