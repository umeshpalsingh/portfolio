export default function Resume() {
  return (
    <section className="resume-section" id="resume">
      <div className="wrap">
        <div className="eyebrow reveal">credentials</div>
        <h2 className="reveal">My Résumé</h2>
        <p className="section-sub reveal">
          A full snapshot of my experience, education, and skills — right here in the browser, or yours to keep.
        </p>

        <div className="resume-card reveal">
          {/* Decorative corner accent */}
          <div className="resume-card-corner" aria-hidden="true">
            <span className="resume-corner-dot"></span>
          </div>

          {/* Document Mockup Preview */}
          <div className="resume-preview">
            <div className="resume-preview-inner">
              <div className="resume-doc" aria-hidden="true">
                {/* Document header */}
                <div className="rdoc-header">
                  <div className="rdoc-avatar">U</div>
                  <div className="rdoc-header-text">
                    <div className="rdoc-name"></div>
                    <div className="rdoc-role"></div>
                  </div>
                </div>
                {/* Divider */}
                <div className="rdoc-divider"></div>
                {/* Section: Experience */}
                <div className="rdoc-section">
                  <div className="rdoc-section-title"></div>
                  <div className="rdoc-block">
                    <div className="rdoc-block-title"></div>
                    <div className="rdoc-line rdoc-line--short"></div>
                    <div className="rdoc-line"></div>
                    <div className="rdoc-line rdoc-line--med"></div>
                  </div>
                  <div className="rdoc-block">
                    <div className="rdoc-block-title"></div>
                    <div className="rdoc-line rdoc-line--short"></div>
                    <div className="rdoc-line"></div>
                    <div className="rdoc-line rdoc-line--med"></div>
                  </div>
                </div>
                {/* Section: Skills */}
                <div className="rdoc-section">
                  <div className="rdoc-section-title"></div>
                  <div className="rdoc-tags">
                    <span className="rdoc-tag"></span>
                    <span className="rdoc-tag rdoc-tag--wide"></span>
                    <span className="rdoc-tag"></span>
                    <span className="rdoc-tag rdoc-tag--narrow"></span>
                    <span className="rdoc-tag rdoc-tag--wide"></span>
                    <span className="rdoc-tag"></span>
                  </div>
                </div>
                {/* Section: Education */}
                <div className="rdoc-section">
                  <div className="rdoc-section-title"></div>
                  <div className="rdoc-block">
                    <div className="rdoc-block-title"></div>
                    <div className="rdoc-line rdoc-line--short"></div>
                    <div className="rdoc-line rdoc-line--med"></div>
                  </div>
                </div>
                {/* Watermark text */}
                <div className="rdoc-watermark">RÉSUMÉ</div>
              </div>
            </div>
            <div className="resume-preview-label" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 6h6M5 9h6M5 12h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              resume.pdf
            </div>
          </div>

          {/* Info & CTAs */}
          <div className="resume-info">
            <div className="resume-meta">
              <div className="resume-meta-item">
                <span className="resume-meta-icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </span>
                <div>
                  <span className="resume-meta-label">Based in</span>
                  <span className="resume-meta-value">Noida, India</span>
                </div>
              </div>
              <div className="resume-meta-item">
                <span className="resume-meta-icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 9h16" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <div>
                  <span className="resume-meta-label">Updated</span>
                  <span className="resume-meta-value">2026</span>
                </div>
              </div>
              <div className="resume-meta-item">
                <span className="resume-meta-icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 6v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <span className="resume-meta-label">Role</span>
                  <span className="resume-meta-value">Full-stack Dev</span>
                </div>
              </div>
            </div>

            <p className="resume-desc">
              One page. The whole story. From the first line of code to what I&apos;m building right now — every experience, skill, and project that matters.
            </p>

            <div className="resume-ctas">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary resume-btn"
                id="viewResumeBtn"
                aria-label="Open résumé PDF in a new tab"
              >
                <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
                  <path d="M11 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M15 3l2 2-7 7-3 1 1-3 7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                View Full Screen
              </a>
              <a
                href="/resume.pdf"
                download="Umesh_Pal_Singh_Resume.pdf"
                className="btn btn-ghost resume-btn"
                id="downloadResumeBtn"
                aria-label="Download résumé as PDF"
              >
                <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
                  <path d="M10 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Download PDF
              </a>
            </div>

            <p className="resume-hint">
              Opens in a new tab · No login required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
