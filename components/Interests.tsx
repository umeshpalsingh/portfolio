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
                        <p>Mostly photos of food, taken right before it gets eaten.</p>
                    </div>
                    <div className="interest-card reveal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                            strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="9" width="20" height="9" rx="4" />
                            <path d="M7 11v4M5 13h4" />
                            <circle cx="16" cy="12.5" r="1" />
                            <circle cx="18.5" cy="14.5" r="1" />
                        </svg>
                        <h3>Gaming</h3>
                        <p>Currently grinding Valorant and rewatching cutscenes in games I've already finished.</p>
                    </div>
                    <div className="interest-card reveal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 14v-2a8 8 0 0116 0v2" />
                            <rect x="2.5" y="14" width="4" height="6" rx="1.5" />
                            <rect x="17.5" y="14" width="4" height="6" rx="1.5" />
                        </svg>
                        <h3>Music</h3>
                        <p>One playlist named &quot;do not judge me.&quot; It&apos;s doing fine.</p>
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
