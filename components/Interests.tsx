export default function Interests() {
    return (
        <section className="interests" id="interests">
            <div className="marquee" aria-hidden="true">
                <div className="marquee-track" id="marqueeTrack">
                    <span>Photography</span><span>Gaming</span><span>Music</span><span>Traveling</span><span>Cooking</span><span>Reading</span><span>Sketching</span><span>Chai Enthusiast</span>
                    <span>Photography</span><span>Gaming</span><span>Music</span><span>Traveling</span><span>Cooking</span><span>Reading</span><span>Sketching</span><span>Chai Enthusiast</span>
                </div>
            </div>
            <div className="wrap">
                <div className="eyebrow reveal">things i love</div>
                <h2 className="reveal">Outside of the screen</h2>
                <p className="section-sub reveal">The stuff that fills my weekends — and honestly explains a lot about my commit messages.</p>
                <div className="interest-grid stagger">
                    <div className="interest-card reveal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                            strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="7" width="18" height="13" rx="2" />
                            <path d="M8 7l1.5-2.5h5L16 7" />
                            <circle cx="12" cy="13.5" r="3.5" />
                        </svg>
                        <h3>Photography</h3>
                        <p>Mostly photos of food and workouts.</p>
                    </div>
                    <div className="interest-card reveal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 9v6M7 7v10M17 7v10M20 9v6" />
                            <path d="M7 12h10" />
                            <path d="M2.5 10.5v3M21.5 10.5v3" />
                        </svg>
                        <h3>GYM</h3>
                        <p>Currently focused on my health and body. trying to reduce fat and gain muscle. Wish me luck</p>
                    </div>
                    <div className="interest-card reveal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 14v-2a8 8 0 0116 0v2" />
                            <rect x="2.5" y="14" width="4" height="6" rx="1.5" />
                            <rect x="17.5" y="14" width="4" height="6" rx="1.5" />
                        </svg>
                        <h3>Music</h3>
                        <p>I like Punjabi and Indian music and few english songs. </p>
                    </div>
                    <div className="interest-card reveal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 21s-7-7.2-7-12a7 7 0 1114 0c0 4.8-7 12-7 12z" />
                            <circle cx="12" cy="9" r="2.5" />
                        </svg>
                        <h3>Traveling</h3>
                        <p>Collecting cities one long weekend at a time.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
