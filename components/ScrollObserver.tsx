'use client';

import { useEffect, useState } from 'react';

export default function ScrollObserver() {
    const [progress, setProgress] = useState(0);
    const [showToTop, setShowToTop] = useState(false);

    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let ticking = false;

        const updateScroll = () => {
            const y = window.scrollY;
            const doc = document.documentElement;
            const trackHeight = doc.scrollHeight - doc.clientHeight;
            const pct = trackHeight > 0 ? (y / trackHeight) * 100 : 0;
            
            setProgress(pct);
            setShowToTop(y > 600);

            if (!reduceMotion) {
                const blob1 = document.getElementById('blobWrap1');
                const blob2 = document.getElementById('blobWrap2');
                const hero = document.getElementById('hero');
                const heroHeight = hero ? hero.offsetHeight : 0;
                
                const parallaxY = Math.min(y, heroHeight);
                if (blob1) blob1.style.transform = `translateY(${parallaxY * 0.18}px)`;
                if (blob2) blob2.style.transform = `translateY(${parallaxY * -0.12}px)`;
            }
            
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        updateScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    return (
        <>
            <div className="scroll-progress" id="scrollProgress" style={{ width: `${progress}%` }}></div>
            <button 
                className={`to-top ${showToTop ? 'show' : ''}`} 
                id="toTop" 
                aria-label="Back to top"
                onClick={scrollToTop}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
            </button>
        </>
    );
}
