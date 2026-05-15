function openGoogleCalendar({ title, start, end, location, details }) {
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${start}/${end}`,
        location: location || '',
        details: details || ''
    });
    window.open(
        `https://calendar.google.com/calendar/render?${params.toString()}`,
        '_blank',
        'noopener,noreferrer'
    );
}

export function createCalendarService(calendarConfig) {
    return {
        openNikah() {
            openGoogleCalendar(calendarConfig.nikah);
        },
        openWedding() {
            openGoogleCalendar(calendarConfig.wedding);
        },
        openFullDay() {
            openGoogleCalendar(calendarConfig.fullDay);
        }
    };
}
