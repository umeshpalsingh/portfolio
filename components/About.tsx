import CountUp from "./CountUp";
import WeatherWidget from "./WeatherWidget";

export default function About() {
    return (
        <section className="about" id="about">
            <div className="wrap">
                <div className="eyebrow reveal">who i am</div>
                <h2 className="reveal">More than a job title</h2>

                <div className="about-layout">

                    {/*  BIO CARD (left, row 1)  */}
                    <div className="about-card about-bio reveal-left">
                        <div className="bio-greeting">
                            <span className="bio-greeting-dot"></span>
                            <span>Available for cool projects</span>
                        </div>
                        <h3 className="bio-headline">Hello, I'm Umesh.<br />I build things that<br /><em>actually work.</em></h3>
                        <p className="bio-body">By day, I write code that <em>mostly</em> works. The rest of the time, I'm a small pile of hobbies wearing a hoodie — half-read books, half-finished playlists, and a camera roll that's eighty percent food.</p>
                        <p className="bio-body">I take things seriously — except myself. This site is less a résumé and more a window into whatever I'm currently obsessed with.</p>
                        <div className="bio-pills">
                            <span className="bio-pill"><span className="pill-icon"><i className="fa-solid fa-laptop-code"></i></span> Frontend AI Dev</span>
                            <span className="bio-pill"><span className="pill-icon"><i className="fa-solid fa-music"></i></span> Music Nerd</span>
                            <span className="bio-pill"><span className="pill-icon"><i className="fa-solid fa-dumbbell"></i></span> Fitness Freak</span>
                            <span className="bio-pill"><span className="pill-icon"><i className="fa-solid fa-location-dot"></i></span> Noida, India</span>
                        </div>
                    </div>

                    {/*  RIGHT COLUMN (weather + spotify)  */}
                    <div className="about-right">

                        {/*  WEATHER  */}
                        <WeatherWidget />

                        {/*  SPOTIFY  */}
                        <div className="about-card about-spotify reveal-right" style={{ transitionDelay: "120ms" }}>
                            <iframe
                                title="Spotify Embed: Recommendation Playlist"
                                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0"
                                width="100%"
                                height="152"
                                style={{ border: 'none' }}
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy">
                            </iframe>
                        </div>

                    </div>

                    {/*  STATS ROW (left, row 2)  */}
                    <div className="about-stats-row">

                        <div className="about-card about-stat reveal-up" style={{ transitionDelay: "80ms" }}>
                            <CountUp className="about-stat-num" target={6} />
                            <span className="about-stat-label">hobbies attempted this year</span>
                        </div>

                        <div className="about-card about-stat reveal-up" style={{ transitionDelay: "180ms" }}>
                            <CountUp className="about-stat-num" target={80} />
                            <span className="about-stat-label">songs on repeat</span>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
