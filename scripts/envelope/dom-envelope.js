import { isFeatureEnabled } from './config-helpers.js';
import { prefersReducedMotion } from '../core/motion.js';

export function createDomEnvelope({
    wrapper,
    sealEl,
    envelopeConfig,
    coupleDisplay,
    sealLetter
}) {
    const timings = envelopeConfig.timings ?? {};
    let opened = false;

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function init() {
        const t = envelopeConfig.timings ?? {};
        const flapMs = typeof t.flapOpen === 'number' ? t.flapOpen : 1400;
        const cardDelayMs = typeof t.cardRevealDelay === 'number' ? t.cardRevealDelay : 320;
        const cardDurMs = typeof t.cardRevealDuration === 'number' ? t.cardRevealDuration : 2200;
        wrapper?.style.setProperty('--env-flap-ms', `${flapMs}ms`);
        wrapper?.style.setProperty('--env-card-delay-ms', `${cardDelayMs}ms`);
        wrapper?.style.setProperty('--env-card-duration-ms', `${cardDurMs}ms`);
        wrapper?.style.setProperty('--env-pocket-fade-ms', `${Math.round(flapMs * 0.35)}ms`);

        const computedLift =
            typeof t.cardLift === 'number'
                ? t.cardLift
                : Math.ceil(flapMs * 0.92 + cardDelayMs + cardDurMs + 250);
        if (wrapper) wrapper.dataset.openHoldMs = String(computedLift);

        if (sealLetter && sealEl) {
            sealEl.textContent = sealLetter;
        }
        const h2 = wrapper?.querySelector('.card-inside h2');
        if (h2 && coupleDisplay) {
            h2.textContent = coupleDisplay;
        }
        if (isFeatureEnabled(envelopeConfig, 'medium', 'smoothReveal')) {
            wrapper?.classList.add('is-smooth-reveal');
        }
    }

    function show() {
        wrapper?.classList.add('is-visible');
    }

    function hide() {
        wrapper?.classList.remove('is-visible');
    }

    async function playOpen({ shake = true } = {}) {
        if (opened || !wrapper) {
            return Promise.resolve();
        }
        opened = true;

        if (prefersReducedMotion()) {
            wrapper.classList.add('is-instant', 'is-open');
            return;
        }

        if (shake && isFeatureEnabled(envelopeConfig, 'medium', 'shake')) {
            wrapper.classList.add('is-shaking');
            await wait(timings.shake ?? 400);
            wrapper.classList.remove('is-shaking');
        }

        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        wrapper.classList.add('is-open');

        const holdMs =
            Number.parseInt(wrapper.dataset.openHoldMs || '', 10) ||
            (timings.cardLift ?? 4200);

        await wait(holdMs);
    }

    function dispose() {}

    return {
        init,
        show,
        hide,
        playOpen,
        setPointerParallax() {},
        resetParallax() {},
        resize() {},
        dispose,
        getCardElement: () => wrapper?.querySelector('.card-inside') ?? null,
        isVisible: () => wrapper?.classList.contains('is-visible')
    };
}
