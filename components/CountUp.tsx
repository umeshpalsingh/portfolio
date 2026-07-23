'use client';

import { useEffect, useRef, useState } from 'react';

function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function CountUp({ target, className }: { target: number, className: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (!ref.current || hasAnimated) return;
        
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            setCount(target);
            setHasAnimated(true);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let start: number | null = null;
                const duration = 1400;

                const step = (ts: number) => {
                    if (!start) start = ts;
                    const progress = Math.min((ts - start) / duration, 1);
                    setCount(Math.round(easeOutExpo(progress) * target));
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    }
                };

                requestAnimationFrame(step);
                setHasAnimated(true);
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [target, hasAnimated]);

    return <span ref={ref} className={className}>{count}</span>;
}
