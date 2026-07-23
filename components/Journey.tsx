export default function Journey() {
  return (
    <section className="journey" id="journey">
            <div className="wrap">
                <div className="eyebrow reveal">how i got here</div>
                <h2 className="reveal">The journey so far</h2>
                <p className="section-sub reveal">Education, work, and a few happy accidents along the way. Swap in your
                    real dates and titles.</p>
                <div className="timeline">
                    <div className="t-item current reveal">
                        <div className="t-year">2026 — now</div>
                        <div className="t-title">Building things, breaking things</div>
                        <div className="t-desc">Working as a developer, mostly building things. Occasionally breaking them
                            too — that part's free.</div>
                    </div>
                    <div className="t-item reveal">
                        <div className="t-year">[year]</div>
                        <div className="t-title">Started working as a developer</div>
                        <div className="t-desc">Add your first role, the company, and what you actually learned (not just
                            what the job title says).</div>
                    </div>
                    <div className="t-item reveal">
                        <div className="t-year">[year]</div>
                        <div className="t-title">Graduated with a degree in [your field]</div>
                        <div className="t-desc">Where you studied, and the one class that actually stuck with you.</div>
                    </div>
                    <div className="t-item reveal">
                        <div className="t-year">[year]</div>
                        <div className="t-title">Found a hobby that stuck</div>
                        <div className="t-desc">The moment a casual interest turned into an actual personality trait.</div>
                    </div>
                    <div className="t-item reveal">
                        <div className="t-year">[year]</div>
                        <div className="t-title">Where the story begins</div>
                        <div className="t-desc">Hometown, early curiosities, whatever feels worth mentioning.</div>
                    </div>
                </div>
            </div>
        </section>
  );
}
