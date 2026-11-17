/**
 * Hassaan bin Jalil - Wordmark Hero Interactive & Parallax Script
 * - Interactive 3D Card Stack (Option A): touch swipe, drag, arrows, dots, wheel, keyboard
 * - Hero Wordmark & Product Parallax on scroll
 */

(function initWordmarkHero() {
    function setupParallax() {
        const heroSection = document.querySelector('.hero-wordmark-section');
        const wordmarkContainer = document.querySelector('.hero-wordmark-container');
        const productLayer = document.querySelector('.hero-product-layer');

        if (!heroSection || !wordmarkContainer || !productLayer) return;

        // Respect reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        let ticking = false;

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                    const heroHeight = heroSection.offsetHeight || window.innerHeight;

                    if (scrollY <= heroHeight * 1.5) {
                        const isMobile = window.innerWidth <= 768;
                        
                        // Parallax coefficients: product moves faster than wordmark
                        const wordmarkFactor = isMobile ? 0.12 : 0.16;
                        const productFactor = isMobile ? 0.28 : 0.38;

                        const wordmarkOffset = scrollY * wordmarkFactor;
                        const productOffset = scrollY * productFactor;

                        wordmarkContainer.style.transform = `translateY(calc(-50% + ${wordmarkOffset}px))`;
                        
                        // Maintain scale on mobile if set
                        const mobileScale = isMobile ? ' scale(0.92)' : '';
                        productLayer.style.transform = `translate(-50%, calc(-50% + ${productOffset}px))${mobileScale}`;
                    }

                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
    }

    function setupCardDeck() {
        const deck = document.getElementById('heroCardsDeck');
        if (!deck) return;

        // Prevent duplicate listener attachments
        if (deck.dataset.deckInitialized === 'true') return;
        deck.dataset.deckInitialized = 'true';

        const cards = Array.from(deck.querySelectorAll('.hero-card'));
        const prevBtn = document.querySelector('.deck-prev-btn');
        const nextBtn = document.querySelector('.deck-next-btn');
        const dots = Array.from(document.querySelectorAll('.deck-dot'));
        const total = cards.length;
        if (total === 0) return;

        let currentIndex = 0;

        function renderDeck(index) {
            currentIndex = (index % total + total) % total;

            cards.forEach((card, i) => {
                // Clear any state classes
                card.classList.remove(
                    'card-active',
                    'card-prev',
                    'card-next',
                    'card-far-left',
                    'card-far-right',
                    'card-hidden',
                    'card-left',
                    'card-center',
                    'card-right'
                );

                // Circular relative distance
                let diff = (i - currentIndex) % total;
                if (diff < 0) diff += total;
                if (diff > total / 2) diff -= total;

                if (diff === 0) {
                    card.classList.add('card-active');
                    card.setAttribute('aria-hidden', 'false');
                } else if (diff === -1) {
                    card.classList.add('card-prev');
                    card.setAttribute('aria-hidden', 'true');
                } else if (diff === 1) {
                    card.classList.add('card-next');
                    card.setAttribute('aria-hidden', 'true');
                } else if (diff === -2) {
                    card.classList.add('card-far-left');
                    card.setAttribute('aria-hidden', 'true');
                } else if (diff === 2) {
                    card.classList.add('card-far-right');
                    card.setAttribute('aria-hidden', 'true');
                } else {
                    card.classList.add('card-hidden');
                    card.setAttribute('aria-hidden', 'true');
                }
            });

            // Sync dot indicators
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-selected', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-selected', 'false');
                }
            });
        }

        function goTo(index) {
            renderDeck(index);
        }

        function next() {
            goTo(currentIndex + 1);
        }

        function prev() {
            goTo(currentIndex - 1);
        }

        // Prev & Next Button clicks
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prev();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                next();
            });
        }

        // Dot buttons click
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goTo(idx);
            });
        });

        // Tapping inactive peeked cards brings them to front
        cards.forEach((card, idx) => {
            card.addEventListener('click', (e) => {
                if (idx !== currentIndex) {
                    e.preventDefault();
                    e.stopPropagation();
                    goTo(idx);
                }
            });
        });

        // Touch swipe support (Mobile)
        let touchStartX = 0;
        let touchStartY = 0;
        let touchDeltaX = 0;
        let touchDeltaY = 0;
        let isTouching = false;

        deck.addEventListener('touchstart', (e) => {
            if (!e.touches || e.touches.length === 0) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchDeltaX = 0;
            touchDeltaY = 0;
            isTouching = true;
        }, { passive: true });

        deck.addEventListener('touchmove', (e) => {
            if (!isTouching || !e.touches || e.touches.length === 0) return;
            touchDeltaX = e.touches[0].clientX - touchStartX;
            touchDeltaY = e.touches[0].clientY - touchStartY;
        }, { passive: true });

        deck.addEventListener('touchend', () => {
            if (!isTouching) return;
            isTouching = false;
            // Dominant horizontal swipe threshold
            if (Math.abs(touchDeltaX) > 35 && Math.abs(touchDeltaX) > Math.abs(touchDeltaY)) {
                if (touchDeltaX < 0) {
                    next();
                } else {
                    prev();
                }
            }
        });

        // Desktop mouse drag support
        let mouseStartX = 0;
        let mouseDeltaX = 0;
        let isMouseDown = false;
        let hasMoved = false;

        deck.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            mouseDeltaX = 0;
            isMouseDown = true;
            hasMoved = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            mouseDeltaX = e.clientX - mouseStartX;
            if (Math.abs(mouseDeltaX) > 8) {
                hasMoved = true;
            }
        });

        window.addEventListener('mouseup', () => {
            if (!isMouseDown) return;
            isMouseDown = false;
            if (hasMoved && Math.abs(mouseDeltaX) > 40) {
                if (mouseDeltaX < 0) {
                    next();
                } else {
                    prev();
                }

                // Suppress accidental link click on active card after drag
                const preventClick = (evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    window.removeEventListener('click', preventClick, true);
                };
                window.addEventListener('click', preventClick, true);
            }
        });

        // Horizontal trackpad / wheel scroll support with debounce
        let wheelCooldown = false;
        deck.addEventListener('wheel', (e) => {
            const hDelta = Math.abs(e.deltaX) > 15 ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
            if (Math.abs(hDelta) > 15) {
                e.preventDefault();
                if (!wheelCooldown) {
                    wheelCooldown = true;
                    if (hDelta > 0) next();
                    else prev();
                    setTimeout(() => { wheelCooldown = false; }, 360);
                }
            }
        }, { passive: false });

        // Keyboard arrow navigation when hero section is in view
        window.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            const rect = deck.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (e.key === 'ArrowLeft') {
                    prev();
                } else if (e.key === 'ArrowRight') {
                    next();
                }
            }
        });

        // Initialize state
        renderDeck(0);
    }

    function init() {
        setupParallax();
        setupCardDeck();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Reinitialize on Swup navigation if active
    if (typeof window !== 'undefined') {
        window.addEventListener('popstate', init);
        document.addEventListener('swup:page:view', init);
    }
})();
