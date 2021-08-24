import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { TransitionGroup } from 'react-transition-group';
import { Ripple } from './Ripple';
import './styles.scss';

const DURATION: number = 500;
export const DELAY_RIPPLE: number = 80;

interface TouchRippleProps {
  center?: boolean;
  classes: Object;
}

interface ParamsProps {
  rippleX: number;
  rippleY: number;
  rippleSize: number;
  cb: any;
}

export const TouchRipple = forwardRef(function TouchRipple(props, ref) {
  const { center: centerProp, classes, ...other } = props as TouchRippleProps;
  const [ripples, setRipples] = useState<any>([]);
  const nextKey = useRef<number>(0);
  const rippleCallback = useRef<any>(null);
  const ignoringMouseDown = useRef<boolean>(false);
  const startTimer = useRef<any>(null);
  const startTimerCommit = useRef<any>(null);
  const container = useRef<any>(null);

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
    (params: ParamsProps) => {
      const { rippleX, rippleY, rippleSize, cb } = params;
      setRipples((oldRipples: Object[]) => [
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

  const start = useCallback(
    (event = {}, options = {}, cb) => {
      const { center = centerProp || options.pulsate, fakeElement = false } =
        options;

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

      let rippleX: number;
      let rippleY: number;
      let rippleSize: number;

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
            startCommit({ rippleX, rippleY, rippleSize, cb });
          };

          startTimer.current = setTimeout(() => {
            if (startTimerCommit.current) {
              startTimerCommit.current();
              startTimerCommit.current = null;
            }
          }, DELAY_RIPPLE);
        }
      } else {
        startCommit({ rippleX, rippleY, rippleSize, cb });
      }
    },
    [centerProp, startCommit]
  );

  const stop = useCallback((event, cb) => {
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

    setRipples((oldRipples: Object[]) => {
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
