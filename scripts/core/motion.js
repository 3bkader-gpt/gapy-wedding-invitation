export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchDevice() {
    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
    );
}

export function applyReducedMotionClass(root) {
    if (prefersReducedMotion()) {
        root.classList.add('reduced-motion');
    }
}
