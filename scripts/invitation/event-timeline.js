import { prefersReducedMotion } from '../core/motion.js';

function formatGapLabel(days) {
    if (days === 1) return 'يوم واحد بين الفرحتين';
    if (days === 2) return 'يومان بين الفرحتين';
    if (days >= 3 && days <= 10) return `${days} أيام بين الفرحتين`;
    return `${days} يومًا بين الفرحتين`;
}

export function initEventTimeline(eventsConfig) {
    const timeline = document.querySelector('.events-timeline');
    if (!timeline || !eventsConfig) return;

    const gapEl = timeline.querySelector('[data-timeline-gap]');
    if (gapEl && eventsConfig.daysBetween != null) {
        gapEl.textContent = formatGapLabel(eventsConfig.daysBetween);
    }

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
