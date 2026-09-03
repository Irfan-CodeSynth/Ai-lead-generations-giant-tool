import { useState, useEffect, useRef } from 'react';

// easeOutExpo function
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (target === null || target === undefined) return;
    
    startTimeRef.current = null;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    const animate = (time) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = time;
      }
      
      const progress = Math.min((time - startTimeRef.current) / duration, 1);
      const easedProgress = easeOutExpo(progress);
      
      const currentCount = Math.floor(easedProgress * target);
      setCount(currentCount);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [target, duration]);

  return count;
}
