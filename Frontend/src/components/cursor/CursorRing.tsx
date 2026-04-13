import { useEffect, useRef } from 'react';

const CursorRing = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    // GSAP-style lerp with back.out feel (overshoot via higher lerp factor + small overshoot)
    const animate = () => {
      const ease = 0.18;
      pos.current.x += (mouse.current.x - pos.current.x) * ease;
      pos.current.y += (mouse.current.y - pos.current.y) * ease;
      dot.style.transform = `translate(${pos.current.x - 5}px, ${pos.current.y - 5}px)`;
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" />;
};

export default CursorRing;
