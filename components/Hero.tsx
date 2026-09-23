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

            {/* Editorial label — top-right decorative element, hidden on mobile */}
            <div className="hero-label" aria-hidden="true">
                Noida, India
                <span>Full-Stack Dev</span>
                <span>Open to work</span>
            </div>

            <div className="wrap hero-inner">
                <div className="eyebrow enter enter-1">hi, i&apos;m</div>
                <h1 className="enter enter-2">Umesh Pal Singh</h1>
                <div className="cycle-line enter enter-3"><CycleWord /></div>
                <p className="lede enter enter-4">This is the corner of the internet where I get to be more than a job title — developer by profession, everything else by choice.
                </p>
                <div className="hero-ctas enter enter-4">
                    <MagneticButton href="#about" className="btn btn-primary">See my world &darr;</MagneticButton>
                    <ConfettiButton href="#connect" className="btn btn-ghost" id="sayHiBtn">Say hi &diams;</ConfettiButton>
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
