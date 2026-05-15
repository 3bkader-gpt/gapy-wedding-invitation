import { applyReducedMotionClass, prefersReducedMotion } from '../core/motion.js';
import { isFeatureEnabled } from './config-helpers.js';
import { createAnimationController } from './animation-controller.js';
import { createParticleSystem } from './particle-system.js';
import { createSceneUI } from './scene-ui.js';
import { createDomEnvelope } from './dom-envelope.js';

export function createEnvelopeController({ envelopeConfig, couple, events, onComplete }) {
    const scene = document.getElementById('envelope-scene');
    const seal = document.getElementById('wax-seal');
    const invitationApp = document.getElementById('invitation-app');
    const canvasHost = document.getElementById('envelope-canvas-host');
    const canvas = document.getElementById('envelope-canvas');
    const cardAnchor = document.getElementById('envelope-card-anchor');
    const domRoot = document.getElementById('envelope-dom-root');
    const domWrapper = document.getElementById('envelope-wrapper');
    const stage = document.querySelector('.envelope-stage');

    const renderer = envelopeConfig.renderer === 'dom' ? 'dom' : 'three';

    if (!scene || !seal || !invitationApp) {
        onComplete();
        return { start: onComplete };
    }

    if (renderer === 'three' && (!canvasHost || !canvas)) {
        onComplete();
        return { start: onComplete };
    }

    if (renderer === 'dom' && !domWrapper) {
        onComplete();
        return { start: onComplete };
    }

    const reducedMotion = prefersReducedMotion();
    applyReducedMotionClass(scene);
    applyFeatureClasses(scene, envelopeConfig);

    const particleSystem = createParticleSystem(envelopeConfig, reducedMotion);
    const sceneUI = createSceneUI(envelopeConfig);

    const coupleDisplay = couple?.display ?? 'نــدا & أحمــد';
    const sealLetter = couple?.sealLetter ?? 'ن';

    function placeSealForRenderer() {
        if (renderer === 'three' && stage) {
            seal.classList.add('wax-seal--overlay');
            stage.insertAdjacentElement('afterend', seal);
        } else if (renderer === 'dom' && domWrapper) {
            seal.classList.remove('wax-seal--overlay');
            if (!domWrapper.contains(seal)) {
                domWrapper.appendChild(seal);
            }
        }
    }

    let envelopeAnimator;

    if (renderer === 'dom') {
        scene.classList.add('renderer-dom');
        envelopeAnimator = createDomEnvelope({
            wrapper: domWrapper,
            sealEl: seal,
            envelopeConfig,
            coupleDisplay,
            sealLetter
        });
    } else {
        scene.classList.add('renderer-three');
        envelopeAnimator = null;
    }

    if (renderer === 'dom' && !envelopeAnimator) {
        onComplete();
        return { start: onComplete };
    }

    let parallaxActive = false;

    function onPointerMove(e) {
        if (!parallaxActive || !isFeatureEnabled(envelopeConfig, 'advanced', 'parallax')) return;
        envelopeAnimator?.setPointerParallax?.(e.clientX, e.clientY);
    }

    function enableParallax() {
        if (
            renderer !== 'three' ||
            reducedMotion ||
            !isFeatureEnabled(envelopeConfig, 'advanced', 'parallax')
        ) {
            return;
        }
        parallaxActive = true;
        scene.addEventListener('mousemove', onPointerMove);
    }

    function disableParallax() {
        parallaxActive = false;
        scene.removeEventListener('mousemove', onPointerMove);
        envelopeAnimator?.resetParallax?.();
    }

    document.body.classList.add('envelope-active');

    async function start() {
        placeSealForRenderer();

        if (renderer === 'three') {
            scene.classList.remove('renderer-dom');
            domRoot?.setAttribute('aria-hidden', 'true');
            canvasHost?.removeAttribute('aria-hidden');
        } else {
            scene.classList.remove('renderer-three');
            canvasHost?.setAttribute('aria-hidden', 'true');
            domRoot?.removeAttribute('aria-hidden');
        }

        if (renderer === 'three') {
            try {
                const { createThreeEnvelope } = await import('./three-envelope.js');
                envelopeAnimator = createThreeEnvelope({
                    host: canvasHost,
                    canvas,
                    sealEl: seal,
                    cardAnchor,
                    couple: coupleDisplay,
                    sealLetter,
                    reducedMotion,
                    onSealScreenPosition(x, y) {
                        seal.style.left = `${x}px`;
                        seal.style.top = `${y}px`;
                    }
                });
            } catch (err) {
                console.warn(
                    '[envelope] Failed to load 3D renderer (Three.js). Showing invitation.',
                    err
                );
                document.body.classList.remove('envelope-active');
                scene.classList.add('is-removed');
                invitationApp?.classList.add('is-visible');
                onComplete();
                return;
            }
        }

        if (!envelopeAnimator) {
            document.body.classList.remove('envelope-active');
            scene?.classList.add('is-removed');
            invitationApp?.classList.add('is-visible');
            onComplete();
            return;
        }

        const animationController = createAnimationController({
            envelopeConfig,
            particleSystem,
            parallax: { enable: enableParallax, disable: disableParallax },
            sceneUI,
            threeEnvelope: envelopeAnimator,
            onComplete
        });

        await envelopeAnimator.init();

        await sceneUI.runIntro();
        envelopeAnimator.show();

        if (renderer === 'three') {
            canvasHost.removeAttribute('aria-hidden');
            seal.classList.add('is-visible');
        }

        enableParallax();
        animationController.bindSeal();

        const onResize = () => envelopeAnimator.resize?.();
        window.addEventListener('resize', onResize);
    }

    return { start };
}

function applyFeatureClasses(scene, envelopeConfig) {
    const toggles = [
        ['quick', 'patterns', 'no-patterns'],
        ['quick', 'shimmer', 'no-shimmer'],
        ['quick', 'texture', 'no-texture'],
        ['quick', 'shadows', 'no-shadows'],
        ['medium', 'ribbon', 'no-ribbon'],
        ['medium', 'flowers', 'no-flowers'],
        ['advanced', 'hoverEffect', 'no-hover']
    ];

    for (const [phase, feature, className] of toggles) {
        if (!isFeatureEnabled(envelopeConfig, phase, feature)) {
            scene.classList.add(className);
        }
    }
}
