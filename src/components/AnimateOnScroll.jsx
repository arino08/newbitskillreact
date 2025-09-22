import React, { useEffect, useRef, useState } from 'react';

export default function AnimateOnScroll({ children, className = '', variant = 'fade-up', threshold = 0.18, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    <div ref={ref} className={`aos ${variant} ${visible ? 'in' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}
