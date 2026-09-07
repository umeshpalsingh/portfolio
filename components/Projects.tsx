'use client';

import { useState, useEffect } from 'react';

type Project = {
    title: string;
    desc: string;
    img: string;
    tags: string[];
    github: string;
    live: string;
    badge: string;
};

const projectData: Project[] = [
    {
        title: "Analytics Dashboard",
        desc: "A real-time analytics dashboard built for tracking user behaviour and conversion funnels across web properties. Features interactive charts, dark mode, and a customisable widget layout. Built with a focus on sub-100ms render performance.",
        img: "/images/project_web.webp",
        tags: ["React", "TypeScript", "D3.js", "Node.js", "PostgreSQL"],
        github: "https://github.com/yourhandle",
        live: "https://yourproject.com",
        badge: "Web App"
    },
    {
        title: "FitTrack Mobile",
        desc: "A cross-platform fitness tracking app built with React Native. Features workout logging, personal records tracking, progress charts, and a social feed to share milestones with friends. Integrates with Apple Health and Google Fit APIs.",
        img: "/images/project_mobile.webp",
        tags: ["React Native", "Expo", "Firebase", "Swift"],
        github: "https://github.com/yourhandle",
        live: "#",
        badge: "Mobile"
    },
    {
        title: "Pixel Quest",
        desc: "A browser-based 2D platformer game built entirely in vanilla JavaScript using the Canvas API. No frameworks, no game engines — just pixels. Features procedurally generated levels, particle effects, local leaderboards, and a chiptune soundtrack.",
        img: "/images/project_game.webp",
        tags: ["JavaScript", "Canvas API", "Web Audio API"],
        github: "https://github.com/yourhandle",
        live: "https://yourproject.com",
        badge: "Game"
    },
    {
        title: "ChatMind AI",
        desc: "An AI-powered conversational assistant with context-aware memory, markdown rendering, and code syntax highlighting. Built as a personal productivity tool for development research and writing. Integrates OpenAI API with a custom streaming UI.",
        img: "/images/project_ai.webp",
        tags: ["Python", "FastAPI", "OpenAI", "React", "TailwindCSS"],
        github: "https://github.com/yourhandle",
        live: "#",
        badge: "AI / ML"
    }
];

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const openModal = (project: Project) => {
        setSelectedProject(project);
        document.body.classList.add('modal-open');
    };

    const closeModal = () => {
        setSelectedProject(null);
        document.body.classList.remove('modal-open');
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedProject) closeModal();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.classList.remove('modal-open');
        };
    }, [selectedProject]);

    return (
        <section className="projects" id="projects">
            <div className="wrap">
                <div className="eyebrow reveal">selected work</div>
                <h2 className="reveal">Projects &amp; Work</h2>
                <p className="section-sub reveal">A selection of things I&apos;ve shipped — from side experiments to serious tools. Click any card to dive deeper.</p>

                <div className="project-grid">
                    {projectData.map((project, idx) => (
                        <article 
                            key={idx}
                            className="project-card reveal"
                            role="button"
                            tabIndex={0}
                            onClick={() => openModal(project)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openModal(project);
                                }
                            }}
                        >
                            <div className="project-card-img-wrap">
                                <img className="project-card-img" src={project.img} alt={project.title} loading="lazy" />
                                <span className="project-card-badge">{project.badge}</span>
                            </div>
                            <div className="project-card-body">
                                <div className="project-card-title">{project.title}</div>
                                <div className="project-card-desc">{project.desc}</div>
                                <div className="project-tags">
                                    {project.tags.slice(0, 4).map(tag => (
                                        <span key={tag} className="project-tag">{tag}</span>
                                    ))}
                                </div>
                                <div className="project-card-links">
                                    {project.github !== '#' && (
                                        <a href={project.github} className="project-link" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.17c-3.2.7-3.87-1.34-3.87-1.34-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.7.42.36.78 1.07.78 2.16v3.2c0 .31.21.65.79.55A10.52 10.52 0 0023.5 12c0-6.27-5.23-11.5-11.5-11.5z"/></svg>
                                            GitHub →
                                        </a>
                                    )}
                                    {project.live !== '#' && (
                                        <a href={project.live} className="project-link" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                                            Live Demo →
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* PROJECT DETAIL MODAL */}
            <div 
                className={`project-modal-overlay ${selectedProject ? 'open' : ''}`} 
                id="projectModalOverlay" 
                role="dialog" 
                aria-modal="true" 
                aria-labelledby="pModalTitle"
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeModal();
                }}
            >
                {selectedProject && (
                    <div className="project-modal" id="projectModal">
                        <img className="project-modal-img" id="pModalImg" src={selectedProject.img} alt={selectedProject.title} />
                        <div className="project-modal-body">
                            <div className="project-modal-header">
                                <h3 className="project-modal-title" id="pModalTitle">{selectedProject.title}</h3>
                                <button className="project-modal-close" id="projectModalClose" aria-label="Close project details" onClick={closeModal}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                            <p className="project-modal-desc" id="pModalDesc">{selectedProject.desc}</p>
                            <div className="project-modal-tags" id="pModalTags">
                                {selectedProject.tags.map(tag => <span key={tag} className="project-tag">{tag}</span>)}
                            </div>
                            <div className="project-modal-links" id="pModalLinks">
                                {selectedProject.github !== '#' && (
                                    <a href={selectedProject.github} className="project-link" target="_blank" rel="noopener">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.17c-3.2.7-3.87-1.34-3.87-1.34-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.7.42.36.78 1.07.78 2.16v3.2c0 .31.21.65.79.55A10.52 10.52 0 0023.5 12c0-6.27-5.23-11.5-11.5-11.5z"/></svg>
                                        GitHub →
                                    </a>
                                )}
                                {selectedProject.live !== '#' && (
                                    <a href={selectedProject.live} className="project-link" target="_blank" rel="noopener">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                                        Live Demo →
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
