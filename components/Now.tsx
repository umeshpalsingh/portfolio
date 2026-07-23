export default function Now() {
  return (
    <section className="now-section" id="now">
            <div className="wrap">
                <div className="eyebrow reveal">/now</div>
                <h2 className="reveal">What I'm Up To</h2>
                <p className="section-sub reveal">A living snapshot of what I'm currently focused on, reading, building, and obsessing over. Updated whenever the mood strikes.</p>

                <div className="now-grid">
                    <div className="now-card reveal">
                        <div className="now-card-icon"><i className="fa-solid fa-book-open"></i></div>
                        <div className="now-card-label">Reading</div>
                        <div className="now-card-value">The Pragmatic Programmer</div>
                        <div className="now-card-sub">Andrew Hunt &amp; David Thomas — timeless advice that somehow still feels fresh.</div>
                    </div>
                    <div className="now-card reveal">
                        <div className="now-card-icon"><i className="fa-solid fa-hammer"></i></div>
                        <div className="now-card-label">Building</div>
                        <div className="now-card-value">This portfolio — obviously</div>
                        <div className="now-card-sub">Obsessively tweaking, designing, and building new sections. It never feels done.</div>
                    </div>
                    <div className="now-card reveal">
                        <div className="now-card-icon"><i className="fa-solid fa-graduation-cap"></i></div>
                        <div className="now-card-label">Learning</div>
                        <div className="now-card-value">Rust &amp; WebAssembly</div>
                        <div className="now-card-sub">Slowly convincing myself that memory management is fun, actually.</div>
                    </div>
                    <div className="now-card reveal">
                        <div className="now-card-icon"><i className="fa-solid fa-headphones"></i></div>
                        <div className="now-card-label">Listening To</div>
                        <div className="now-card-value">Lofi Hip Hop &amp; Classical Guitar</div>
                        <div className="now-card-sub">The only consistent coding soundtrack that doesn't demand attention.</div>
                    </div>
                    <div className="now-card reveal">
                        <div className="now-card-icon"><i className="fa-solid fa-earth-americas"></i></div>
                        <div className="now-card-label">Located In</div>
                        <div className="now-card-value">India <i className="fa-solid fa-flag"></i></div>
                        <div className="now-card-sub">Always. Occasionally dreaming of somewhere with better weather.</div>
                    </div>
                    <div className="now-card reveal">
                        <div className="now-card-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
                        <div className="now-card-label">Currently Obsessed With</div>
                        <div className="now-card-value">Minimalist Design</div>
                        <div className="now-card-sub">Trying to say more with less. It's harder than it looks.</div>
                    </div>
                    <div className="now-card reveal">
                        <div className="now-card-icon"><i className="fa-solid fa-tv"></i></div>
                        <div className="now-card-label">Currently Watching</div>
                        <div className="now-card-value">Hunter x Hunter</div>
                        <div className="now-card-sub">Experiencing an absolute masterpiece of shonen storytelling and power systems.</div>
                    </div>
                </div>
            </div>
        </section>
  );
}
