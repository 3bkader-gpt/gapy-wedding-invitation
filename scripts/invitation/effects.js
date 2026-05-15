import { prefersReducedMotion } from '../core/motion.js';

export function createEffects({ confettiDuration, aosDuration }) {
    function initAOS() {
        if (typeof AOS === 'undefined') return;
        AOS.init({
            duration: aosDuration,
            once: true,
            offset: 40,
            easing: 'ease-out-cubic',
            disable: prefersReducedMotion()
        });
    }

    function runWelcomeConfetti() {
        if (prefersReducedMotion() || typeof confetti === 'undefined') return;

        const end = Date.now() + confettiDuration;
        const colors = ['#bd9a5f', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }

    return { initAOS, runWelcomeConfetti };
}
