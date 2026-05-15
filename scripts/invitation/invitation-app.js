import { createCountdown } from './countdown.js';
import { createCalendarService } from './calendar.js';
import { createEffects } from './effects.js';
import { initEventTimeline } from './event-timeline.js';

export function createInvitationApp(config) {
    const initCountdown = createCountdown(config.countdownTarget);
    const calendar = createCalendarService(config.calendar);
    const effects = createEffects(config.effects);

    function bindCalendarButtons(root) {
        root.addEventListener('click', (event) => {
            const button = event.target.closest('[data-calendar]');
            if (!button) return;

            const action = button.getAttribute('data-calendar');
            if (action === 'nikah') calendar.openNikah();
            else if (action === 'wedding') calendar.openWedding();
            else if (action === 'full') calendar.openFullDay();
        });
    }

    function applyMapLinks(root) {
        const mosqueLink = root.querySelector('[data-map="mosque"]');
        const hallLink = root.querySelector('[data-map="hall"]');
        if (mosqueLink) mosqueLink.href = config.maps.mosque;
        if (hallLink) hallLink.href = config.maps.hall;
    }

    return {
        init() {
            const root = document.getElementById('invitation-app');
            if (!root) return;

            applyMapLinks(root);
            bindCalendarButtons(root);
            initCountdown();
            initEventTimeline(config.events);
            effects.initAOS();
            effects.runWelcomeConfetti();
        }
    };
}
