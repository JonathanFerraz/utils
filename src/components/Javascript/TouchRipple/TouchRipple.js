import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import Ripple from './Ripple';
import './styles.scss';

const DURATION = 500;
export const DELAY_RIPPLE = 80;

export const TouchRipple = forwardRef(function TouchRipple(props, ref) {
  const { center: centerProp, classes, ...other } = props;
  const [ripples, setRipples] = useState([]);
  const nextKey = useRef(0);
  const rippleCallback = useRef(null);
  const ignoringMouseDown = useRef(false);
  const startTimer = useRef(null);
  const startTimerCommit = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    if (rippleCallback.current) {
      rippleCallback.current();
      rippleCallback.current = null;
    }
  }, [ripples]);

  useEffect(() => {
    return () => {
      clearTimeout(startTimer.current);
    };
  }, []);

  const startCommit = useCallback(
    (params) => {
      const { rippleX, rippleY, rippleSize, cb } = params;
      setRipples((oldRipples) => [
        ...oldRipples,
        <Ripple
          key={nextKey.current}
          classes={classes}
          timeout={DURATION}
          rippleX={rippleX}
          rippleY={rippleY}
          rippleSize={rippleSize}
        />,
      ]);
      nextKey.current += 1;
      rippleCallback.current = cb;
    },
    [classes]
  );

  const start = React.useCallback(
    (event = {}, options = {}, cb) => {
      const {
        pulsate = false,
        center = centerProp || options.pulsate,
        fakeElement = false,
      } = options;

      if (event.type === 'mousedown' && ignoringMouseDown.current) {
        ignoringMouseDown.current = false;
        return;
      }

      if (event.type === 'touchstart') {
        ignoringMouseDown.current = true;
      }

      const element = fakeElement ? null : container.current;
      const rect = element
        ? element.getBoundingClientRect()
        : {
            width: 0,
            height: 0,
            left: 0,
            top: 0,
          };

      let rippleX;
      let rippleY;
      let rippleSize;

      if (
        center ||
        (event.clientX === 0 && event.clientY === 0) ||
        (!event.clientX && !event.touches)
      ) {
        rippleX = Math.round(rect.width / 2);
        rippleY = Math.round(rect.height / 2);
      } else {
        const { clientX, clientY } = event.touches ? event.touches[0] : event;
        rippleX = Math.round(clientX - rect.left);
        rippleY = Math.round(clientY - rect.top);
      }

      if (center) {
        rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);

        if (rippleSize % 2 === 0) {
          rippleSize += 1;
        }
      } else {
        const sizeX =
          Math.max(
            Math.abs((element ? element.clientWidth : 0) - rippleX),
            rippleX
          ) *
            2 +
          2;
        const sizeY =
          Math.max(
            Math.abs((element ? element.clientHeight : 0) - rippleY),
            rippleY
          ) *
            2 +
          2;
        rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
      }

      if (event.touches) {
        if (startTimerCommit.current === null) {
          startTimerCommit.current = () => {
            startCommit({ pulsate, rippleX, rippleY, rippleSize, cb });
          };

          startTimer.current = setTimeout(() => {
            if (startTimerCommit.current) {
              startTimerCommit.current();
              startTimerCommit.current = null;
            }
          }, DELAY_RIPPLE);
        }
      } else {
        startCommit({ pulsate, rippleX, rippleY, rippleSize, cb });
      }
    },
    [centerProp, startCommit]
  );

  const stop = React.useCallback((event, cb) => {
    clearTimeout(startTimer.current);

    if (event.type === 'touchend' && startTimerCommit.current) {
      event.persist();
      startTimerCommit.current();
      startTimerCommit.current = null;
      startTimer.current = setTimeout(() => {
        stop(event, cb);
      });
      return;
    }

    startTimerCommit.current = null;

    setRipples((oldRipples) => {
      if (oldRipples.length > 0) {
        return oldRipples.slice(1);
      }
      return oldRipples;
    });
    rippleCallback.current = cb;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      start,
      stop,
    }),
    [start, stop]
  );

  return (
    <span ref={container} className={'touchRippleRoot'} {...other}>
      <TransitionGroup component={null} exit>
        {ripples}
      </TransitionGroup>
    </span>
  );
});

TouchRipple.propTypes = {
  center: PropTypes.bool,
  classes: PropTypes.object,
};
