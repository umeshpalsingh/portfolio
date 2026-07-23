<script>
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* theme toggle */
        (function () {
            var themeToggle = document.getElementById('themeToggle');
            if (!themeToggle) return;
            var currentTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', currentTheme);
            
            themeToggle.addEventListener('click', function () {
                var theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            });
        })();

        /* marquee: measure one set of items, then duplicate enough copies to
           comfortably cover 2x the viewport width. */
        (function () {
            var track = document.getElementById('marqueeTrack');
            if (!track) return;
            var baseHTML = track.innerHTML;
            function build() {
                track.innerHTML = baseHTML;
                var setWidth = track.scrollWidth;
                if (!setWidth) return;
                var minTotal = window.innerWidth * 2;
                var copies = Math.max(2, Math.ceil(minTotal / setWidth) + 1);
                var html = '';
                for (var i = 0; i < copies; i++) { html += baseHTML; }
                track.innerHTML = html;
                track.style.setProperty('--marquee-distance', setWidth + 'px');
            }
            build();
            var resizeTimer = null;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(build, 150);
            });
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(build);
            }
        })();

        /* mobile nav toggle */
        var toggle = document.getElementById('navToggle');
        var links = document.getElementById('navLinks');
        function getMenuFocusable() {
            return [toggle].concat(Array.prototype.slice.call(links.querySelectorAll('a')));
        }
        function setMenuOpen(isOpen) {
            links.classList.toggle('open', isOpen);
            toggle.classList.toggle('active', isOpen);
            toggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
            if (isOpen) {
                var focusable = getMenuFocusable();
                if (focusable[1]) focusable[1].focus(); // focus first link
            } else if (document.activeElement && (links.contains(document.activeElement) || document.activeElement === toggle)) {
                toggle.focus();
            }
        }
        toggle.addEventListener('click', function () {
            setMenuOpen(!links.classList.contains('open'));
        });
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { setMenuOpen(false); });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && links.classList.contains('open')) setMenuOpen(false);
        });
        /* keep keyboard focus trapped inside the mobile nav menu when open */
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Tab' || !links.classList.contains('open')) return;
            var focusable = getMenuFocusable();
            if (!focusable.length) return;
            var first = focusable[0], last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        });

        /* scroll management & cached measurements */
        var nav = document.getElementById('siteNav');
        var toTop = document.getElementById('toTop');
        var scrollProgressEl = document.getElementById('scrollProgress');
        var heroEl = document.getElementById('hero');
        var blobWrap1 = document.getElementById('blobWrap1');
        var blobWrap2 = document.getElementById('blobWrap2');
        var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
        var navAnchors = Array.prototype.slice.call(links.querySelectorAll('a[href^="#"]'));
        
        // Cache layout properties to avoid layout thrashes
        var cachedHeroHeight = 0;
        var gameFrameRect = null;
        var penaltyFrameRect = null;

        function updateCachedMetrics() {
            if (heroEl) cachedHeroHeight = heroEl.offsetHeight;
            var gFrame = document.getElementById('gameFrame');
            if (gFrame) gameFrameRect = gFrame.getBoundingClientRect();
            var pFrame = document.getElementById('penaltyFrame');
            if (pFrame) penaltyFrameRect = pFrame.getBoundingClientRect();
        }

        window.addEventListener('load', updateCachedMetrics);
        window.addEventListener('resize', updateCachedMetrics);
        window.addEventListener('scroll', updateCachedMetrics, { passive: true });
        updateCachedMetrics();

        function updateScrollProgress() {
            var doc = document.documentElement;
            var trackHeight = doc.scrollHeight - doc.clientHeight;
            var pct = trackHeight > 0 ? (window.scrollY / trackHeight) * 100 : 0;
            scrollProgressEl.style.width = pct + '%';
        }

        // Use IntersectionObserver instead of layout offsetTop queries in scroll events
        if ('IntersectionObserver' in window) {
            var activeNavObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var id = entry.target.id;
                        navAnchors.forEach(function (a) {
                            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                        });
                    }
                });
            }, { rootMargin: '-30% 0px -60% 0px' });
            sections.forEach(function (sec) { activeNavObserver.observe(sec); });
        }

        function updateParallax() {
            if (reduceMotion || !heroEl) return;
            var y = Math.min(window.scrollY, cachedHeroHeight);
            if (blobWrap1) blobWrap1.style.transform = 'translateY(' + (y * 0.18) + 'px)';
            if (blobWrap2) blobWrap2.style.transform = 'translateY(' + (y * -0.12) + 'px)';
        }

        var ticking = false;
        function onScroll() {
            var y = window.scrollY;
            nav.classList.toggle('scrolled', y > 30);
            toTop.classList.toggle('show', y > 600);
            updateScrollProgress();
            updateParallax();
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
        }, { passive: true });
        onScroll();

        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });

        /* scroll reveal — handles .reveal AND new directional .reveal-left/right/up */
        var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
        if ('IntersectionObserver' in window) {
            var revealObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });
            revealEls.forEach(function (el) { revealObs.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        }

        /* count-up stats — handles both .stat-num and .about-stat-num */
        function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
        function animateCount(el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            var duration = 1400;
            var start = null;
            function step(ts) {
                if (!start) start = ts;
                var progress = Math.min((ts - start) / duration, 1);
                el.textContent = Math.round(easeOutExpo(progress) * target);
                if (progress < 1) requestAnimationFrame(step);
            }
            if (reduceMotion) { el.textContent = target; } else { requestAnimationFrame(step); }
        }
        var countEls = document.querySelectorAll('.stat-num:not(.no-count), .about-stat-num');
        if ('IntersectionObserver' in window) {
            var countObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        countObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            countEls.forEach(function (el) { countObs.observe(el); });
        }

        /* cycling hero word */
        var words = ['a developer.', 'a dreamer.', 'forever curious.', 'a collector of half-finished hobbies.', 'always up for chai.'];
        var cycleEl = document.getElementById('cycleWord');
        if (!reduceMotion && cycleEl) {
            var idx = 0;
            setInterval(function () {
                cycleEl.classList.add('swap');
                setTimeout(function () {
                    idx = (idx + 1) % words.length;
                    cycleEl.textContent = words[idx];
                    cycleEl.classList.remove('swap');
                }, 400);
            }, 2600);
        }

        /* magnetic buttons */
        if (!reduceMotion) {
            document.querySelectorAll('.magnetic').forEach(function (btn) {
                btn.addEventListener('mousemove', function (e) {
                    var r = btn.getBoundingClientRect();
                    var x = (e.clientX - r.left) / r.width - 0.5;
                    var y = (e.clientY - r.top) / r.height - 0.5;
                    btn.style.transform = 'translate(' + (x * 10) + 'px,' + (y * 10) + 'px)';
                });
                btn.addEventListener('mouseleave', function () {
                    btn.style.transform = 'translate(0,0)';
                });
            });
        }

        /* confetti burst */
        var colors = ['#2FA84F', '#FFD400', '#DFF4CC', '#1F7A3B'];
        function burstConfettiAt(cx, cy, count) {
            if (reduceMotion) return;
            count = count || 14;
            for (var i = 0; i < count; i++) {
                var bit = document.createElement('div');
                bit.className = 'confetti-bit';
                bit.style.left = cx + 'px';
                bit.style.top = cy + 'px';
                bit.style.background = colors[i % colors.length];
                document.body.appendChild(bit);
                var angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
                var dist = 60 + Math.random() * 50;
                requestAnimationFrame(function (b, a, d) {
                    return function () {
                        b.style.transform = 'translate(' + (Math.cos(a) * d) + 'px,' + (Math.sin(a) * d) + 'px) rotate(' + (Math.random() * 180) + 'deg)';
                        b.style.opacity = '0';
                    };
                }(bit, angle, dist));
                setTimeout(function (b) { return function () { b.remove(); }; }(bit), 750);
            }
        }

        var sayHi = document.getElementById('sayHiBtn');
        if (sayHi) {
            sayHi.addEventListener('click', function () {
                var r = sayHi.getBoundingClientRect();
                burstConfettiAt(r.left + r.width / 2, r.top + r.height / 2);
            });
        }

        /* toast helper */
        var toastEl = document.getElementById('toast');
        var toastMsgEl = document.getElementById('toastMsg');
        var toastTimer = null;
        function showToast(msg) {
            if (!toastEl || !toastMsgEl) return;
            toastMsgEl.textContent = msg;
            toastEl.classList.add('show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
        }

        /* click-to-copy email */
        var emailPill = document.getElementById('emailPill');
        if (emailPill) {
            emailPill.addEventListener('click', function (e) {
                var email = emailPill.getAttribute('data-email');
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    e.preventDefault();
                    navigator.clipboard.writeText(email).then(function () {
                        showToast('Copied ' + email);
                    }).catch(function () {
                        window.location.href = 'mailto:' + email;
                    });
                }
            });
        }

        /* easter egg */
        var brandBadge = document.getElementById('brandBadge');
        var badgeClicks = 0;
        var badgeClickReset = null;
        var eggMessages = ['keep going...', 'almost there...', 'one more...'];
        if (brandBadge) {
            brandBadge.addEventListener('click', function () {
                badgeClicks++;
                clearTimeout(badgeClickReset);
                badgeClickReset = setTimeout(function () { badgeClicks = 0; }, 1400);
                if (badgeClicks >= 2 && badgeClicks <= 4) {
                    showToast(eggMessages[badgeClicks - 2]);
                } else if (badgeClicks >= 5) {
                    var r = brandBadge.getBoundingClientRect();
                    burstConfettiAt(r.left + r.width / 2, r.top + r.height / 2, 22);
                    showToast('you found it \u2728');
                    badgeClicks = 0;
                }
            });
        }

        /* carousel helper */
        function makeCarousel(imgEls, dotEls, intervalMs, onDotClick) {
            var idx = 0;
            var timer = null;
            function show(i) {
                idx = i;
                imgEls.forEach(function (el, n) { el.classList.toggle('active', n === i); });
                dotEls.forEach(function (el, n) { el.classList.toggle('active', n === i); });
            }
            function next() { show((idx + 1) % imgEls.length); }
            function start() {
                stop();
                if (reduceMotion || imgEls.length < 2) return;
                timer = setInterval(next, intervalMs);
            }
            function stop() {
                if (timer) { clearInterval(timer); timer = null; }
            }
            
            // Set up dot click listeners if provided
            if (onDotClick) {
                dotEls.forEach(function (dot, i) {
                    dot.addEventListener('click', function () {
                        show(i);
                        onDotClick();
                    });
                });
            }
            
            show(0);
            return { start: start, stop: stop, show: show };
        }

        /* gallery tilt + per-tile image carousel */
        var tiles = document.querySelectorAll('.tile');
        var tileCarousels = [];
        tiles.forEach(function (tile) {
            var imgEls = Array.prototype.slice.call(tile.querySelectorAll('.tile-img'));
            var dotEls = Array.prototype.slice.call(tile.querySelectorAll('.tile-dot'));
            if (imgEls.length) {
                var carousel = makeCarousel(imgEls, dotEls, 2600 + Math.random() * 900);
                carousel.start();
                tileCarousels.push({ tile: tile, carousel: carousel });
                tile.addEventListener('mouseenter', carousel.stop);
                tile.addEventListener('mouseleave', carousel.start);
                tile.addEventListener('focus', carousel.stop);
                tile.addEventListener('blur', carousel.start);
            }
            if (!reduceMotion) {
                tile.addEventListener('mousemove', function (e) {
                    var r = tile.getBoundingClientRect();
                    var x = (e.clientX - r.left) / r.width - 0.5;
                    var y = (e.clientY - r.top) / r.height - 0.5;
                    tile.style.transition = 'none'; // prevent lag during move
                    tile.style.transform = 'perspective(600px) rotateY(' + (x * 10) + 'deg) rotateX(' + (y * -10) + 'deg) scale(1.02)';
                });
                tile.addEventListener('mouseleave', function () {
                    tile.style.transition = 'transform 0.5s var(--ease)'; // smooth return to upright position
                    tile.style.transform = '';
                });
            }
        });

        /* ====== gallery lightbox — cinematic version ====== */
        var lightbox = document.getElementById('lightbox');
        var lightboxCard = document.getElementById('lightboxCard');
        var lightboxCategoryEl = document.getElementById('lightboxCategory');
        var lightboxTitle = document.getElementById('lightboxTitle');
        var lightboxDesc = document.getElementById('lightboxDesc');
        var lightboxImgsEl = document.getElementById('lightboxImgs');
        var lightboxDotsEl = document.getElementById('lightboxDots');
        var lightboxCounterEl = document.getElementById('lightboxCounter');
        var lightboxCloseBtn = document.getElementById('lightboxClose');
        var lightboxPrevBtn = document.getElementById('lightboxPrev');
        var lightboxNextBtn = document.getElementById('lightboxNext');
        var lastFocusedTile = null;
        var lbImgs = [];
        var lbDots = [];
        var lbIdx = 0;
        var lbAutoTimer = null;
        var lbTransitioning = false;

        function lbUpdateCounter() {
            if (lightboxCounterEl) {
                lightboxCounterEl.textContent = (lbIdx + 1) + ' / ' + lbImgs.length;
                lightboxCounterEl.style.display = lbImgs.length <= 1 ? 'none' : '';
            }
            if (lightboxPrevBtn) lightboxPrevBtn.style.display = lbImgs.length <= 1 ? 'none' : '';
            if (lightboxNextBtn) lightboxNextBtn.style.display = lbImgs.length <= 1 ? 'none' : '';
        }

        function lbGoTo(newIdx, direction) {
            if (lbTransitioning || newIdx === lbIdx || lbImgs.length < 2) return;
            lbTransitioning = true;
            var dir = direction || (newIdx > lbIdx ? 1 : -1);
            var outClass = dir > 0 ? 'slide-out-left' : 'slide-out-right';
            var inClass  = dir > 0 ? 'slide-in-right' : 'slide-in-left';
            var oldImg = lbImgs[lbIdx];
            var newImg = lbImgs[newIdx];
            var oldDot = lbDots[lbIdx];
            var newDot = lbDots[newIdx];

            // Set incoming image off-screen
            newImg.className = 'lightbox-img ' + inClass;
            // Force reflow
            void newImg.offsetWidth;

            // Transition both
            oldImg.className = 'lightbox-img active ' + outClass;
            newImg.className = 'lightbox-img active';

            if (oldDot) oldDot.classList.remove('active');
            if (newDot) newDot.classList.add('active');

            lbIdx = newIdx;
            lbUpdateCounter();

            setTimeout(function() {
                oldImg.className = 'lightbox-img';
                lbTransitioning = false;
            }, reduceMotion ? 0 : 750);
        }

        function lbNext() {
            lbGoTo((lbIdx + 1) % lbImgs.length, 1);
        }
        function lbPrev() {
            lbGoTo((lbIdx - 1 + lbImgs.length) % lbImgs.length, -1);
        }

        function lbStartAuto() {
            lbStopAuto();
            if (!reduceMotion && lbImgs.length > 1) {
                lbAutoTimer = setInterval(lbNext, 3200);
            }
        }
        function lbStopAuto() {
            if (lbAutoTimer) { clearInterval(lbAutoTimer); lbAutoTimer = null; }
        }

        function openLightbox(tile) {
            var sourceImgs = tile.querySelectorAll('.tile-img');
            // Keep arrows/counter in lightboxImgsEl — remove only old images
            var oldImgEls = lightboxImgsEl.querySelectorAll('.lightbox-img');
            oldImgEls.forEach(function(el) { el.remove(); });
            lightboxDotsEl.innerHTML = '';
            lbImgs = []; lbDots = []; lbIdx = 0; lbTransitioning = false;

            sourceImgs.forEach(function(img, i) {
                var clone = document.createElement('img');
                clone.src = img.src;
                clone.alt = img.alt || '';
                clone.draggable = false;
                clone.className = 'lightbox-img' + (i === 0 ? ' active' : '');
                // Insert before the arrows
                lightboxImgsEl.insertBefore(clone, lightboxPrevBtn);
                lbImgs.push(clone);

                var dot = document.createElement('span');
                dot.className = 'lightbox-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('role', 'button');
                dot.setAttribute('tabindex', '0');
                dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
                (function(idx) {
                    dot.addEventListener('click', function() {
                        lbStopAuto();
                        lbGoTo(idx, idx > lbIdx ? 1 : -1);
                        lbStartAuto();
                    });
                    dot.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            lbStopAuto();
                            lbGoTo(idx, idx > lbIdx ? 1 : -1);
                            lbStartAuto();
                        }
                    });
                }(i));
                lightboxDotsEl.appendChild(dot);
                lbDots.push(dot);
            });

            if (lightboxCategoryEl) lightboxCategoryEl.textContent = tile.getAttribute('data-category') || '';
            lightboxTitle.textContent = tile.getAttribute('data-title') || '';
            lightboxDesc.textContent = tile.getAttribute('data-desc') || '';
            lbUpdateCounter();

            lightbox.classList.add('open');
            document.body.classList.add('modal-open');
            lastFocusedTile = tile;
            if (lightboxCloseBtn) lightboxCloseBtn.focus();

            tileCarousels.forEach(function(entry) { entry.carousel.stop(); });
            lbStartAuto();
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.classList.remove('modal-open');
            lbStopAuto();
            tileCarousels.forEach(function(entry) {
                if (!entry.tile.matches(':hover')) entry.carousel.start();
            });
            if (lastFocusedTile) lastFocusedTile.focus();
        }

        // Arrow buttons
        if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            lbStopAuto(); lbPrev(); lbStartAuto();
        });
        if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            lbStopAuto(); lbNext(); lbStartAuto();
        });

        // Pause auto on hover
        if (lightboxImgsEl) {
            lightboxImgsEl.addEventListener('mouseenter', lbStopAuto);
            lightboxImgsEl.addEventListener('mouseleave', lbStartAuto);
        }

        // Touch/swipe support
        var lbTouchStartX = 0;
        if (lightboxImgsEl) {
            lightboxImgsEl.addEventListener('touchstart', function(e) {
                lbTouchStartX = e.touches[0].clientX;
            }, { passive: true });
            lightboxImgsEl.addEventListener('touchend', function(e) {
                var dx = e.changedTouches[0].clientX - lbTouchStartX;
                if (Math.abs(dx) > 40) {
                    lbStopAuto();
                    if (dx < 0) lbNext(); else lbPrev();
                    lbStartAuto();
                }
            }, { passive: true });
        }

        // Keyboard: arrows when lightbox is open
        document.addEventListener('keydown', function(e) {
            if (!lightbox || !lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') { closeLightbox(); return; }
            if (e.key === 'ArrowRight') { lbStopAuto(); lbNext(); lbStartAuto(); }
            if (e.key === 'ArrowLeft')  { lbStopAuto(); lbPrev(); lbStartAuto(); }
        });

        // Tile click + keyboard open
        tiles.forEach(function(tile) {
            tile.addEventListener('click', function() { openLightbox(tile); });
            tile.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(tile);
                }
            });
        });

        if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) closeLightbox();
            });
        }

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

        /* ====== CUSTOM MAGNETIC CURSOR ====== */
        (function() {
            var dot = document.getElementById('cursorDot');
            var ring = document.getElementById('cursorRing');
            if (!dot || !ring) return;
            // Only activate on non-touch pointer devices
            if (!window.matchMedia('(pointer: fine)').matches) {
                dot.style.display = 'none';
                ring.style.display = 'none';
                return;
            }

            var mx = -100, my = -100;  // mouse
            var rx = -100, ry = -100;  // ring (lagged)
            var raf = null;

            function lerp(a, b, t) { return a + (b - a) * t; }

            function tick() {
                rx = lerp(rx, mx, 0.12);
                ry = lerp(ry, my, 0.12);
                dot.style.left = mx + 'px';
                dot.style.top  = my + 'px';
                ring.style.left = rx + 'px';
                ring.style.top  = ry + 'px';
                raf = requestAnimationFrame(tick);
            }

            document.addEventListener('mousemove', function(e) {
                mx = e.clientX;
                my = e.clientY;
                if (!raf) raf = requestAnimationFrame(tick);
            });

            document.addEventListener('mouseleave', function() {
                dot.style.opacity = '0';
                ring.style.opacity = '0';
            });
            document.addEventListener('mouseenter', function() {
                dot.style.opacity = '';
                ring.style.opacity = '';
            });

            // Hover state: grow ring on interactive elements
            var hoverTargets = 'a, button, [role="button"], .tile, .project-card, .tech-card, .now-card, .interest-card';
            document.addEventListener('mouseover', function(e) {
                if (e.target.closest(hoverTargets)) {
                    dot.classList.add('cursor-hover');
                    ring.classList.add('cursor-hover');
                    dot.classList.remove('cursor-text');
                    ring.classList.remove('cursor-text');
                }
            });
            document.addEventListener('mouseout', function(e) {
                if (e.target.closest(hoverTargets)) {
                    dot.classList.remove('cursor-hover');
                    ring.classList.remove('cursor-hover');
                }
            });
        })();

        /* ====== CIRCULAR THEME TOGGLE ANIMATION ====== */
        (function() {
            var themeToggle = document.getElementById('themeToggle');
            var overlay = document.getElementById('themeOverlay');
            if (!themeToggle || !overlay) return;

            // Remove the old simple toggle listener (re-attach with animation)
            // We need to replace the default theme script's listener.
            // The theme initialization already ran, so we just augment the click.
            themeToggle.addEventListener('click', function(e) {
                if (reduceMotion) return; // skip animation if user prefers reduced motion

                var rect = themeToggle.getBoundingClientRect();
                var ox = (rect.left + rect.width / 2) / window.innerWidth * 100 + '%';
                var oy = (rect.top + rect.height / 2) / window.innerHeight * 100 + '%';
                overlay.style.setProperty('--ox', ox);
                overlay.style.setProperty('--oy', oy);

                // Snapshot the target theme (theme script listener ran first, already switched)
                var newTheme = document.documentElement.getAttribute('data-theme');
                overlay.style.background = newTheme === 'dark' ? '#0A140F' : '#FBFFF6';

                overlay.classList.remove('expanding');
                void overlay.offsetWidth; // reflow
                overlay.classList.add('expanding');

                var done = function() {
                    overlay.classList.remove('expanding');
                    overlay.removeEventListener('transitionend', done);
                };
                overlay.addEventListener('transitionend', done);
            }, true); // capture phase so this runs AFTER the first listener switches the theme
        })();

        /* ====== PROJECT MODAL ====== */
        (function() {
            var overlay = document.getElementById('projectModalOverlay');
            var closeBtn = document.getElementById('projectModalClose');
            var pImg = document.getElementById('pModalImg');
            var pTitle = document.getElementById('pModalTitle');
            var pDesc = document.getElementById('pModalDesc');
            var pTags = document.getElementById('pModalTags');
            var pLinks = document.getElementById('pModalLinks');
            if (!overlay) return;

            var lastFocused = null;

            function openProjectModal(card) {
                pImg.src = card.getAttribute('data-img') || '';
                pImg.alt = card.getAttribute('data-title') || '';
                pTitle.textContent = card.getAttribute('data-title') || '';
                pDesc.textContent = card.getAttribute('data-desc') || '';

                // Tags
                pTags.innerHTML = '';
                var tags = (card.getAttribute('data-tags') || '').split(',');
                tags.forEach(function(tag) {
                    if (!tag.trim()) return;
                    var s = document.createElement('span');
                    s.className = 'project-tag';
                    s.textContent = tag.trim();
                    pTags.appendChild(s);
                });

                // Links
                pLinks.innerHTML = '';
                var gh = card.getAttribute('data-github');
                var live = card.getAttribute('data-live');
                if (gh && gh !== '#') {
                    pLinks.innerHTML += '<a href="' + gh + '" class="project-link" target="_blank" rel="noopener"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.17c-3.2.7-3.87-1.34-3.87-1.34-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.7.42.36.78 1.07.78 2.16v3.2c0 .31.21.65.79.55A10.52 10.52 0 0023.5 12c0-6.27-5.23-11.5-11.5-11.5z"/></svg> GitHub →</a>';
                }
                if (live && live !== '#') {
                    pLinks.innerHTML += '<a href="' + live + '" class="project-link" target="_blank" rel="noopener"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg> Live Demo →</a>';
                }

                overlay.classList.add('open');
                document.body.classList.add('modal-open');
                lastFocused = document.activeElement;
                if (closeBtn) closeBtn.focus();
            }

            function closeProjectModal() {
                overlay.classList.remove('open');
                document.body.classList.remove('modal-open');
                if (lastFocused) lastFocused.focus();
            }

            // Attach click to all project cards
            document.querySelectorAll('.project-card').forEach(function(card) {
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.addEventListener('click', function() { openProjectModal(card); });
                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProjectModal(card); }
                });
            });

            if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) closeProjectModal();
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.classList.contains('open')) closeProjectModal();
            });
        })();

        /* ====== TECH CARD SKILL BAR REVEAL ====== */
        (function() {
            var techCards = document.querySelectorAll('.tech-card');
            if (!techCards.length) return;
            var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            techCards.forEach(function(card) { obs.observe(card); });
        })();

        /* ====== PHASE 2: SOUND ENGINE + ACHIEVEMENTS + UNLOCKABLE THEMES ====== */
        (function() {

            /* --- Sound Engine (Web Audio API, no files needed) --- */
            var audioCtx = null;
            var gameMuted = (localStorage.getItem('gameMuted') === 'true');

            function getAudioCtx() {
                if (!audioCtx) {
                    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
                }
                return audioCtx;
            }

            function playTone(freq, type, duration, volume, delay) {
                if (gameMuted) return;
                var ctx = getAudioCtx();
                if (!ctx) return;
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = type || 'square';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + (delay || 0));
                gain.gain.setValueAtTime(volume || 0.15, ctx.currentTime + (delay || 0));
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (delay || 0) + duration);
                osc.start(ctx.currentTime + (delay || 0));
                osc.stop(ctx.currentTime + (delay || 0) + duration);
            }

            // Named sound effects
            window.sfx = {
                chaiCatch: function() {
                    playTone(523, 'square', 0.08, 0.13);    // C5
                    playTone(659, 'square', 0.08, 0.13, 0.08); // E5
                    playTone(784, 'square', 0.12, 0.13, 0.16); // G5
                },
                bugHit: function() {
                    playTone(220, 'sawtooth', 0.06, 0.14);
                    playTone(180, 'sawtooth', 0.08, 0.14, 0.06);
                    playTone(140, 'sawtooth', 0.10, 0.12, 0.12);
                },
                gameOver: function() {
                    playTone(392, 'square', 0.15, 0.15);      // G4
                    playTone(349, 'square', 0.15, 0.15, 0.18); // F4
                    playTone(311, 'square', 0.15, 0.15, 0.36); // Eb4
                    playTone(261, 'square', 0.35, 0.14, 0.54); // C4
                },
                goalScored: function() {
                    playTone(523, 'square', 0.07, 0.14);
                    playTone(659, 'square', 0.07, 0.14, 0.07);
                    playTone(784, 'square', 0.07, 0.14, 0.14);
                    playTone(1046,'square', 0.18, 0.13, 0.21);
                },
                goalSaved: function() {
                    playTone(262, 'sawtooth', 0.1, 0.14);
                    playTone(233, 'sawtooth', 0.15, 0.13, 0.1);
                },
                achievementUnlocked: function() {
                    [523, 659, 784, 1046, 1318].forEach(function(f, i) {
                        playTone(f, 'sine', 0.12, 0.12, i * 0.07);
                    });
                }
            };

            /* --- Mute Button --- */
            var muteBtn = document.getElementById('gameMuteBtn');
            function updateMuteBtn() {
                if (!muteBtn) return;
                muteBtn.classList.toggle('muted', gameMuted);
                muteBtn.querySelector('.mute-icon-on + svg, .mute-icon-on ~ *') ;
                muteBtn.childNodes.forEach(function(n) {
                    if (n.nodeType === 3) n.textContent = gameMuted ? ' Sound Off' : ' Sound On';
                });
            }
            if (muteBtn) {
                updateMuteBtn();
                muteBtn.addEventListener('click', function() {
                    gameMuted = !gameMuted;
                    localStorage.setItem('gameMuted', gameMuted);
                    updateMuteBtn();
                    // Resume audio context on first interaction if suspended
                    var ctx = getAudioCtx();
                    if (ctx && ctx.state === 'suspended') ctx.resume();
                });
            }

            /* --- Achievement System --- */
            var achievements = {
                chai10:  { id:'chai10',  title:'Rookie Sipper',    desc:'Score 10 in Catch the Chai',   icon:'<i class="fa-solid fa-mug-hot"></i>', unlocks: null },
                chai25:  { id:'chai25',  title:'Chai Champion',     desc:'Score 25 in Catch the Chai',   icon:'<i class="fa-solid fa-trophy"></i>', unlocks: 'retro' },
                penalty5:{ id:'penalty5',title:'Hat Trick Hero',    desc:'Score 5 goals in Penalty',      icon:'<i class="fa-solid fa-futbol"></i>', unlocks: null },
                penalty10:{id:'penalty10',title:'Penalty Master',   desc:'Score 10 goals in Penalty',     icon:'<i class="fa-solid fa-fire"></i>', unlocks: 'cyberpunk' }
            };

            var unlockedAch = JSON.parse(localStorage.getItem('achievements') || '{}');
            var unlockedThemes = JSON.parse(localStorage.getItem('unlockedThemes') || '["default"]');

            var achBanner = document.getElementById('achievementBanner');
            var achTimeout = null;

            function showAchievement(ach) {
                if (unlockedAch[ach.id]) return; // already shown
                unlockedAch[ach.id] = true;
                localStorage.setItem('achievements', JSON.stringify(unlockedAch));
                if (window.sfx) window.sfx.achievementUnlocked();

                // Unlock theme if applicable
                if (ach.unlocks && unlockedThemes.indexOf(ach.unlocks) === -1) {
                    unlockedThemes.push(ach.unlocks);
                    localStorage.setItem('unlockedThemes', JSON.stringify(unlockedThemes));
                    renderThemeButtons();
                }

                if (!achBanner) return;
                achBanner.innerHTML = '<span class="ach-icon">' + ach.icon + '</span>' +
                    '<div><div class="ach-title">Achievement Unlocked!</div>' +
                    '<div>' + ach.title + ' — ' + ach.desc + (ach.unlocks ? ' <i class="fa-solid fa-palette"></i> Theme unlocked!' : '') + '</div></div>';
                achBanner.classList.remove('show');
                void achBanner.offsetWidth;
                achBanner.classList.add('show');
                clearTimeout(achTimeout);
                achTimeout = setTimeout(function() { achBanner.classList.remove('show'); }, 5000);
            }

            // Expose to game loops
            window.checkChaiAchievements = function(score) {
                if (score >= 10) showAchievement(achievements.chai10);
                if (score >= 25) showAchievement(achievements.chai25);
            };
            window.checkPenaltyAchievements = function(score) {
                if (score >= 5)  showAchievement(achievements.penalty5);
                if (score >= 10) showAchievement(achievements.penalty10);
            };

            /* --- Unlockable Theme Buttons --- */
            var themeUnlockRow = document.getElementById('themeUnlockRow');
            var THEME_LABELS = { default: '<i class="fa-solid fa-leaf"></i> Default', dark: '<i class="fa-solid fa-moon"></i> Dark', retro: '<i class="fa-solid fa-terminal"></i> Retro Terminal', cyberpunk: '<i class="fa-solid fa-rocket"></i> Cyberpunk' };

            function renderThemeButtons() {
                if (!themeUnlockRow) return;
                themeUnlockRow.innerHTML = '';
                unlockedThemes.forEach(function(tid) {
                    var btn = document.createElement('button');
                    btn.className = 'theme-unlock-btn';
                    btn.setAttribute('data-theme-id', tid);
                    btn.textContent = THEME_LABELS[tid] || tid;
                    btn.addEventListener('click', function() {
                        var applyTheme = tid === 'default' ? 'light' : tid;
                        document.documentElement.setAttribute('data-theme', applyTheme);
                        localStorage.setItem('theme', applyTheme);
                    });
                    themeUnlockRow.appendChild(btn);
                });
            }
            renderThemeButtons();

        })();

        /* ====== PATCH GAME LOOPS WITH SOUND CALLS ====== */
        // We use a MutationObserver approach: watch score elements for changes
        // and fire sounds when score increments. This avoids touching the game IIFE closures.
        (function() {
            function watchScoreEl(elId, onIncrease, onDecrease) {
                var el = document.getElementById(elId);
                if (!el) return;
                var lastVal = parseInt(el.textContent || '0', 10);
                var obs = new MutationObserver(function() {
                    var newVal = parseInt(el.textContent || '0', 10);
                    if (newVal > lastVal && window.sfx) { onIncrease(newVal); }
                    if (newVal < lastVal && window.sfx && onDecrease) { onDecrease(newVal); }
                    lastVal = newVal;
                });
                obs.observe(el, { childList: true, characterData: true, subtree: true });
            }

            // Chai game
            watchScoreEl('gameScore', function(newScore) {
                if (window.sfx) window.sfx.chaiCatch();
                if (window.checkChaiAchievements) window.checkChaiAchievements(newScore);
            });
            watchScoreEl('gameScoreFull', function(newScore) {
                if (window.sfx) window.sfx.chaiCatch();
            });

            // Penalty game - goals
            watchScoreEl('penaltyScore', function(newScore) {
                if (window.sfx) window.sfx.goalScored();
                if (window.checkPenaltyAchievements) window.checkPenaltyAchievements(newScore);
            });
            watchScoreEl('penaltyScoreFull', function(newScore) {
                if (window.sfx) window.sfx.goalScored();
            });

            // Watch game-over overlay for 'Game over' text to play game-over sound
            function watchOverlayForGameOver(overlayId) {
                var el = document.getElementById(overlayId);
                if (!el) return;
                var mobs = new MutationObserver(function() {
                    if (el.textContent.indexOf('Game over') !== -1 || el.textContent.indexOf('SAVED') !== -1) {
                        if (el.textContent.indexOf('Game over') !== -1 && window.sfx) window.sfx.gameOver();
                        if (el.textContent.indexOf('SAVED') !== -1 && window.sfx) window.sfx.goalSaved();
                    }
                });
                mobs.observe(el, { childList: true, characterData: true, subtree: true });
            }
            watchOverlayForGameOver('gameOverlay');
            watchOverlayForGameOver('gameOverlayFull');
            watchOverlayForGameOver('penaltyResult');
            watchOverlayForGameOver('penaltyResultFull');
            // Bug hit — watch lives (heart elements for 'lost' class)
            var livesEl = document.getElementById('gameLives');
            if (livesEl) {
                var lostCount = 0;
                new MutationObserver(function() {
                    var newLost = livesEl.querySelectorAll('.life.lost').length;
                    if (newLost > lostCount && window.sfx) window.sfx.bugHit();
                    lostCount = newLost;
                }).observe(livesEl, { attributes: true, subtree: true, attributeFilter: ['class'] });
            }
        })();

        /* ====== PHASE 3: WIDGETS & GUESTBOOK ====== */
        (function() {
            /* --- Local Time Widget --- */
            var timeEl = document.getElementById('localTime');
            if (timeEl) {
                function updateTime() {
                    var now = new Date();
                    var timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                    timeEl.textContent = timeStr;
                }
                updateTime();
                setInterval(updateTime, 1000);
            }

            /* --- Realtime Weather & AQI Widget --- */
            function fetchWeather() {
                // Noida Coordinates: 28.5355, 77.3910
                
                // Fetch Weather (Celsius)
                fetch('https://api.open-meteo.com/v1/forecast?latitude=28.5355&longitude=77.3910&current_weather=true')
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.current_weather) {
                            var temp = Math.round(data.current_weather.temperature);
                            var code = data.current_weather.weathercode;
                            var icon = '<i class="fa-solid fa-sun"></i>'; // Default Clear
                            if (code >= 1 && code <= 3) icon = '<i class="fa-solid fa-cloud-sun"></i>'; // Cloudy
                            if (code >= 45 && code <= 48) icon = '<i class="fa-solid fa-smog"></i>'; // Fog
                            if (code >= 51 && code <= 67) icon = '<i class="fa-solid fa-cloud-rain"></i>'; // Rain
                            if (code >= 71 && code <= 77) icon = '<i class="fa-solid fa-snowflake"></i>'; // Snow
                            if (code >= 95 && code <= 99) icon = '<i class="fa-solid fa-cloud-bolt"></i>'; // Thunderstorm
                            
                            document.getElementById('weatherTemp').textContent = temp + '°C';
                            document.getElementById('weatherIcon').innerHTML = icon;
                        }
                    })
                    .catch(err => console.log('Weather API error:', err));
                
                // Fetch AQI (US AQI index)
                fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.5355&longitude=77.3910&current=us_aqi')
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.current && data.current.us_aqi) {
                            var aqi = data.current.us_aqi;
                            var aqiEmoji = '<i class="fa-solid fa-face-smile" style="color: #4ADE80;"></i>';
                            if (aqi > 50) aqiEmoji = '<i class="fa-solid fa-face-meh" style="color: #FACC15;"></i>';
                            if (aqi > 100) aqiEmoji = '<i class="fa-solid fa-face-frown" style="color: #F97316;"></i>';
                            if (aqi > 150) aqiEmoji = '<i class="fa-solid fa-face-dizzy" style="color: #EF4444;"></i>';
                            if (aqi > 200) aqiEmoji = '<i class="fa-solid fa-skull" style="color: #A855F7;"></i>';
                            if (aqi > 300) aqiEmoji = '<i class="fa-solid fa-skull-crossbones" style="color: #78350F;"></i>';
                            
                            document.getElementById('weatherAqi').innerHTML = 'AQI ' + aqi + ' ' + aqiEmoji;
                        }
                    })
                    .catch(err => console.log('AQI API error:', err));
            }
            fetchWeather();
            setInterval(fetchWeather, 600000); // Check every 10 minutes

            
            /* --- Guestbook (Supabase Integration) --- */
            var gbBoard = document.getElementById('guestbookBoard');
            var gbName = document.getElementById('gbName');
            var gbMessage = document.getElementById('gbMessage');
            var gbSubmit = document.getElementById('gbSubmit');

            var SUPABASE_URL = 'https://uocjyrybdcnhlnpfdcsz.supabase.co/rest/v1/guestbook_notes';
            var SUPABASE_KEY = 'sb_publishable_nk6XHTfB1goeHLmAqv5LHA_WQtf1J7E';

            if (gbBoard && gbSubmit) {
                var notes = [];

                function renderNotes() {
                    gbBoard.innerHTML = '';
                    if (notes.length === 0) {
                        gbBoard.innerHTML = '<p style="color:var(--ink-soft);width:100%">No notes yet. Be the first!</p>';
                        return;
                    }
                    notes.forEach(function(note) {
                        var div = document.createElement('div');
                        div.className = 'sticky-note';
                        var rot = (Math.random() * 6 - 3).toFixed(1);
                        div.style.transform = 'rotate(' + rot + 'deg)';
                        
                        var d = new Date(note.created_at);
                        var dateStr = d.toLocaleDateString();

                        var safeMsg = note.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        var safeName = (note.name || "Anonymous").replace(/</g, "&lt;").replace(/>/g, "&gt;");

                        div.innerHTML = '<div>' + safeMsg + '</div>' +
                                        '<div>' +
                                            '<div class="sticky-author">- ' + safeName + '</div>' +
                                            '<div class="sticky-date">' + dateStr + '</div>' +
                                        '</div>';
                        gbBoard.appendChild(div);
                    });
                }

                function fetchNotes() {
                    fetch(SUPABASE_URL + '?select=*&order=created_at.desc&limit=20', {
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': 'Bearer ' + SUPABASE_KEY
                        }
                    })
                    .then(function(response) { return response.json(); })
                    .then(function(data) {
                        if(Array.isArray(data)) {
                            notes = data;
                            renderNotes();
                        }
                    })
                    .catch(function(err) { console.error('Error fetching guestbook:', err); });
                }

                fetchNotes();

                gbSubmit.addEventListener('click', function() {
                    var msg = gbMessage.value.trim();
                    if (!msg) return;
                    var name = gbName.value.trim() || "Anonymous";

                    gbSubmit.disabled = true;
                    gbSubmit.textContent = 'Posting...';

                    fetch(SUPABASE_URL, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': 'Bearer ' + SUPABASE_KEY,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify({ name: name, message: msg })
                    })
                    .then(function(response) {
                        if (response.ok) {
                            gbMessage.value = '';
                            gbName.value = '';
                            if (window.showToast) window.showToast('Note posted!');
                            fetchNotes(); // Reload notes from DB
                        } else {
                            if (window.showToast) window.showToast('Error posting note.');
                        }
                    })
                    .catch(function(err) { console.error('Error posting note:', err); })
                    .finally(function() {
                        gbSubmit.disabled = false;
                        gbSubmit.textContent = 'Stick Note';
                    });
                });
            }
        })();

    </script>