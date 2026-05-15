export function createEnvelopeStorage(storageKey) {
    return {
        hasSeen() {
            try {
                return sessionStorage.getItem(storageKey) === '1';
            } catch {
                return false;
            }
        },
        markSeen() {
            try {
                sessionStorage.setItem(storageKey, '1');
            } catch {
                /* sessionStorage unavailable */
            }
        }
    };
}
