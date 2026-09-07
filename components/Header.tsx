'use client';

import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { burstConfettiAt } from '../utils/confetti';
import { showToast } from './Toast';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const badgeClicks = useRef(0);
    const badgeTimer = useRef<NodeJS.Timeout | null>(null);

    // Handle scroll for header styling and active section
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        // Intersection Observer for active nav links
        const sections = document.querySelectorAll('main section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: '-30% 0px -60% 0px' });

        sections.forEach(sec => observer.observe(sec));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    // Handle Escape key for mobile nav
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isNavOpen) {
                setIsNavOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isNavOpen]);

    useEffect(() => {
        if (isNavOpen) {
            document.body.classList.add('nav-open');
        } else {
            document.body.classList.remove('nav-open');
        }
    }, [isNavOpen]);

    const handleBadgeClick = (e: React.MouseEvent) => {
        const eggMessages = ['keep going...', 'almost there...', 'one more...'];
        badgeClicks.current += 1;
        
        if (badgeTimer.current) clearTimeout(badgeTimer.current);
        badgeTimer.current = setTimeout(() => { badgeClicks.current = 0; }, 1400);

        if (badgeClicks.current >= 2 && badgeClicks.current <= 4) {
            showToast(eggMessages[badgeClicks.current - 2]);
        } else if (badgeClicks.current >= 5) {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            burstConfettiAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
            showToast('you found it ✨');
            badgeClicks.current = 0;
        }
    };

    const navLinks = [
        { id: 'about', label: 'About' },
        { id: 'gallery', label: 'Gallery' },
        { id: 'journey', label: 'Journey' },
        { id: 'projects', label: 'Projects' },
        { id: 'interests', label: 'Interests' },
        { id: 'now', label: 'Now' },
        { id: 'play', label: 'Play' },
        { id: 'connect', label: 'Connect' }
    ];

    return (
        <header className={`site-nav ${isScrolled ? 'scrolled' : ''}`} id="siteNav">
            <div className="nav-inner">
                <div className="brand">
                    <div className="brand-badge" id="brandBadge" onClick={handleBadgeClick} style={{ cursor: 'pointer' }}>U</div>
                    <span>Umesh Pal Singh</span>
                </div>
                <div className="nav-right">
                    <nav className={`nav-links ${isNavOpen ? 'open' : ''}`} id="navLinks">
                        {navLinks.map(link => (
                            <a 
                                key={link.id} 
                                href={`#${link.id}`} 
                                className={activeSection === link.id ? 'active' : ''}
                                onClick={() => setIsNavOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="nav-social">
                            <a href="https://github.com/umeshpalsingh" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.17c-3.2.7-3.87-1.34-3.87-1.34-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.7.42.36.78 1.07.78 2.16v3.2c0 .31.21.65.79.55A10.52 10.52 0 0023.5 12c0-6.27-5.23-11.5-11.5-11.5z" /></svg></a>
                            <a href="https://instagram.com/umeshpalsingh" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1" /></svg></a>
                            <a href="https://linkedin.com/in/umeshpalsingh" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48s1.34 2.98 2.98 2.98 2.98-1.34 2.98-2.98S6.62 3.5 4.98 3.5zM2.4 21.5h5.16V8.98H2.4V21.5zm7.46-12.52v12.52h5.15v-6.6c0-1.74.33-3.43 2.48-3.43 2.12 0 2.15 1.98 2.15 3.54v6.49H24v-7.27c0-4.36-2.36-6.4-5.5-6.4-2.54 0-3.67 1.4-4.3 2.38h-.06V8.98H9.86z" /></svg></a>
                        </div>
                    </nav>
                    <ThemeToggle />
                </div>
                <button 
                    className={`nav-toggle ${isNavOpen ? 'active' : ''}`} 
                    aria-label="Toggle navigation" 
                    aria-expanded={isNavOpen}
                    onClick={() => setIsNavOpen(!isNavOpen)}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </div>
        </header>
    );
}
