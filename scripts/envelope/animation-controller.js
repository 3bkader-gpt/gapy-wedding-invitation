import { isFeatureEnabled } from './config-helpers.js';
import { prefersReducedMotion } from '../core/motion.js';
import { createEnvelopeRevealAudio } from './envelope-audio.js';

export function createAnimationController({
    envelopeConfig,
    particleSystem,
    parallax,
    sceneUI,
    threeEnvelope,
    onComplete
}) {
    const reducedMotion = prefersReducedMotion();
    const timings = envelopeConfig.timings || {};
    const audioCfg = envelopeConfig.audio;
    const envelopeRevealAudio =
        audioCfg?.enabled &&
        audioCfg.revealPart1 &&
        audioCfg.revealPart2
            ? createEnvelopeRevealAudio({
                  part1Url: audioCfg.revealPart1,
                  part2Url: audioCfg.revealPart2,
                  gapAfterPart1Ms: audioCfg.gapAfterPart1Ms ?? 1000
              })
            : null;

    const seal = document.getElementById('wax-seal');
    const scene = document.getElementById('envelope-scene');
    const invitationApp = document.getElementById('invitation-app');
    const cardAnchor = document.getElementById('envelope-card-anchor');

    let opened = false;

    function revealInvitation() {
        document.body.classList.remove('envelope-active');
        if (invitationApp) invitationApp.classList.add('is-visible');
        onComplete();
    }

    function hideScene() {
        const fadeMs = timings.fadeOut ?? 1500;
        scene?.classList.add('is-hidden');
        setTimeout(() => {
            scene?.classList.add('is-removed');
            threeEnvelope?.dispose();
            revealInvitation();
        }, fadeMs);
    }

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function openInstant() {
        if (opened) return;
        opened = true;
        envelopeRevealAudio?.startFromUserGesture();
        sceneUI?.hideInstructions();
        parallax?.disable();
        if (seal) {
            seal.disabled = true;
            seal.classList.add('is-melted');
        }
        await threeEnvelope?.playOpen({ shake: false });
        setTimeout(hideScene, 400);
    }

    async function openAnimated() {
        if (opened) return;
        opened = true;
        envelopeRevealAudio?.startFromUserGesture();
        sceneUI?.hideInstructions();
        parallax?.disable();

        if (seal) seal.disabled = true;

        if (isFeatureEnabled(envelopeConfig, 'medium', 'particles')) {
            particleSystem?.emitGoldenParticles(seal);
        }

        if (isFeatureEnabled(envelopeConfig, 'medium', 'sealMelt') && seal) {
            seal.classList.add('is-melting');
            await wait(timings.sealMelt ?? 700);
            seal.classList.remove('is-melting');
            seal.classList.add('is-melted');
        } else if (seal) {
            seal.classList.add('is-melted');
        }

        const shake = isFeatureEnabled(envelopeConfig, 'medium', 'shake');
        const openPromise = threeEnvelope?.playOpen({ shake }) ?? Promise.resolve();

        const cardLift = timings.cardLift ?? 2800;
        const confettiAt = Math.max(0, cardLift - 400);

        setTimeout(() => {
            if (isFeatureEnabled(envelopeConfig, 'advanced', 'confetti')) {
                const cardEl = threeEnvelope?.getCardElement?.() ?? cardAnchor;
                particleSystem?.burstConfetti(cardEl, timings.confettiDuration ?? 2500);
            }
        }, confettiAt);

        await openPromise;
        setTimeout(hideScene, 350);
    }

    function onSealClick() {
        if (reducedMotion) {
            openInstant();
        } else {
            openAnimated();
        }
    }

    function bindSeal() {
        if (!seal) return;
        seal.addEventListener('click', onSealClick);
        seal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSealClick();
            }
        });
    }

    return { bindSeal, openInstant, openAnimated };
}
