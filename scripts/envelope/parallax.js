import { isFeatureEnabled } from './config-helpers.js';
import { isTouchDevice } from '../core/motion.js';

export function createParallax(envelopeConfig, reducedMotion, envelopeEl, sceneEl) {
    if (
        reducedMotion ||
        isTouchDevice() ||
        !isFeatureEnabled(envelopeConfig, 'advanced', 'parallax') ||
        !envelopeEl ||
        !sceneEl
    ) {
        return { enable: () => {}, disable: () => {} };
    }

    let active = false;
    let opened = false;

    function onMove(e) {
        if (!active || opened) return;
        const rect = sceneEl.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotY = x * 14;
        const rotX = -y * 10;
        envelopeEl.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    function enable() {
        active = true;
        envelopeEl.style.transition = 'transform 150ms ease-out';
        sceneEl.addEventListener('mousemove', onMove);
    }

    function disable() {
        active = false;
        opened = true;
        sceneEl.removeEventListener('mousemove', onMove);
        envelopeEl.style.transform = '';
        envelopeEl.style.transition = '';
    }

    return { enable, disable };
}
