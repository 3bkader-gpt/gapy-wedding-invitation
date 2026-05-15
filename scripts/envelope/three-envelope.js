import * as THREE from 'three';

const COLORS = {
    body: 0x3d4f5f,
    bodyLight: 0x4a5f72,
    flap: 0x2a3844,
    gold: 0xbd9a5f,
    goldLight: 0xd4af37,
    card: 0xfffefb,
    cardEdge: 0xe8dcc8
};

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - 2 ** (-10 * t);
}

function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - (-2 * t + 2) ** 4 / 2;
}

async function loadFonts() {
    if (!document.fonts?.load) return;
    await Promise.all([
        document.fonts.load('700 52px Amiri'),
        document.fonts.load('600 22px Cairo'),
        document.fonts.load('400 18px Cairo')
    ]).catch(() => {});
}

function createCardTexture({ couple, eyebrow, dates }) {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#fffefb';
    ctx.fillRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#f5f0e6');
    ctx.fillStyle = grad;
    ctx.fillRect(8, 8, w - 16, h - 16);

    ctx.strokeStyle = '#bd9a5f';
    ctx.lineWidth = 6;
    ctx.strokeRect(14, 14, w - 28, h - 28);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';

    ctx.fillStyle = 'rgba(189, 154, 95, 0.9)';
    ctx.font = '600 26px Cairo, sans-serif';
    ctx.fillText(eyebrow, w / 2, h * 0.28);

    ctx.fillStyle = '#bd9a5f';
    ctx.font = '700 72px Amiri, serif';
    ctx.fillText(couple, w / 2, h * 0.48);

    if (dates) {
        ctx.fillStyle = '#6b5a45';
        ctx.font = '600 28px Cairo, sans-serif';
        ctx.direction = 'ltr';
        ctx.fillText(dates, w / 2, h * 0.66);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
}

function createPaperMaterial(color, opts = {}) {
    return new THREE.MeshStandardMaterial({
        color,
        roughness: opts.roughness ?? 0.72,
        metalness: opts.metalness ?? 0.08,
        side: THREE.DoubleSide
    });
}

export function createThreeEnvelope({
    host,
    canvas,
    sealEl,
    cardAnchor,
    couple,
    sealLetter,
    reducedMotion,
    onSealScreenPosition
}) {
    if (!host || !canvas) {
        return null;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080c, 0.055);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.set(0, 0.05, 5.2);
    camera.lookAt(0, -0.05, 0);

    const cameraInitial = {
        position: new THREE.Vector3(0, 0.05, 5.2),
        lookAt: new THREE.Vector3(0, -0.05, 0),
        fov: 42
    };

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const ambient = new THREE.AmbientLight(0xfff5e6, 0.55);
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(2, 4, 5);
    const fill = new THREE.DirectionalLight(0x8fa4b8, 0.45);
    fill.position.set(-3, 1, 2);
    const rim = new THREE.PointLight(0xbd9a5f, 0.85, 12);
    rim.position.set(0, 2.5, 2);
    scene.add(ambient, key, fill, rim);

    const root = new THREE.Group();
    scene.add(root);

    const envelope = new THREE.Group();
    root.add(envelope);

    const W = 3.2;
    const H = 2.15;
    const flapH = 1.15;

    const back = new THREE.Mesh(
        new THREE.PlaneGeometry(W, H),
        createPaperMaterial(COLORS.body)
    );
    back.position.z = -0.02;
    envelope.add(back);

    const front = new THREE.Mesh(
        new THREE.PlaneGeometry(W, H * 0.58),
        createPaperMaterial(COLORS.bodyLight)
    );
    front.position.set(0, -H * 0.21, 0.03);
    envelope.add(front);

    const ribbon = new THREE.Mesh(
        new THREE.PlaneGeometry(W * 1.04, 0.14),
        new THREE.MeshStandardMaterial({
            color: COLORS.gold,
            roughness: 0.35,
            metalness: 0.65,
            emissive: 0x3d3010,
            emissiveIntensity: 0.15
        })
    );
    ribbon.position.set(0, -H * 0.12, 0.05);
    ribbon.rotation.z = -0.06;
    envelope.add(ribbon);

    const flapPivot = new THREE.Group();
    flapPivot.position.set(0, H / 2 - 0.02, 0.04);
    envelope.add(flapPivot);

    const flap = new THREE.Mesh(
        new THREE.PlaneGeometry(W, flapH),
        createPaperMaterial(COLORS.flap, { roughness: 0.78 })
    );
    flap.position.set(0, -flapH / 2, 0);
    flapPivot.add(flap);

    let cardTexture = null;
    const card = new THREE.Mesh(
        new THREE.PlaneGeometry(W * 0.88, H * 0.82),
        new THREE.MeshStandardMaterial({
            color: COLORS.card,
            roughness: 0.85,
            metalness: 0.02
        })
    );
    card.position.set(0, -0.08, 0.06);
    envelope.add(card);

    // Particle trail for card reveal
    const trailParticles = [];
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.PointsMaterial({
        color: COLORS.gold,
        size: 0.04,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const trailPoints = new THREE.Points(trailGeometry, trailMaterial);
    envelope.add(trailPoints);

    const sealWorld = new THREE.Vector3(0, 0.42, 0.12);

    let visible = false;
    let running = true;
    let opened = false;
    let openResolve = null;
    let openStartTime = null;
    const clock = new THREE.Clock();
    const openDuration = reducedMotion ? 0.35 : 2.8;

    const state = {
        idle: true,
        openT: 0,
        shake: 0,
        cameraLookAt: new THREE.Vector3(0, -0.05, 0)
    };

    function resize() {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (w < 1 || h < 1) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    }

    function projectSeal() {
        if (!sealEl || !onSealScreenPosition) return;
        const p = sealWorld.clone();
        envelope.localToWorld(p);
        root.localToWorld(p);
        p.project(camera);
        const rect = host.getBoundingClientRect();
        const x = rect.left + (p.x * 0.5 + 0.5) * rect.width;
        const y = rect.top + (-p.y * 0.5 + 0.5) * rect.height;
        onSealScreenPosition(x, y);
    }

    function projectCardAnchor() {
        if (!cardAnchor) return;
        const p = new THREE.Vector3();
        card.getWorldPosition(p);
        p.project(camera);
        const rect = host.getBoundingClientRect();
        const x = rect.left + (p.x * 0.5 + 0.5) * rect.width;
        const y = rect.top + (-p.y * 0.5 + 0.5) * rect.height;
        cardAnchor.style.left = `${x}px`;
        cardAnchor.style.top = `${y}px`;
    }

    function tick() {
        if (!running) return;
        requestAnimationFrame(tick);

        const t = clock.getElapsedTime();

        if (state.idle && !opened) {
            root.position.y = Math.sin(t * 1.2) * 0.04;
            root.rotation.y = Math.sin(t * 0.7) * 0.04;
            root.rotation.x = Math.sin(t * 0.55) * 0.025;
        }

        if (openStartTime !== null) {
            const elapsed = t - openStartTime;
            state.openT = Math.min(1, elapsed / openDuration);
            if (state.openT >= 1 && openResolve) {
                openResolve();
                openResolve = null;
            }
        }

        const ot = state.openT;

        if (state.shake > 0) {
            state.shake = Math.max(0, state.shake - clock.getDelta());
            const s = state.shake * 8;
            root.rotation.z = Math.sin(t * 40) * 0.03 * s;
        } else {
            root.rotation.z *= 0.92;
        }

        // Flap opening: smooth start, opens fully by 45% of animation
        const flapEnd = 0.45;
        const flapT = Math.min(1, ot / flapEnd);
        const flapEase = easeInOutQuart(flapT);
        flapPivot.rotation.x = -flapEase * Math.PI * 0.95;

        // Card reveal: starts at 25%, smooth overlap with flap
        const cardStart = 0.25;
        const cardT = ot <= cardStart ? 0 : (ot - cardStart) / (1 - cardStart);
        const cardEase = easeOutBack(Math.min(1, cardT));

        // Card movement with improved trajectory
        card.position.y = -0.08 + cardEase * 1.75;
        card.position.z = 0.06 + cardEase * 1.05;
        
        // Card rotation for more dynamic reveal
        const cardRotT = Math.min(1, cardT * 1.2);
        card.rotation.x = -cardRotT * 0.18 + (1 - cardRotT) * 0.05;
        card.rotation.z = Math.sin(cardT * Math.PI) * 0.08;
        
        // Card scale with slight overshoot
        const scaleT = Math.min(1, cardT * 1.15);
        card.scale.setScalar(1 + easeOutBack(scaleT) * 0.12);

        // Particle trail effect during card reveal
        if (cardT > 0.05 && cardT < 0.95 && !reducedMotion) {
            if (Math.random() < 0.3) {
                const worldPos = new THREE.Vector3();
                card.getWorldPosition(worldPos);
                trailParticles.push({
                    pos: worldPos.clone(),
                    life: 1.0,
                    vel: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.02,
                        (Math.random() - 0.5) * 0.02,
                        (Math.random() - 0.5) * 0.02
                    )
                });
            }
        }

        // Update trail particles
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            const p = trailParticles[i];
            p.life -= clock.getDelta() * 1.5;
            p.pos.add(p.vel);
            if (p.life <= 0) {
                trailParticles.splice(i, 1);
            }
        }

        // Update trail geometry (avoid stale vertices + GPU attribute churn)
        if (trailParticles.length > 0) {
            const positions = new Float32Array(trailParticles.length * 3);
            trailParticles.forEach((p, i) => {
                positions[i * 3] = p.pos.x;
                positions[i * 3 + 1] = p.pos.y;
                positions[i * 3 + 2] = p.pos.z;
            });
            const prev = trailGeometry.getAttribute('position');
            if (prev) trailGeometry.deleteAttribute('position');
            trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            trailGeometry.setDrawRange(0, trailParticles.length);
            trailMaterial.opacity = 0.6 * Math.min(1, trailParticles.length / 20);
            trailPoints.visible = true;
        } else {
            if (trailGeometry.getAttribute('position')) trailGeometry.deleteAttribute('position');
            trailGeometry.setDrawRange(0, 0);
            trailPoints.visible = false;
        }

        // Camera animation: follows the card smoothly
        if (!reducedMotion && ot > 0.2 && ot < 1) {
            const camT = Math.max(0, (ot - 0.2) / 0.8);
            const camEase = easeInOutQuart(camT);
            
            // Camera moves closer and up to follow card
            camera.position.y = cameraInitial.position.y + camEase * 0.25;
            camera.position.z = cameraInitial.position.z - camEase * 0.6;
            
            // Camera FOV zoom for dramatic effect
            camera.fov = cameraInitial.fov - camEase * 6;
            camera.updateProjectionMatrix();
            
            // Camera looks at card as it rises
            state.cameraLookAt.y = cameraInitial.lookAt.y + camEase * 0.8;
            camera.lookAt(state.cameraLookAt);
        }

        if (visible) {
            renderer.render(scene, camera);
            projectSeal();
            projectCardAnchor();
        }
    }

    async function init() {
        await loadFonts();
        cardTexture = createCardTexture({
            couple: couple || 'نــدا & أحمــد',
            eyebrow: 'دعوة زفاف',
            dates: ''
        });
        card.material.map = cardTexture;
        card.material.needsUpdate = true;
        if (sealEl && sealLetter) sealEl.textContent = sealLetter;
        resize();
        tick();
    }

    function show() {
        visible = true;
        host.classList.add('is-visible');
        resize();
    }

    function hide() {
        visible = false;
        host.classList.remove('is-visible');
    }

    function setPointerParallax(clientX, clientY) {
        if (opened || reducedMotion) return;
        const rect = host.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        root.rotation.y = x * 0.22;
        root.rotation.x = -y * 0.16;
    }

    function resetParallax() {
        root.rotation.x *= 0.85;
        root.rotation.y *= 0.85;
    }

    function playOpen({ shake = true } = {}) {
        if (opened) return Promise.resolve();
        opened = true;
        state.idle = false;

        if (shake && !reducedMotion) {
            state.shake = 1;
        }

        state.openT = 0;
        openStartTime = clock.getElapsedTime();

        return new Promise((resolve) => {
            openResolve = resolve;
        });
    }

    function dispose() {
        running = false;
        renderer.dispose();
        cardTexture?.dispose();
        card.geometry.dispose();
        card.material.dispose();
        trailGeometry.dispose();
        trailMaterial.dispose();
    }

    return {
        init,
        show,
        hide,
        playOpen,
        setPointerParallax,
        resetParallax,
        resize,
        dispose,
        getCardElement: () => cardAnchor,
        isVisible: () => visible
    };
}
