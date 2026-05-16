/**
 * Plays two MP3s in sequence from a user gesture (seal click).
 * Part 2 starts after part 1 ends + configurable gap (ms).
 * Part 1 play() runs synchronously in the click stack to satisfy browser autoplay rules.
 * Automatically pauses when user switches tabs or leaves the page.
 */
export function createEnvelopeRevealAudio({ part1Url, part2Url, gapAfterPart1Ms = 1000 }) {
    let audio1 = null;
    let audio2 = null;
    let gapTimer = null;
    let isPlaying = false;

    function clearGapTimer() {
        if (gapTimer != null) {
            clearTimeout(gapTimer);
            gapTimer = null;
        }
    }

    function stop() {
        clearGapTimer();
        isPlaying = false;
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

    function pause() {
        if (audio1 && !audio1.paused) {
            audio1.pause();
        }
        if (audio2 && !audio2.paused) {
            audio2.pause();
        }
    }

    function resume() {
        if (isPlaying) {
            if (audio1 && audio1.paused && audio1.currentTime > 0 && audio1.currentTime < audio1.duration) {
                audio1.play().catch(() => {});
            } else if (audio2 && audio2.paused && audio2.currentTime > 0 && audio2.currentTime < audio2.duration) {
                audio2.play().catch(() => {});
            }
        }
    }

    function startFromUserGesture() {
        stop();
        isPlaying = true;
        audio1 = new Audio(part1Url);
        audio2 = new Audio(part2Url);
        audio1.preload = 'auto';
        audio2.preload = 'auto';

        const onPart1Ended = () => {
            clearGapTimer();
            gapTimer = setTimeout(() => {
                gapTimer = null;
                if (!audio2 || !isPlaying) return;
                audio2.currentTime = 0;
                audio2.play().catch(() => {});
            }, gapAfterPart1Ms);
        };

        audio1.addEventListener('ended', onPart1Ended, { once: true });
        audio1.play().catch(() => {});
    }

    // Page Visibility API - pause when user switches tabs or minimizes window
    function handleVisibilityChange() {
        if (document.hidden) {
            pause();
        } else {
            resume();
        }
    }

    // Stop audio completely when user leaves the page
    function handlePageUnload() {
        stop();
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for page unload events
    window.addEventListener('beforeunload', handlePageUnload);
    window.addEventListener('pagehide', handlePageUnload);

    return {
        startFromUserGesture,
        stop,
        pause,
        resume,
        cleanup() {
            stop();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handlePageUnload);
            window.removeEventListener('pagehide', handlePageUnload);
        }
    };
}

