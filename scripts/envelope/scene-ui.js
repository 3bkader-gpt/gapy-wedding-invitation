import { isFeatureEnabled } from './config-helpers.js';
import { prefersReducedMotion } from '../core/motion.js';

export function createSceneUI(envelopeConfig) {
    const reducedMotion = prefersReducedMotion();
    const timings = envelopeConfig.timings || {};
    const loadingEl = document.getElementById('envelope-loading');
    const welcomeEl = document.getElementById('envelope-welcome');
    const envelopeWrap = document.getElementById('envelope-canvas-host');
    const domEnvelopeWrapper = document.getElementById('envelope-wrapper');
    const renderer = envelopeConfig.renderer === 'dom' ? 'dom' : 'three';
    const instructionEl = document.getElementById('envelope-instruction');
    const hintEl = document.querySelector('.envelope-hint');

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function show(el) {
        if (el) el.classList.add('is-visible');
    }

    function hide(el) {
        if (el) el.classList.remove('is-visible');
    }

    async function runLoadingPhase() {
        if (!isFeatureEnabled(envelopeConfig, 'advanced', 'loading') || !loadingEl) {
            return;
        }

        const start = Date.now();
        show(loadingEl);

        const elapsed = Date.now() - start;
        const min = timings.loadingMin ?? 500;
        if (elapsed < min) {
            await wait(min - elapsed);
        }

        hide(loadingEl);
    }

    async function runWelcomePhase() {
        if (!isFeatureEnabled(envelopeConfig, 'advanced', 'welcomeMessage') || !welcomeEl) {
            return;
        }

        welcomeEl.textContent = envelopeConfig.welcomeText || 'وصلتك دعوة...';

        if (reducedMotion) {
            show(welcomeEl);
            await wait(300);
            hide(welcomeEl);
            return;
        }

        show(welcomeEl);
        await wait(timings.welcomeFadeIn ?? 500);
        await wait(timings.welcomeDisplay ?? 2000);
        welcomeEl.classList.add('is-fading');
        await wait(500);
        hide(welcomeEl);
        welcomeEl.classList.remove('is-fading');
    }

    function revealEnvelope() {
        if (renderer === 'dom' && domEnvelopeWrapper) {
            domEnvelopeWrapper.classList.add('is-visible');
        } else if (envelopeWrap) {
            envelopeWrap.classList.add('is-visible');
        }
    }

    function showInstructions() {
        if (!isFeatureEnabled(envelopeConfig, 'advanced', 'instructions')) {
            if (hintEl) hintEl.classList.add('is-visible');
            return;
        }

        if (instructionEl) instructionEl.classList.add('is-visible');
        if (hintEl) hintEl.classList.add('is-visible');

        if (!reducedMotion) {
            setTimeout(() => {
                if (instructionEl) instructionEl.classList.remove('is-visible');
            }, timings.instructionHide ?? 3500);
        }
    }

    function hideInstructions() {
        if (instructionEl) instructionEl.classList.remove('is-visible');
        if (hintEl) hintEl.classList.remove('is-visible');
    }

    async function runIntro() {
        await runLoadingPhase();
        await runWelcomePhase();
        revealEnvelope();
        showInstructions();
    }

    return { runIntro, hideInstructions };
}
