import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { useEffect } from 'react';

interface ImageOverlayProps {
  imageUrl: string | null;
  opacity: number;
  isLocked: boolean;
}

export default function ImageOverlay({ imageUrl, opacity, isLocked }: ImageOverlayProps) {
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    document.addEventListener('gestureend', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
      document.removeEventListener('gestureend', handler);
    };
  }, []);

  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { mass: 1, tension: 350, friction: 40 }
  }));

  const bind = useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        if (!isLocked) {
          api.start({ x: dx, y: dy });
        }
      },
      onPinch: ({ offset: [s] }) => {
        if (!isLocked) {
          api.start({ scale: s });
        }
      }
    },
    {
      drag: { from: () => [x.get(), y.get()] },
      pinch: { scaleBounds: { min: 0.1, max: 10 }, modifierKey: null, from: () => [scale.get(), 0] }
    }
  );

  if (!imageUrl) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        pointerEvents: isLocked ? 'none' : 'auto',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      {...bind()}
    >
      <animated.img
        src={imageUrl}
        style={{
          x,
          y,
          scale,
          opacity: opacity,
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          transformOrigin: 'center center',
          pointerEvents: 'none', // let the container handle gestures
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        alt="Overlay"
        draggable={false}
      />
    </div>
  );
}
