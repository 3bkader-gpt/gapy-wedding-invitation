import { invitationConfig } from '../config/invitation.config.js';
import { createEnvelopeController } from './envelope/envelope-controller.js';
import { createInvitationApp } from './invitation/invitation-app.js';

function bootstrap() {
    const invitationApp = createInvitationApp(invitationConfig);
    const onInvitationReady = () => invitationApp.init();

    const controller = createEnvelopeController({
        envelopeConfig: invitationConfig.envelope,
        couple: invitationConfig.couple,
        events: invitationConfig.events,
        onComplete: onInvitationReady
    });

    const boot = controller.start?.();
    if (boot != null && typeof boot.catch === 'function') {
        boot.catch((err) => {
            console.error('[invitation] تعذّر تشغيل مشهد الظرف؛ يتم عرض الدعوة.', err);
            document.body.classList.remove('envelope-active');
            document.getElementById('envelope-scene')?.classList.add('is-removed');
            document.getElementById('invitation-app')?.classList.add('is-visible');
            onInvitationReady();
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
