'use client';

import { useState, useRef, useEffect } from 'react';

type GalleryItem = {
    title: string;
    category: string;
    desc: string;
    images: string[];
    alts: string[];
};

const galleryData: GalleryItem[] = [
    {
        title: "Travel", category: "Wanderlust", desc: "Cinematic road trips, winding mountain passes, and captured moments wandering off the main path.",
        images: ["images/travel.webp", "images/travel2.webp", "images/travel3.webp"],
        alts: ["Scenic mountain highway", "Coastal road at golden hour", "European cobblestone street at dusk"]
    },
    {
        title: "Food", category: "Culinary", desc: "Artisanal meals, steaming ramen, and cozy cafe mornings. Eighty percent of my camera roll, for good reason.",
        images: ["images/food.webp", "images/food2.webp", "images/food3.webp"],
        alts: ["Steaming ramen bowl", "Avocado toast flat-lay", "Matcha latte in ceramic cup"]
    },
    {
        title: "Friends", category: "People", desc: "Shared laughter, late-night pizzas, and the people who make all the screen-time worth it.",
        images: ["images/friends.webp", "images/friends2.webp", "images/friends3.webp"],
        alts: ["Friends sharing pizza", "Friends at rooftop bar", "Friends walking autumn path"]
    },
    {
        title: "Work", category: "The Daily Grind", desc: "My daily setup: mechanical keyboards, clean lines of code, a warm desk lamp, and a constant flow of hot chai.",
        images: ["images/work.webp", "images/work2.webp", "images/work3.webp"],
        alts: ["Developer desk setup", "Mechanical keyboard RGB", "Minimalist desk with MacBook"]
    },
    {
        title: "Art", category: "Creative", desc: "Sketches, watercolor paintings, and physical doodles. Keeping my hands busy offline.",
        images: ["images/art.webp", "images/art2.webp", "images/art3.webp"],
        alts: ["Sketching on notebook", "Watercolor painting in progress", "Pencil sketch portrait"]
    },
    {
        title: "Music", category: "On Repeat", desc: "Spinning vinyl records, cozy home acoustics, and a curated selection of songs on permanent repeat.",
        images: ["images/music.webp", "images/music2.webp", "images/music3.webp"],
        alts: ["Vinyl record turntable", "Acoustic guitar close-up", "Vinyl record collection"]
    }
];

function Tile({ item, onClick, isBig }: { item: GalleryItem, onClick: () => void, isBig?: boolean }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [transform, setTransform] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    };

    const handleMouseEnter = () => {
        timerRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % item.images.length);
        }, 1800);
    };

    const handleMouseLeave = () => {
        setTransform('');
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setActiveIndex(0);
    };

    return (
        <div 
            className={`tile ${isBig ? 'big ' : ''}reveal`}
            tabIndex={0} 
            role="button" 
            aria-haspopup="dialog"
            style={{ transform, transition: transform ? 'none' : 'transform 0.4s ease' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
        >
            <div className="tile-imgs">
                {item.images.map((src, idx) => (
                    <img 
                        key={src} 
                        className={`tile-img ${idx === activeIndex ? 'active' : ''}`} 
                        src={src} 
                        alt={item.alts[idx]} 
                        draggable="false" 
                        loading="lazy" 
                    />
                ))}
            </div>
            <div className="tile-dots">
                {item.images.map((_, idx) => (
                    <span key={idx} className={`tile-dot ${idx === activeIndex ? 'active' : ''}`}></span>
                ))}
            </div>
            <div className="tile-caption">{item.title}</div>
        </div>
    );
}

export default function Gallery() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeItemIdx, setActiveItemIdx] = useState(0);
    const [activeImgIdx, setActiveImgIdx] = useState(0);

    const openLightbox = (idx: number) => {
        setActiveItemIdx(idx);
        setActiveImgIdx(0);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = '';
    };

    const nextImg = () => {
        const item = galleryData[activeItemIdx];
        setActiveImgIdx(prev => (prev + 1) % item.images.length);
    };

    const prevImg = () => {
        const item = galleryData[activeItemIdx];
        setActiveImgIdx(prev => (prev - 1 + item.images.length) % item.images.length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImg();
            if (e.key === 'ArrowLeft') prevImg();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, activeItemIdx]);

    const activeItem = galleryData[activeItemIdx];

    return (
        <section className="gallery" id="gallery">
            <div className="wrap">
                <div className="eyebrow reveal">a few snapshots</div>
                <h2 className="reveal">Glimpses of my world</h2>
                <p className="section-sub reveal">A collection of scenes, hobbies, and moments from my daily life.</p>
                
                <div className="gallery-grid stagger">
                    {galleryData.map((item, idx) => (
                        <Tile key={item.title} item={item} isBig={idx === 0} onClick={() => openLightbox(idx)} />
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <div className={`lightbox ${lightboxOpen ? 'open' : ''}`} id="lightbox" role="dialog" aria-modal="true">
                <div className="lightbox-card" id="lightboxCard">
                    <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">✕</button>

                    {/* Left: image panel */}
                    <div className="lightbox-imgs" id="lightboxImgs">
                        {activeItem.images.map((src, idx) => (
                            <img 
                                key={src} 
                                src={src} 
                                alt={activeItem.alts[idx]} 
                                className={`lightbox-img ${idx === activeImgIdx ? 'active' : ''}`} 
                            />
                        ))}
                        <button className="lightbox-arrow prev" onClick={prevImg} aria-label="Previous image">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                        </button>
                        <button className="lightbox-arrow next" onClick={nextImg} aria-label="Next image">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                        <div className="lightbox-counter">{activeImgIdx + 1} / {activeItem.images.length}</div>
                    </div>

                    {/* Right: info panel */}
                    <div className="lightbox-info">
                        <div className="lightbox-category">{activeItem.category}</div>
                        <h3>{activeItem.title}</h3>
                        <p>{activeItem.desc}</p>
                        <div className="lightbox-dots">
                            {activeItem.images.map((_, idx) => (
                                <span key={idx} className={`lightbox-dot ${idx === activeImgIdx ? 'active' : ''}`} onClick={() => setActiveImgIdx(idx)}></span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
