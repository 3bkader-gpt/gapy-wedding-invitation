import { isFeatureEnabled } from './config-helpers.js';

const CONFETTI_COLORS = ['#bd9a5f', '#ffffff', '#faf8f5', '#f8d7da'];

export function createParticleSystem(envelopeConfig, reducedMotion) {
    const scene = document.getElementById('envelope-scene');

    function emitGoldenParticles(originEl, count = 22) {
        if (reducedMotion || !isFeatureEnabled(envelopeConfig, 'medium', 'particles') || !scene || !originEl) {
            return;
        }

        const rect = originEl.getBoundingClientRect();
        const sceneRect = scene.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 - sceneRect.left;
        const cy = rect.top + rect.height / 2 - sceneRect.top;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'gold-particle';
            p.style.left = `${cx}px`;
            p.style.top = `${cy}px`;
            const angle = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 80;
            p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
            p.style.animationDuration = `${800 + Math.random() * 400}ms`;
            scene.appendChild(p);
            p.addEventListener('animationend', () => p.remove());
        }
    }

    function burstConfetti(cardEl, durationMs = 2500) {
        if (reducedMotion || !isFeatureEnabled(envelopeConfig, 'advanced', 'confetti')) {
            return;
        }

        if (typeof confetti === 'undefined' || !cardEl) {
            return;
        }

        const rect = cardEl.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        const end = Date.now() + durationMs;

        (function frame() {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 70,
                origin: { x, y },
                colors: CONFETTI_COLORS,
                gravity: 1.1,
                scalar: 0.9
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 70,
                origin: { x, y },
                colors: CONFETTI_COLORS,
                gravity: 1.1,
                scalar: 0.9
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }

    return { emitGoldenParticles, burstConfetti };
}
