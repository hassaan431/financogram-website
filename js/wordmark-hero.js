/**
 * Hassaan bin Jalil - Wordmark Hero Interactive & Parallax Script
 * "On scroll, the product moves slightly faster than the wordmark (parallax)."
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
                        const mobileScale = isMobile ? ' scale(0.88)' : '';
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupParallax);
    } else {
        setupParallax();
    }
})();
