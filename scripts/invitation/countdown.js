const pad = (n) => String(n).padStart(2, '0');

export function createCountdown(targetIso) {
    const targetMs = new Date(targetIso).getTime();

    return function initCountdown() {
        const el = document.getElementById('countdown');
        if (!el) return;

        const tick = () => {
            const distance = targetMs - Date.now();

            if (distance < 0) {
                el.innerHTML = '<p class="countdown-done">اليوم المنتظر!</p>';
                el.style.maxWidth = '100%';
                return;
            }

            const days = document.getElementById('days');
            const hours = document.getElementById('hours');
            const minutes = document.getElementById('minutes');
            const seconds = document.getElementById('seconds');

            if (!days || !hours || !minutes || !seconds) return;

            days.textContent = pad(Math.floor(distance / 86400000));
            hours.textContent = pad(Math.floor((distance % 86400000) / 3600000));
            minutes.textContent = pad(Math.floor((distance % 3600000) / 60000));
            seconds.textContent = pad(Math.floor((distance % 60000) / 1000));
        };

        tick();
        setInterval(tick, 1000);
    };
}
