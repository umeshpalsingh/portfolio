'use client';

import { useEffect, useRef } from 'react';
import { initGames } from '../utils/gameLogic';

export default function PlayClient() {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            try {
                initGames();
            } catch (e) {
                console.error("Game init failed", e);
            }
        }
    }, []);

    return (
        <>
            {/* Achievement banner */}
            <div className="achievement-banner" id="achievementBanner" aria-live="polite"></div>

            {/* Mute toggle */}
            <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "marginBottom": "32px", "flexWrap": "wrap" }}>
                <button className="game-mute-btn" id="gameMuteBtn" aria-label="Toggle game sound" title="Toggle game sounds">
                    <svg className="mute-icon-on" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg>
                    <svg className="mute-icon-off" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                    Sound On
                </button>
                <div className="theme-unlock-row" id="themeUnlockRow"></div>
            </div>
            
            {/* Catch the Chai */}
            <div className="game-block reveal">
                <div className="game-block-header">
                    <div>
                        <h3 className="game-title">Catch the chai</h3>
                        <p className="game-desc">Move your mouse (or swipe) to slide the cup. Catch chai for points, dodge the bugs — those aren't the good kind.</p>
                    </div>
                    <button className="game-expand-btn" id="chaiExpandBtn" aria-label="Play Catch the Chai in full view">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                        Full view
                    </button>
                </div>
                <div className="game-card">
                    <div className="game-hud">
                        <span>Score: <strong id="gameScore">0</strong></span>
                        <span className="game-lives" id="gameLives" aria-hidden="true">
                            <svg className="life" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.5 2 5 5.5 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.5 0 5 3.5 3.5 6.7-2.5 4.7-10 9.3-10 9.3z" /></svg>
                            <svg className="life" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.5 2 5 5.5 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.5 0 5 3.5 3.5 6.7-2.5 4.7-10 9.3-10 9.3z" /></svg>
                            <svg className="life" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.5 2 5 5.5 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.5 0 5 3.5 3.5 6.7-2.5 4.7-10 9.3-10 9.3z" /></svg>
                        </span>
                        <span>Best: <strong id="gameBest">0</strong></span>
                    </div>
                    <div className="game-frame" id="gameFrame">
                        <div className="catcher" id="catcher"></div>
                        <div className="game-overlay" id="gameOverlay"></div>
                    </div>
                    <p className="game-tip">Tip: it gets faster the longer you survive. Arrow keys work too.</p>
                </div>
            </div>

            {/* Penalty Shootout */}
            <div className="game-block reveal">
                <div className="game-block-header">
                    <div>
                        <h3 className="game-title">Penalty shootout</h3>
                        <p className="game-desc">Click, tap, or hit space to strike when the ball's lined up. Down the middle always gets saved — a corner's your only real shot, and even then it's a guess.</p>
                    </div>
                    <button className="game-expand-btn" id="penaltyExpandBtn" aria-label="Play Penalty Shootout in full view">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                        Full view
                    </button>
                </div>
                <div className="game-card">
                    <div className="game-hud">
                        <span>Goals: <strong id="penaltyScore">0</strong></span>
                        <span>Best: <strong id="penaltyBest">0</strong></span>
                    </div>
                    <div className="game-frame" id="penaltyFrame">
                        <div className="penalty-goal" aria-hidden="true">
                            <div className="penalty-zone-line" style={{ left: "32%" }}></div>
                            <div className="penalty-zone-line" style={{ left: "68%" }}></div>
                            <div className="penalty-keeper" id="penaltyKeeper">
                                <svg viewBox="0 0 24 34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="5" r="4" />
                                    <path d="M12 9v14M12 13l-8 4M12 13l8 4M12 21l-6 6M12 21l6 6" />
                                </svg>
                            </div>
                        </div>
                        <div className="penalty-ball" id="penaltyBall" aria-hidden="true"></div>
                        <div className="penalty-result" id="penaltyResult" role="status" aria-live="polite"></div>
                        <div className="game-overlay" id="penaltyOverlay"></div>
                    </div>
                    <p className="game-tip">Tip: it sweeps faster with every goal. Spacebar works too.</p>
                </div>
            </div>
            
            {/* Chai Full-view Modal */}
            <div className="game-fullview" id="chaiFullview" role="dialog" aria-modal="true" aria-labelledby="chaiFvTitle">
                <div className="game-fullview-inner">
                    <button className="game-fullview-close" id="chaiFullviewClose" aria-label="Close full view">✕</button>
                    <h3 id="chaiFvTitle" className="sr-only">Catch the Chai (Full View)</h3>
                    <div className="game-hud">
                        <span>Score: <strong id="gameScoreFull">0</strong></span>
                        <span className="game-lives" id="gameLivesFull" aria-hidden="true">
                            <svg className="life" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.5 2 5 5.5 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.5 0 5 3.5 3.5 6.7-2.5 4.7-10 9.3-10 9.3z"/></svg>
                            <svg className="life" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.5 2 5 5.5 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.5 0 5 3.5 3.5 6.7-2.5 4.7-10 9.3-10 9.3z"/></svg>
                            <svg className="life" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.5 2 5 5.5 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.5 0 5 3.5 3.5 6.7-2.5 4.7-10 9.3-10 9.3z"/></svg>
                        </span>
                        <span>Best: <strong id="gameBestFull">0</strong></span>
                    </div>
                    <div className="game-frame fv-frame" id="gameFrameFull">
                        <div className="catcher fv-catcher" id="catcherFull"></div>
                        <div className="game-overlay fv-overlay" id="gameOverlayFull"></div>
                    </div>
                </div>
            </div>

            {/* Penalty Full-view Modal */}
            <div className="game-fullview" id="penaltyFullview" role="dialog" aria-modal="true" aria-labelledby="penaltyFvTitle">
                <div className="game-fullview-inner">
                    <button className="game-fullview-close" id="penaltyFullviewClose" aria-label="Close full view">✕</button>
                    <h3 id="penaltyFvTitle" className="sr-only">Penalty Shootout (Full View)</h3>
                    <div className="game-hud">
                        <span>Goals: <strong id="penaltyScoreFull">0</strong></span>
                        <span>Best: <strong id="penaltyBestFull">0</strong></span>
                    </div>
                    <div className="game-frame fv-frame" id="penaltyFrameFull">
                        <div className="penalty-goal" aria-hidden="true">
                            <div className="penalty-zone-line" style={{ left: "32%" }}></div>
                            <div className="penalty-zone-line" style={{ left: "68%" }}></div>
                            <div className="penalty-keeper" id="penaltyKeeperFull">
                                <svg viewBox="0 0 24 34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="5" r="4" />
                                    <path d="M12 9v14M12 13l-8 4M12 13l8 4M12 21l-6 6M12 21l6 6" />
                                </svg>
                            </div>
                        </div>
                        <div className="penalty-ball" id="penaltyBallFull" aria-hidden="true"></div>
                        <div className="penalty-result" id="penaltyResultFull" role="status" aria-live="polite"></div>
                        <div className="game-overlay fv-overlay" id="penaltyOverlayFull"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
