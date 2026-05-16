import { prefersReducedMotion } from '../core/motion.js';

export function initEventTimeline(eventsConfig) {
    const timeline = document.querySelector('.events-timeline');
    if (!timeline || !eventsConfig) return;

    if (prefersReducedMotion()) {
        timeline.classList.add('is-complete');
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        timeline.classList.add('is-active');
                    });
                    observer.disconnect();
                }
            });
        },
        { threshold: 0.22, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(timeline);
}
