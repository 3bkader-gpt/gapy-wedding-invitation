export const invitationConfig = {
    couple: {
        display: 'نــدا & أحمــد',
        sealLetter: 'ن'
    },
    countdownTarget: '2026-05-22T16:00:00',
    events: {
        daysBetween: 14,
        nikah: {
            title: 'عقد القران',
            badge: 'الظهر',
            date: {
                day: 22,
                month: 5,
                monthName: 'مايو',
                year: 2026,
                display: '22 مايو 2026'
            },
            timeNote: 'عقب صلاة العصر مباشرة',
            place: 'مسجد أبو سليمة',
            mapKey: 'mosque',
            calendarKey: 'nikah'
        },
        wedding: {
            title: 'حفل الزفاف',
            badge: 'المساء',
            date: {
                day: 5,
                month: 6,
                monthName: 'يونيو',
                year: 2026,
                display: '5 يونيو 2026'
            },
            timeNote: 'مساءً',
            place: 'قاعة لاروز، منتجع أفلاطون',
            placeNote: '(جوي سيتي سابقاً) — شرق النيل',
            mapKey: 'hall',
            calendarKey: 'wedding'
        }
    },
    maps: {
        mosque: 'https://maps.app.goo.gl/cXompv7oYnnhCZgY7',
        hall: 'https://maps.app.goo.gl/fc2zd8q1dpbjndmJ6'
    },
    calendar: {
        nikah: {
            title: 'عقد قران ندا وأحمد',
            start: '20260522T140000Z',
            end: '20260522T150000Z',
            location: 'مسجد أبو سليمة، أسوان',
            details: 'عقب صلاة العصر مباشرة — دعوة زفاف ندا وأحمد'
        },
        wedding: {
            title: 'حفل زفاف ندا وأحمد',
            start: '20260605T180000Z',
            end: '20260605T220000Z',
            location: 'قاعة لاروز، منتجع أفلاطون شرق النيل، أسوان',
            details: 'حفل الزفاف — 5 يونيو 2026 — دعوة ندا وأحمد'
        },
        fullDay: {
            title: 'مواعيد فرحة ندا وأحمد',
            start: '20260522T130000Z',
            end: '20260605T220000Z',
            location: 'أسوان — مسجد أبو سليمة ثم قاعة لاروز',
            details: 'عقد القران 22 مايو — حفل الزفاف 5 يونيو — دعوة ندا وأحمد'
        }
    },
    envelope: {
        storageKey: 'gapy_envelope_seen_v1',
        welcomeText: 'وصلتك دعوة...',
        renderer: 'dom',
        /** Audio: files live in repo (Pages/GitHub = static CDN). No external host needed. */
        audio: {
            enabled: true,
            revealPart1: 'assets/audio/envelope-reveal-1.mp3',
            revealPart2: 'assets/audio/envelope-reveal-2.mp3',
            gapAfterPart1Ms: 1000
        },
        timings: {
            cardLift: 4500,
            fadeOut: 1500,
            shake: 400,
            sealMelt: 700,
            welcomeDisplay: 2000,
            welcomeFadeIn: 500,
            flapOpen: 1200,
            cardRevealDelay: 250,
            cardRevealDuration: 2400,
            loadingMin: 500,
            instructionHide: 3500,
            confettiDuration: 2500,
            musicFade: 800
        },
        enhancements: {
            quick: {
                enabled: true,
                patterns: true,
                shimmer: true,
                shadows: true,
                texture: true
            },
            medium: {
                enabled: true,
                ribbon: true,
                flowers: true,
                shake: true,
                particles: true,
                sounds: false,
                smoothReveal: true,
                sealMelt: true
            },
            advanced: {
                enabled: true,
                confetti: true,
                parallax: true,
                hoverEffect: true,
                welcomeMessage: true,
                loading: true,
                instructions: true,
                clickSound: false,
                music: false
            }
        }
    },
    effects: {
        confettiDuration: 3000,
        aosDuration: 1200
    }
};
