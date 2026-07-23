import { burstConfettiAt } from './confetti';
export function initGames() {
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var gameFrameRect = null;
var penaltyFrameRect = null;
        /* ---------- mini game: catch the chai ---------- */
        (function () {
            var frame = document.getElementById('gameFrame');
            var catcher = document.getElementById('catcher');
            var overlay = document.getElementById('gameOverlay');
            var scoreEl = document.getElementById('gameScore');
            var bestEl = document.getElementById('gameBest');
            var hearts = document.querySelectorAll('#gameLives .life');
            if (!frame || !catcher || !overlay) return;

            var state = 'idle';
            var score = 0, lives = 3, best = 0;
            var items = [];
            var catcherX = 0;
            var lastTime = 0, spawnAcc = 0;
            var CATCHER_W = 72, ITEM_S = 34;

            // Smooth velocity movement setup
            var keysPressed = { ArrowLeft: false, ArrowRight: false };
            var CATCHER_SPEED = 0.45; // pixels per millisecond

            // Load best score from localStorage
            best = parseInt(localStorage.getItem('chai_best') || '0', 10);

            function chaiIcon() {
                return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M4 9h13a3 3 0 010 6h-1"/><path d="M4 9v6a4 4 0 004 4h4a4 4 0 004-4V9"/><path d="M7 5v2M11 5v2"/></svg>';
            }
            function bugIcon() {
                return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><ellipse cx="12" cy="13" rx="5" ry="7"/><path d="M12 6V3M9 4l1.5 2M15 4l-1.5 2M4 11l3 1M20 11l-3 1M4 17l3-1M20 17l-3-1"/></svg>';
            }

            function setLives(n) {
                lives = n;
                hearts.forEach(function (h, i) { h.classList.toggle('lost', i >= lives); });
            }

            function updateHUD() {
                scoreEl.textContent = score;
                bestEl.textContent = best;
            }

            function scoreMessage(s) {
                if (s >= 40) return 'Bug whisperer. The good kind, finally.';
                if (s >= 25) return 'Certified chai goblin.';
                if (s >= 10) return 'Solid effort. Respectable sipping.';
                return 'Rookie sipper. The bugs got you.';
            }

            function renderOverlay(kind) {
                if (kind === 'idle') {
                    overlay.innerHTML = '<h3>Ready?</h3><p>Catch the chai. Dodge the bugs. That\u2019s it, that\u2019s the game.</p><button class="btn btn-primary" data-action="play">Play</button>';
                    overlay.style.display = 'flex';
                } else if (kind === 'over') {
                    overlay.innerHTML = '<h3>Game over</h3><p>Score: ' + score + ' \u2014 ' + scoreMessage(score) + '</p><button class="btn btn-primary" data-action="play">Play again</button>';
                    overlay.style.display = 'flex';
                } else if (kind === 'paused') {
                    overlay.innerHTML = '<h3>Paused</h3><p>Scrolled away mid-sip. Score so far: ' + score + '.</p><button class="btn btn-primary" data-action="resume">Resume</button>';
                    overlay.style.display = 'flex';
                } else {
                    overlay.style.display = 'none';
                }
            }

            overlay.addEventListener('click', function (e) {
                if (!(e.target.matches && e.target.matches('[data-action]'))) return;
                var action = e.target.getAttribute('data-action');
                if (action === 'play') startGame();
                else if (action === 'resume') resumeGame();
            });

            function startGame() {
                items.forEach(function (it) { it.el.remove(); });
                items = [];
                score = 0; spawnAcc = 0;
                setLives(3);
                updateHUD();
                state = 'playing';
                frame.classList.add('is-playing');
                renderOverlay('playing');
                if (!gameFrameRect) gameFrameRect = frame.getBoundingClientRect();
                catcherX = gameFrameRect.width / 2 - CATCHER_W / 2;
                catcher.style.left = catcherX + 'px';
                lastTime = performance.now();
                requestAnimationFrame(loop);
            }

            function resumeGame() {
                state = 'playing';
                frame.classList.add('is-playing');
                renderOverlay('playing');
                if (!gameFrameRect) gameFrameRect = frame.getBoundingClientRect();
                lastTime = performance.now();
                requestAnimationFrame(loop);
            }

            function endGame() {
                state = 'over';
                frame.classList.remove('is-playing');
                if (score > best) {
                    best = score;
                    localStorage.setItem('chai_best', best);
                }
                updateHUD();
                renderOverlay('over');
            }

            function spawnItem() {
                if (!gameFrameRect) gameFrameRect = frame.getBoundingClientRect();
                var isBug = Math.random() < Math.min(0.45, 0.18 + score * 0.012);
                var el = document.createElement('div');
                el.className = 'falling-item ' + (isBug ? 'bug' : 'chai');
                el.innerHTML = isBug ? bugIcon() : chaiIcon();
                var x = Math.random() * (gameFrameRect.width - ITEM_S);
                el.style.left = x + 'px';
                el.style.top = '-40px';
                frame.appendChild(el);
                items.push({
                    el: el, x: x, y: -40,
                    vy: 1.6 + Math.min(2.2, score * 0.04),
                    type: isBug ? 'bug' : 'chai',
                    wob: Math.random() * Math.PI * 2
                });
            }

            function popScore(text, x, y, cls) {
                if (reduceMotion) return;
                var pop = document.createElement('div');
                pop.className = 'score-pop' + (cls ? ' ' + cls : '');
                pop.textContent = text;
                pop.style.left = x + 'px';
                pop.style.top = y + 'px';
                frame.appendChild(pop);
                setTimeout(function () { pop.remove(); }, 650);
            }

            function loop(now) {
                if (state !== 'playing') return;
                var dt = now - lastTime; lastTime = now;
                dt = Math.min(dt, 50);
                spawnAcc += dt;
                var gap = Math.max(420, 950 - score * 16);
                if (spawnAcc > gap) { spawnItem(); spawnAcc = 0; }

                // Update catcher position based on velocity & keys pressed
                if (!gameFrameRect) gameFrameRect = frame.getBoundingClientRect();
                if (keysPressed.ArrowLeft) {
                    catcherX = Math.max(0, catcherX - CATCHER_SPEED * dt);
                    catcher.style.left = catcherX + 'px';
                }
                if (keysPressed.ArrowRight) {
                    catcherX = Math.min(gameFrameRect.width - CATCHER_W, catcherX + CATCHER_SPEED * dt);
                    catcher.style.left = catcherX + 'px';
                }

                var catcherTop = gameFrameRect.height - 14 - 24;
                for (var i = items.length - 1; i >= 0; i--) {
                    var it = items[i];
                    it.y += it.vy * (dt / 16.7);
                    if (it.type === 'bug' && !reduceMotion) { it.x += Math.sin((it.y + it.wob) / 18) * 0.8; }
                    it.el.style.top = it.y + 'px';
                    it.el.style.left = it.x + 'px';

                    if (it.y + ITEM_S >= catcherTop && it.y <= catcherTop + 24) {
                        var overlapX = (it.x + ITEM_S > catcherX) && (it.x < catcherX + CATCHER_W);
                        if (overlapX) {
                            if (it.type === 'chai') {
                                score++;
                                popScore('+1', it.x, it.y);
                                if (score % 10 === 0) {
                                    burstConfettiAt(gameFrameRect.left + it.x, gameFrameRect.top + it.y);
                                }
                            } else {
                                setLives(lives - 1);
                                catcher.classList.add('hit');
                                setTimeout(function () { catcher.classList.remove('hit'); }, 250);
                                popScore('-1', it.x, it.y, 'bad');
                                if (lives <= 0) {
                                    it.el.remove();
                                    items.splice(i, 1);
                                    updateHUD();
                                    endGame();
                                    return;
                                }
                            }
                            updateHUD();
                            it.el.remove();
                            items.splice(i, 1);
                            continue;
                        }
                    }
                    if (it.y > gameFrameRect.height) {
                        it.el.remove();
                        items.splice(i, 1);
                    }
                }
                requestAnimationFrame(loop);
            }

            function moveCatcherTo(clientX) {
                if (!gameFrameRect) gameFrameRect = frame.getBoundingClientRect();
                var x = clientX - gameFrameRect.left - CATCHER_W / 2;
                catcherX = Math.max(0, Math.min(gameFrameRect.width - CATCHER_W, x));
                catcher.style.left = catcherX + 'px';
            }

            frame.addEventListener('mousemove', function (e) {
                if (state === 'playing') moveCatcherTo(e.clientX);
            });
            frame.addEventListener('touchmove', function (e) {
                if (state === 'playing') {
                    if (e.touches[0]) moveCatcherTo(e.touches[0].clientX);
                    e.preventDefault();
                }
            }, { passive: false });

            // Keyboard smooth velocity movement listeners
            document.addEventListener('keydown', function (e) {
                if (state !== 'playing') return;
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault(); // prevent arrow scrolling!
                    keysPressed[e.key] = true;
                }
            });

            document.addEventListener('keyup', function (e) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    keysPressed[e.key] = false;
                }
            });

            if ('IntersectionObserver' in window) {
                var visObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting && state === 'playing') {
                            state = 'paused';
                            frame.classList.remove('is-playing');
                            renderOverlay('paused');
                        }
                    });
                }, { threshold: 0 });
                visObserver.observe(frame);
            }

            renderOverlay('idle');
            updateHUD();
        })();

        /* ---------- mini game 2: penalty shootout ---------- */
        (function () {
            var frame = document.getElementById('penaltyFrame');
            var ball = document.getElementById('penaltyBall');
            var keeper = document.getElementById('penaltyKeeper');
            var resultEl = document.getElementById('penaltyResult');
            var overlay = document.getElementById('penaltyOverlay');
            var scoreEl = document.getElementById('penaltyScore');
            var bestEl = document.getElementById('penaltyBest');
            if (!frame || !ball || !keeper || !overlay) return;

            var state = 'idle';
            var isVisible = true;
            var score = 0, best = 0;
            var sweepX = 0.5;
            var sweepDir = 1;
            var sweepSpeed = 0.55;
            var lastTime = 0;
            var TRACK_LEFT = 12, TRACK_RIGHT = 88;

            best = parseInt(localStorage.getItem('penalty_best') || '0', 10);

            function scoreMessage(s) {
                if (s >= 8) return 'Perfect record. The keeper\u2019s given up guessing.';
                if (s >= 5) return 'Ice in your veins.';
                if (s >= 2) return 'Not bad. Nerves of reasonably calm.';
                return 'Saved early. Happens to the pros too.';
            }

            function renderOverlay(kind) {
                if (kind === 'idle') {
                    overlay.innerHTML = '<h3>Ready?</h3><p>Click, tap, or press space to strike. Down the middle always gets saved \u2014 go for a corner.</p><button class="btn btn-primary" data-action="play">Play</button>';
                    overlay.style.display = 'flex';
                } else if (kind === 'over') {
                    overlay.innerHTML = '<h3>Saved!</h3><p>Goals scored: ' + score + ' \u2014 ' + scoreMessage(score) + '</p><button class="btn btn-primary" data-action="play">Play again</button>';
                    overlay.style.display = 'flex';
                } else if (kind === 'paused') {
                    overlay.innerHTML = '<h3>Paused</h3><p>Scrolled away mid-shootout. Goals so far: ' + score + '.</p><button class="btn btn-primary" data-action="resume">Resume</button>';
                    overlay.style.display = 'flex';
                } else {
                    overlay.style.display = 'none';
                }
            }
            overlay.addEventListener('click', function (e) {
                if (!(e.target.matches && e.target.matches('[data-action]'))) return;
                var action = e.target.getAttribute('data-action');
                if (action === 'play') startGame();
                else if (action === 'resume') resumeGame();
            });

            function updateHUD() {
                scoreEl.textContent = score;
                bestEl.textContent = best;
            }

            function positionBallAtSweep() {
                var pct = TRACK_LEFT + sweepX * (TRACK_RIGHT - TRACK_LEFT);
                ball.style.left = pct + '%';
            }

            function resetVisuals() {
                ball.className = 'penalty-ball';
                ball.style.bottom = '16px';
                ball.style.transform = 'translateX(-50%) scale(1)';
                keeper.className = 'penalty-keeper';
                resultEl.classList.remove('show', 'miss');
            }

            function startGame() {
                score = 0;
                updateHUD();
                sweepSpeed = 0.55;
                sweepX = 0.5; sweepDir = (Math.random() < 0.5 ? -1 : 1);
                resetVisuals();
                positionBallAtSweep();
                state = 'aiming';
                frame.classList.add('is-playing');
                renderOverlay('playing');
                lastTime = performance.now();
                requestAnimationFrame(loop);
            }
            function resumeGame() {
                state = 'aiming';
                frame.classList.add('is-playing');
                renderOverlay('playing');
                lastTime = performance.now();
                requestAnimationFrame(loop);
            }
            function endGame() {
                state = 'over';
                frame.classList.remove('is-playing');
                if (score > best) {
                    best = score;
                    localStorage.setItem('penalty_best', best);
                }
                updateHUD();
                renderOverlay('over');
            }

            function loop(now) {
                if (state !== 'aiming') return;
                var dt = now - lastTime; lastTime = now;
                dt = Math.min(dt, 50);
                sweepX += (sweepSpeed * sweepDir * dt) / 1000;
                if (sweepX >= 1) { sweepX = 1; sweepDir = -1; }
                if (sweepX <= 0) { sweepX = 0; sweepDir = 1; }
                positionBallAtSweep();
                requestAnimationFrame(loop);
            }

            function zoneFor(x) {
                if (x < 0.32) return 'left';
                if (x > 0.68) return 'right';
                return 'center';
            }

            function shoot() {
                if (state !== 'aiming') return;
                state = 'resolving';
                frame.classList.remove('is-playing');

                var zone = zoneFor(sweepX);
                var keeperZone = (zone === 'center') ? 'center' : (Math.random() < 0.5 ? 'left' : 'right');
                var scored = (zone !== 'center') && (zone !== keeperZone);

                var targetPct;
                if (zone === 'left') targetPct = 18 + Math.random() * 8;
                else if (zone === 'right') targetPct = 74 + Math.random() * 8;
                else targetPct = 46 + Math.random() * 8;

                ball.classList.add('shooting');
                ball.style.left = targetPct + '%';
                ball.style.bottom = '58%';
                ball.style.transform = 'translateX(-50%) scale(0.65)';

                if (keeperZone === 'left') keeper.className = 'penalty-keeper dive-left';
                else if (keeperZone === 'right') keeper.className = 'penalty-keeper dive-right';

                var animDelay = reduceMotion ? 60 : 450;
                setTimeout(function () {
                    if (scored) {
                        score++;
                        updateHUD();
                        resultEl.textContent = 'GOAL!';
                        resultEl.classList.remove('miss');
                        resultEl.classList.add('show');
                        if (score % 5 === 0) {
                            if (!penaltyFrameRect) penaltyFrameRect = frame.getBoundingClientRect();
                            burstConfettiAt(penaltyFrameRect.left + penaltyFrameRect.width / 2, penaltyFrameRect.top + penaltyFrameRect.height * 0.3);
                        }
                        var pauseDelay = reduceMotion ? 200 : 700;
                        setTimeout(function () {
                            resultEl.classList.remove('show');
                            if (isVisible) {
                                sweepSpeed = Math.min(1.5, sweepSpeed + 0.07);
                                sweepX = 0.5; sweepDir = (Math.random() < 0.5 ? -1 : 1);
                                resetVisuals();
                                positionBallAtSweep();
                                state = 'aiming';
                                frame.classList.add('is-playing');
                                lastTime = performance.now();
                                requestAnimationFrame(loop);
                            } else {
                                state = 'paused';
                                renderOverlay('paused');
                            }
                        }, pauseDelay);
                    } else {
                        resultEl.textContent = 'SAVED';
                        resultEl.classList.add('show', 'miss');
                        var overDelay = reduceMotion ? 250 : 900;
                        setTimeout(function () { endGame(); }, overDelay);
                    }
                }, animDelay);
            }

            frame.addEventListener('mousedown', function () { shoot(); });
            frame.addEventListener('touchstart', function (e) {
                if (state === 'aiming') { shoot(); e.preventDefault(); }
            }, { passive: false });
            document.addEventListener('keydown', function (e) {
                if (e.code === 'Space' && state === 'aiming') {
                    e.preventDefault();
                    shoot();
                }
            });

            if ('IntersectionObserver' in window) {
                var visObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        isVisible = entry.isIntersecting;
                        if (!isVisible && state === 'aiming') {
                            state = 'paused';
                            frame.classList.remove('is-playing');
                            renderOverlay('paused');
                        }
                    });
                }, { threshold: 0 });
                visObserver.observe(frame);
            }

            renderOverlay('idle');
            updateHUD();
        })();

        /* ---------- Full-view game modals ---------- */
        (function () {
            // ---- Chai full-view ----
            var chaiFullview = document.getElementById('chaiFullview');
            var chaiExpandBtn = document.getElementById('chaiExpandBtn');
            var chaiFullviewClose = document.getElementById('chaiFullviewClose');

            // ---- Penalty full-view ----
            var penaltyFullview = document.getElementById('penaltyFullview');
            var penaltyExpandBtn = document.getElementById('penaltyExpandBtn');
            var penaltyFullviewClose = document.getElementById('penaltyFullviewClose');

            /* --- Mini Chai game factory (runs independently in any frame element) --- */
            function initChaiGame(opts) {
                var frame = opts.frame, catcher = opts.catcher, overlay = opts.overlay,
                    scoreEl = opts.scoreEl, bestEl = opts.bestEl, heartsEl = opts.heartsEl;
                if (!frame || !catcher || !overlay) return { isActive: function() { return false; } };

                var state = 'idle', score = 0, lives = 3, best = parseInt(localStorage.getItem('chai_best') || '0', 10);
                var items = [], catcherX = 0, lastTime = 0, spawnAcc = 0;
                var CATCHER_W = 72, ITEM_S = 34;
                var keysPressed = { ArrowLeft: false, ArrowRight: false };
                var CATCHER_SPEED = 0.45;
                var frameRect = null;
                var hearts = heartsEl ? Array.prototype.slice.call(heartsEl.querySelectorAll('.life')) : [];

                function chaiIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M4 9h13a3 3 0 010 6h-1"/><path d="M4 9v6a4 4 0 004 4h4a4 4 0 004-4V9"/><path d="M7 5v2M11 5v2"/></svg>'; }
                function bugIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><ellipse cx="12" cy="13" rx="5" ry="7"/><path d="M12 6V3M9 4l1.5 2M15 4l-1.5 2M4 11l3 1M20 11l-3 1M4 17l3-1M20 17l-3-1"/></svg>'; }

                function updateHUD() { if (scoreEl) scoreEl.textContent = score; if (bestEl) bestEl.textContent = best; }
                function setLives(n) { lives = n; hearts.forEach(function(h, i) { h.classList.toggle('lost', i >= lives); }); }

                function renderOverlay(kind) {
                    if (kind === 'idle') {
                        overlay.innerHTML = '<h3>Ready?</h3><p>Catch the chai. Dodge the bugs. That\u2019s it.</p><button class="btn btn-primary" data-action="play">Play</button>';
                        overlay.style.display = 'flex';
                    } else if (kind === 'over') {
                        overlay.innerHTML = '<h3>Game over</h3><p>Score: ' + score + '</p><button class="btn btn-primary" data-action="play">Play again</button>';
                        overlay.style.display = 'flex';
                    } else { overlay.style.display = 'none'; }
                }

                overlay.addEventListener('click', function(e) {
                    if (e.target && e.target.matches && e.target.matches('[data-action="play"]')) startGame();
                });

                function startGame() {
                    items.forEach(function(it) { it.el.remove(); });
                    items = []; score = 0; spawnAcc = 0;
                    setLives(3); updateHUD();
                    state = 'playing';
                    frame.classList.add('is-playing');
                    renderOverlay('playing');
                    frameRect = frame.getBoundingClientRect();
                    catcherX = frameRect.width / 2 - CATCHER_W / 2;
                    catcher.style.left = catcherX + 'px';
                    lastTime = performance.now();
                    requestAnimationFrame(loop);
                }

                function endGame() {
                    state = 'over';
                    frame.classList.remove('is-playing');
                    if (score > best) { best = score; localStorage.setItem('chai_best', best); }
                    updateHUD(); renderOverlay('over');
                }

                function spawnItem() {
                    frameRect = frame.getBoundingClientRect();
                    var isBug = Math.random() < Math.min(0.45, 0.18 + score * 0.012);
                    var el = document.createElement('div');
                    el.className = 'falling-item ' + (isBug ? 'bug' : 'chai');
                    el.innerHTML = isBug ? bugIcon() : chaiIcon();
                    var x = Math.random() * (frameRect.width - ITEM_S);
                    el.style.left = x + 'px'; el.style.top = '-40px';
                    frame.appendChild(el);
                    items.push({ el: el, x: x, y: -40, vy: 1.6 + Math.min(2.2, score * 0.04), type: isBug ? 'bug' : 'chai', wob: Math.random() * Math.PI * 2 });
                }

                function loop(now) {
                    if (state !== 'playing') return;
                    var dt = Math.min(now - lastTime, 50); lastTime = now;
                    spawnAcc += dt;
                    var gap = Math.max(420, 950 - score * 16);
                    if (spawnAcc > gap) { spawnItem(); spawnAcc = 0; }

                    frameRect = frame.getBoundingClientRect();
                    if (keysPressed.ArrowLeft) { catcherX = Math.max(0, catcherX - CATCHER_SPEED * dt); catcher.style.left = catcherX + 'px'; }
                    if (keysPressed.ArrowRight) { catcherX = Math.min(frameRect.width - CATCHER_W, catcherX + CATCHER_SPEED * dt); catcher.style.left = catcherX + 'px'; }

                    var catcherTop = frameRect.height - 14 - 24;
                    for (var i = items.length - 1; i >= 0; i--) {
                        var it = items[i];
                        it.y += it.vy * (dt / 16.7);
                        if (it.type === 'bug' && !reduceMotion) { it.x += Math.sin((it.y + it.wob) / 18) * 0.8; }
                        it.el.style.top = it.y + 'px'; it.el.style.left = it.x + 'px';
                        if (it.y + ITEM_S >= catcherTop && it.y <= catcherTop + 24) {
                            if ((it.x + ITEM_S > catcherX) && (it.x < catcherX + CATCHER_W)) {
                                if (it.type === 'chai') { score++; }
                                else {
                                    setLives(lives - 1);
                                    catcher.classList.add('hit');
                                    setTimeout(function() { catcher.classList.remove('hit'); }, 250);
                                    if (lives <= 0) { it.el.remove(); items.splice(i, 1); updateHUD(); endGame(); return; }
                                }
                                updateHUD(); it.el.remove(); items.splice(i, 1); continue;
                            }
                        }
                        if (it.y > frameRect.height) { it.el.remove(); items.splice(i, 1); }
                    }
                    requestAnimationFrame(loop);
                }

                function moveCatcherTo(clientX) {
                    frameRect = frame.getBoundingClientRect();
                    var x = clientX - frameRect.left - CATCHER_W / 2;
                    catcherX = Math.max(0, Math.min(frameRect.width - CATCHER_W, x));
                    catcher.style.left = catcherX + 'px';
                }

                frame.addEventListener('mousemove', function(e) { if (state === 'playing') moveCatcherTo(e.clientX); });
                frame.addEventListener('touchmove', function(e) {
                    if (state === 'playing' && e.touches[0]) { moveCatcherTo(e.touches[0].clientX); e.preventDefault(); }
                }, { passive: false });

                document.addEventListener('keydown', function(e) {
                    if (state !== 'playing') return;
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); keysPressed[e.key] = true; }
                });
                document.addEventListener('keyup', function(e) {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') keysPressed[e.key] = false;
                });

                renderOverlay('idle'); updateHUD();
                return {
                    isActive: function() { return state === 'playing'; },
                    stop: function() { state = 'idle'; frame.classList.remove('is-playing'); items.forEach(function(it) { it.el.remove(); }); items = []; overlay.style.display = 'none'; }
                };
            }

            /* --- Mini Penalty game factory --- */
            function initPenaltyGame(opts) {
                var frame = opts.frame, ball = opts.ball, keeper = opts.keeper,
                    resultEl = opts.resultEl, overlay = opts.overlay, scoreEl = opts.scoreEl, bestEl = opts.bestEl;
                if (!frame || !ball || !keeper || !overlay) return;

                var state = 'idle', score = 0, best = parseInt(localStorage.getItem('penalty_best') || '0', 10);
                var sweepX = 0.5, sweepDir = 1, sweepSpeed = 0.55, lastTime = 0;
                var TRACK_LEFT = 12, TRACK_RIGHT = 88;

                function updateHUD() { if (scoreEl) scoreEl.textContent = score; if (bestEl) bestEl.textContent = best; }
                function positionBall() { ball.style.left = (TRACK_LEFT + sweepX * (TRACK_RIGHT - TRACK_LEFT)) + '%'; }
                function resetVisuals() {
                    ball.className = 'penalty-ball'; ball.style.bottom = '16px'; ball.style.transform = 'translateX(-50%) scale(1)';
                    keeper.className = 'penalty-keeper'; resultEl.classList.remove('show', 'miss');
                }

                function renderOverlay(kind) {
                    if (kind === 'idle') {
                        overlay.innerHTML = '<h3>Ready?</h3><p>Click or tap to strike. Corner is your best bet.</p><button class="btn btn-primary" data-action="play">Play</button>';
                        overlay.style.display = 'flex';
                    } else if (kind === 'over') {
                        overlay.innerHTML = '<h3>Saved!</h3><p>Goals: ' + score + '</p><button class="btn btn-primary" data-action="play">Play again</button>';
                        overlay.style.display = 'flex';
                    } else { overlay.style.display = 'none'; }
                }
                overlay.addEventListener('click', function(e) {
                    if (e.target && e.target.matches && e.target.matches('[data-action="play"]')) startGame();
                });

                function startGame() {
                    score = 0; updateHUD(); sweepSpeed = 0.55;
                    sweepX = 0.5; sweepDir = (Math.random() < 0.5 ? -1 : 1);
                    resetVisuals(); positionBall();
                    state = 'aiming'; frame.classList.add('is-playing');
                    renderOverlay('playing'); lastTime = performance.now();
                    requestAnimationFrame(loop);
                }
                function endGame() {
                    state = 'over'; frame.classList.remove('is-playing');
                    if (score > best) { best = score; localStorage.setItem('penalty_best', best); }
                    updateHUD(); renderOverlay('over');
                }
                function loop(now) {
                    if (state !== 'aiming') return;
                    var dt = Math.min(now - lastTime, 50); lastTime = now;
                    sweepX += (sweepSpeed * sweepDir * dt) / 1000;
                    if (sweepX >= 1) { sweepX = 1; sweepDir = -1; }
                    if (sweepX <= 0) { sweepX = 0; sweepDir = 1; }
                    positionBall(); requestAnimationFrame(loop);
                }
                function shoot() {
                    if (state !== 'aiming') return;
                    state = 'resolving'; frame.classList.remove('is-playing');
                    var zone = sweepX < 0.32 ? 'left' : sweepX > 0.68 ? 'right' : 'center';
                    var keeperZone = zone === 'center' ? 'center' : (Math.random() < 0.5 ? 'left' : 'right');
                    var scored = zone !== 'center' && zone !== keeperZone;
                    var targetPct = zone === 'left' ? 18 + Math.random() * 8 : zone === 'right' ? 74 + Math.random() * 8 : 46 + Math.random() * 8;
                    ball.classList.add('shooting'); ball.style.left = targetPct + '%'; ball.style.bottom = '58%'; ball.style.transform = 'translateX(-50%) scale(0.65)';
                    if (keeperZone === 'left') keeper.className = 'penalty-keeper dive-left';
                    else if (keeperZone === 'right') keeper.className = 'penalty-keeper dive-right';
                    var delay = reduceMotion ? 60 : 450;
                    setTimeout(function() {
                        if (scored) {
                            score++; updateHUD(); resultEl.textContent = 'GOAL!'; resultEl.classList.remove('miss'); resultEl.classList.add('show');
                            setTimeout(function() {
                                resultEl.classList.remove('show'); sweepSpeed = Math.min(1.5, sweepSpeed + 0.07);
                                sweepX = 0.5; sweepDir = (Math.random() < 0.5 ? -1 : 1); resetVisuals(); positionBall();
                                state = 'aiming'; frame.classList.add('is-playing'); lastTime = performance.now(); requestAnimationFrame(loop);
                            }, reduceMotion ? 200 : 700);
                        } else {
                            resultEl.textContent = 'SAVED'; resultEl.classList.add('show', 'miss');
                            setTimeout(function() { endGame(); }, reduceMotion ? 250 : 900);
                        }
                    }, delay);
                }
                frame.addEventListener('mousedown', function() { shoot(); });
                frame.addEventListener('touchstart', function(e) { if (state === 'aiming') { shoot(); e.preventDefault(); } }, { passive: false });
                document.addEventListener('keydown', function(e) { if (e.code === 'Space' && state === 'aiming') { e.preventDefault(); shoot(); } });

                renderOverlay('idle'); updateHUD();
                return {
                    stop: function() { state = 'idle'; frame.classList.remove('is-playing'); overlay.style.display = 'none'; }
                };
            }

            /* Open / close logic for full-view modals */
            var chaiFVGame = null;
            var penaltyFVGame = null;

            function openChaiFullview() {
                if (!chaiFullview) return;
                chaiFullview.classList.add('open');
                document.body.classList.add('modal-open');
                if (!chaiFVGame) {
                    chaiFVGame = initChaiGame({
                        frame: document.getElementById('gameFrameFull'),
                        catcher: document.getElementById('catcherFull'),
                        overlay: document.getElementById('gameOverlayFull'),
                        scoreEl: document.getElementById('gameScoreFull'),
                        bestEl: document.getElementById('gameBestFull'),
                        heartsEl: document.getElementById('gameLivesFull')
                    });
                }
                if (chaiFullviewClose) chaiFullviewClose.focus();
            }

            function closeChaiFullview() {
                if (!chaiFullview) return;
                chaiFullview.classList.remove('open');
                document.body.classList.remove('modal-open');
                if (chaiFVGame) { chaiFVGame.stop(); }
                if (chaiExpandBtn) chaiExpandBtn.focus();
            }

            function openPenaltyFullview() {
                if (!penaltyFullview) return;
                penaltyFullview.classList.add('open');
                document.body.classList.add('modal-open');
                if (!penaltyFVGame) {
                    penaltyFVGame = initPenaltyGame({
                        frame: document.getElementById('penaltyFrameFull'),
                        ball: document.getElementById('penaltyBallFull'),
                        keeper: document.getElementById('penaltyKeeperFull'),
                        resultEl: document.getElementById('penaltyResultFull'),
                        overlay: document.getElementById('penaltyOverlayFull'),
                        scoreEl: document.getElementById('penaltyScoreFull'),
                        bestEl: document.getElementById('penaltyBestFull')
                    });
                }
                if (penaltyFullviewClose) penaltyFullviewClose.focus();
            }

            function closePenaltyFullview() {
                if (!penaltyFullview) return;
                penaltyFullview.classList.remove('open');
                document.body.classList.remove('modal-open');
                if (penaltyFVGame) { penaltyFVGame.stop(); }
                if (penaltyExpandBtn) penaltyExpandBtn.focus();
            }

            if (chaiExpandBtn) chaiExpandBtn.addEventListener('click', openChaiFullview);
            if (chaiFullviewClose) chaiFullviewClose.addEventListener('click', closeChaiFullview);
            if (chaiFullview) chaiFullview.addEventListener('click', function(e) { if (e.target === chaiFullview) closeChaiFullview(); });

            if (penaltyExpandBtn) penaltyExpandBtn.addEventListener('click', openPenaltyFullview);
            if (penaltyFullviewClose) penaltyFullviewClose.addEventListener('click', closePenaltyFullview);
            if (penaltyFullview) penaltyFullview.addEventListener('click', function(e) { if (e.target === penaltyFullview) closePenaltyFullview(); });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (chaiFullview && chaiFullview.classList.contains('open')) closeChaiFullview();
                    if (penaltyFullview && penaltyFullview.classList.contains('open')) closePenaltyFullview();
                }
            });
        })();

}
