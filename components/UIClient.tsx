'use client';

import { useEffect } from 'react';

export default function UIClient() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Custom Cursor
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
            let mx = -100, my = -100;
            let rx = -100, ry = -100;
            let raf: number | null = null;

            const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

            const tick = () => {
                rx = lerp(rx, mx, 0.12);
                ry = lerp(ry, my, 0.12);
                dot.style.left = mx + 'px';
                dot.style.top = my + 'px';
                ring.style.left = rx + 'px';
                ring.style.top = ry + 'px';
                raf = requestAnimationFrame(tick);
            };

            const onMouseMove = (e: MouseEvent) => {
                mx = e.clientX;
                my = e.clientY;
                if (!raf) raf = requestAnimationFrame(tick);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseleave', () => {
                dot.style.opacity = '0';
                ring.style.opacity = '0';
            });
            document.addEventListener('mouseenter', () => {
                dot.style.opacity = '1';
                ring.style.opacity = '1';
            });

            const hoverTargets = 'a, button, [role="button"], .tile, .project-card, .tech-card, .now-card, .interest-card';
            const onMouseOver = (e: MouseEvent) => {
                if ((e.target as Element).closest?.(hoverTargets)) {
                    dot.classList.add('cursor-hover');
                    ring.classList.add('cursor-hover');
                }
            };
            const onMouseOut = (e: MouseEvent) => {
                if ((e.target as Element).closest?.(hoverTargets)) {
                    dot.classList.remove('cursor-hover');
                    ring.classList.remove('cursor-hover');
                }
            };
            document.addEventListener('mouseover', onMouseOver);
            document.addEventListener('mouseout', onMouseOut);
        }

        // Theme Animation Override
        const themeToggle = document.getElementById('themeToggle');
        const overlay = document.getElementById('themeOverlay');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (themeToggle && overlay) {
            themeToggle.addEventListener('click', () => {
                if (reduceMotion) return;
                const rect = themeToggle.getBoundingClientRect();
                const ox = (rect.left + rect.width / 2) / window.innerWidth * 100 + '%';
                const oy = (rect.top + rect.height / 2) / window.innerHeight * 100 + '%';
                overlay.style.setProperty('--ox', ox);
                overlay.style.setProperty('--oy', oy);

                const newTheme = document.documentElement.getAttribute('data-theme');
                overlay.style.background = newTheme === 'dark' ? '#0A140F' : '#FBFFF6';

                overlay.classList.remove('expanding');
                void overlay.offsetWidth;
                overlay.classList.add('expanding');

                const done = () => {
                    overlay.classList.remove('expanding');
                    overlay.removeEventListener('transitionend', done);
                };
                overlay.addEventListener('transitionend', done);
            }, true);
        }

        // Main Section Reveal Observer
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
        if (revealElements.length) {
            const mainObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        mainObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            revealElements.forEach(el => mainObs.observe(el));
        }

        // Tech Card Reveal Observer
        const techCards = document.querySelectorAll('.tech-card');
        if (techCards.length) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            techCards.forEach(card => obs.observe(card));
        }

        // Marquee: measure one set of items, then duplicate enough copies to
        // comfortably cover 2x the viewport width for seamless infinite loop
        const marqueeTrack = document.getElementById('marqueeTrack');
        if (marqueeTrack) {
            const baseHTML = marqueeTrack.innerHTML;
            const buildMarquee = () => {
                marqueeTrack.innerHTML = baseHTML;
                const setWidth = marqueeTrack.scrollWidth;
                if (!setWidth) return;
                const minTotal = window.innerWidth * 2;
                const copies = Math.max(2, Math.ceil(minTotal / setWidth) + 1);
                let html = '';
                for (let i = 0; i < copies; i++) { html += baseHTML; }
                marqueeTrack.innerHTML = html;
                marqueeTrack.style.setProperty('--marquee-distance', setWidth + 'px');
            };
            buildMarquee();
            let resizeTimer: NodeJS.Timeout | null = null;
            window.addEventListener('resize', () => {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(buildMarquee, 150);
            });
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(buildMarquee);
            }
        }

        // Cleanup isn't strictly necessary since it only runs once per page lifecycle, 
        // but for a true SPA, we would remove event listeners here.
    }, []);

    return (
        <>
            <div id="cursorDot"></div>
            <div id="cursorRing"></div>
            <div id="themeOverlay"></div>
        </>
    );
}
