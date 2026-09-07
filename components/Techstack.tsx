import React from 'react';

export default function Techstack() {
  return (
    <section className="techstack" id="techstack">
            <div className="wrap">
                <div className="eyebrow reveal">tools of the trade</div>
                <h2 className="reveal">My Tech Toolbelt</h2>
                <p className="section-sub reveal">Languages, frameworks, and tools I reach for when building things. Hover each to see proficiency level.</p>

                <div className="tech-grid">
                    <div className="tech-card reveal" style={{ "--skill-pct": "90%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-brands fa-js" style={{ color: "#F7DF1E" }}></i></div>
                        <div className="tech-name">JavaScript</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "85%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-solid fa-code" style={{ color: "#3178C6" }}></i></div>
                        <div className="tech-name">TypeScript</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "88%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-brands fa-react" style={{ color: "#61DAFB" }}></i></div>
                        <div className="tech-name">React</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "80%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-brands fa-python" style={{ color: "#3776AB" }}></i></div>
                        <div className="tech-name">Python</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "75%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-brands fa-node-js" style={{ color: "#339933" }}></i></div>
                        <div className="tech-name">Node.js</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "82%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-solid fa-database" style={{ color: "#336791" }}></i></div>
                        <div className="tech-name">PostgreSQL</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "78%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-brands fa-docker" style={{ color: "#2496ED" }}></i></div>
                        <div className="tech-name">Docker</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "70%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-brands fa-aws" style={{ color: "#FF9900" }}></i></div>
                        <div className="tech-name">AWS</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "92%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-solid fa-palette" style={{ color: "#E34F26" }}></i></div>
                        <div className="tech-name">CSS / Design</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "76%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-solid fa-fire" style={{ color: "#FFCA28" }}></i></div>
                        <div className="tech-name">Firebase</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "72%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-solid fa-layer-group" style={{ color: "currentColor" }}></i></div>
                        <div className="tech-name">Next.js</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                    <div className="tech-card reveal" style={{ "--skill-pct": "68%" } as React.CSSProperties}>
                        <div className="tech-icon"><i className="fa-solid fa-robot" style={{ color: "currentColor" }}></i></div>
                        <div className="tech-name">AI / LLMs</div>
                        <div className="tech-level"><div className="tech-level-fill"></div></div>
                    </div>
                </div>
            </div>
        </section>
  );
}
