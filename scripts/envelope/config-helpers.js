export function isPhaseEnabled(envelopeConfig, phase) {
    return envelopeConfig?.enhancements?.[phase]?.enabled !== false;
}

export function isFeatureEnabled(envelopeConfig, phase, feature) {
    if (!isPhaseEnabled(envelopeConfig, phase)) return false;
    const value = envelopeConfig?.enhancements?.[phase]?.[feature];
    return value !== false;
}

export function isAnyFeatureEnabled(envelopeConfig, phase, features) {
    return features.some((f) => isFeatureEnabled(envelopeConfig, phase, f));
}
