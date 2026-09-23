export default function Now() {
    return (
        <section className="now-section" id="now">
            <div className="wrap">
                <div className="eyebrow reveal">/now</div>
                <h2 className="reveal">What I'm Up To</h2>
                <p className="section-sub reveal">A living snapshot of what I'm currently focused on, reading, building, and obsessing over. Updated whenever the mood strikes.</p>

                <div className="now-grid">
                    <div className="now-card reveal">
                        <div className="now-card-icon"><i className="fa-solid fa-hammer"></i></div>
                        <div className="now-card-label">Building</div>
                        <div className="now-card-value">This portfolio — obviously</div>
                        <div className="now-card-sub">Obsessively tweaking, designing, and building new sections. It never feels done.</div>
                    </div>
                    <div className="now-card reveal">
                        <div className="now-card-icon"><i className="fa-solid fa-graduation-cap"></i></div>
                        <div className="now-card-label">Learning</div>
                        <div className="now-card-value">AI &amp; LLMs</div>
                        <div className="now-card-sub">Learning new things about AI &amp; LLMs. It's fun. And fascinating.</div>
                    </div>
                    <div className="now-card reveal">
                        <div className="now-card-icon"><i className="fa-solid fa-headphones"></i></div>
                        <div className="now-card-label">Listening To</div>
                        <div className="now-card-value">Lofi Hip Hop</div>
                        <div className="now-card-sub">The only consistent soundtrack that doesn't demand attention.</div>
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
                        <div className="now-card-value">One Piece</div>
                        <div className="now-card-sub">It's long, but worth it. The Journey feels exciting always.</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
