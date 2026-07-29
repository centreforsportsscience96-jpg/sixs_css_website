import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const Counter = ({ to, suffix = '', duration = 1.6 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, to, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
};

export default Counter;
