import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Résumé — Umesh Pal Singh',
  description: 'View and download the résumé of Umesh Pal Singh — full-stack developer based in Noida, India.',
};

export default function ResumePage() {
  return (
    <div className="resume-page">
      {/* Top bar */}
      <div className="resume-page-bar">
        <Link href="/" className="resume-page-back" id="resumeBackBtn" aria-label="Back to portfolio">
          <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to portfolio
        </Link>

        <div className="resume-page-title">
          <span className="resume-page-dot" aria-hidden="true"></span>
          Umesh Pal Singh — Résumé
        </div>

        <a
          href="/resume.pdf"
          download="Umesh_Pal_Singh_Resume.pdf"
          className="btn btn-primary resume-page-download"
          id="resumePageDownloadBtn"
          aria-label="Download résumé as PDF"
        >
          <svg viewBox="0 0 20 20" fill="none" width="15" height="15" aria-hidden="true">
            <path d="M10 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Download PDF
        </a>
      </div>

      {/* PDF Viewer — uses object tag so it gracefully falls back */}
      <div className="resume-page-viewer">
        <object
          data="/resume.pdf"
          type="application/pdf"
          className="resume-page-iframe"
          aria-label="Full-screen PDF résumé viewer"
        >
          {/* Fallback shown when PDF can't be embedded */}
          <div className="resume-page-fallback">
            <div className="resume-page-fallback-icon" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
                <rect x="10" y="4" width="44" height="56" rx="4" stroke="currentColor" strokeWidth="2" opacity="0.15"/>
                <rect x="10" y="4" width="44" height="56" rx="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M22 22h20M22 30h20M22 38h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="48" cy="48" r="12" fill="var(--green)" opacity="0.15"/>
                <path d="M48 43v7m0 0l-3-3m3 3l3-3" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="resume-page-fallback-title">PDF preview unavailable</h3>
            <p className="resume-page-fallback-desc">
              Your browser can&apos;t display this PDF inline.<br/>Click below to download it instead.
            </p>
            <a
              href="/resume.pdf"
              download="Umesh_Pal_Singh_Resume.pdf"
              className="btn btn-primary"
            >
              <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
                <path d="M10 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Download PDF
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}
