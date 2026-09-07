import CycleWord from "./CycleWord";
import MagneticButton from "./MagneticButton";
import ConfettiButton from "./ConfettiButton";

export default function Hero() {
  return (
    <section className="hero" id="hero">
            <div className="blob-wrap" id="blobWrap1" style={{ "top": "8%", "left": "-6%" }}>
                <div className="blob blob-green"></div>
            </div>
            <div className="blob-wrap" id="blobWrap2" style={{ "top": "36%", "right": "-8%" }}>
                <div className="blob blob-yellow"></div>
            </div>
            <div className="glow" aria-hidden="true"></div>
            <div className="wrap hero-inner">
                <div className="eyebrow enter enter-1">hi, i'm</div>
                <h1 className="enter enter-2">Umesh Pal Singh</h1>
                <div className="cycle-line enter enter-3"><CycleWord /></div>
                <p className="lede enter enter-4">This is the corner of the internet where I get to be more than a job title — developer by profession, everything else by choice.
                </p>
                <div className="hero-ctas enter enter-4">
                    <MagneticButton href="#about" className="btn btn-primary">See my world &darr;</MagneticButton>
                    <ConfettiButton href="#connect" className="btn btn-ghost" id="sayHiBtn">Say hi &diams;</ConfettiButton>
                    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost hero-resume-btn" aria-label="View résumé">
                        <svg viewBox="0 0 20 20" fill="none" width="15" height="15" aria-hidden="true">
                            <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                            <path d="M7 7h6M7 10h6M7 13h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                        Résumé
                    </a>
                </div>
            </div>
            <a href="#about" className="scroll-cue" aria-label="Scroll to next section">
                scroll
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
            </a>
        </section>
  );
}
