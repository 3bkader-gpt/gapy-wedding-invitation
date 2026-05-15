/**
 * Plays two MP3s in sequence from a user gesture (seal click).
 * Part 2 starts after part 1 ends + configurable gap (ms).
 * Part 1 play() runs synchronously in the click stack to satisfy browser autoplay rules.
 */
export function createEnvelopeRevealAudio({ part1Url, part2Url, gapAfterPart1Ms = 1000 }) {
    let audio1 = null;
    let audio2 = null;
    let gapTimer = null;

    function clearGapTimer() {
        if (gapTimer != null) {
            clearTimeout(gapTimer);
            gapTimer = null;
        }
    }

    function stop() {
        clearGapTimer();
        if (audio1) {
            audio1.pause();
            audio1.src = '';
            audio1 = null;
        }
        if (audio2) {
            audio2.pause();
            audio2.src = '';
            audio2 = null;
        }
    }

    function startFromUserGesture() {
        stop();
        audio1 = new Audio(part1Url);
        audio2 = new Audio(part2Url);
        audio1.preload = 'auto';
        audio2.preload = 'auto';

        const onPart1Ended = () => {
            clearGapTimer();
            gapTimer = setTimeout(() => {
                gapTimer = null;
                if (!audio2) return;
                audio2.currentTime = 0;
                audio2.play().catch(() => {});
            }, gapAfterPart1Ms);
        };

        audio1.addEventListener('ended', onPart1Ended, { once: true });
        audio1.play().catch(() => {});
    }

    return { startFromUserGesture, stop };
}
